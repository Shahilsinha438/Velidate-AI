import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { db, hashPassword } from "./server-db.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy init Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it in the Settings secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper utility to make Gemini calls with exponential backoff retries and model fallbacks (e.g. if 3.5-flash is experiencing 429/503)
async function generateContentWithFallback(
  prompt: string,
  config: any,
  preferredModel: string = "gemini-3.5-flash"
) {
  const modelsToTry = [preferredModel, "gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let retries = 3;
    let delay = 1000; // 1s initial delay

    while (retries > 0) {
      try {
        console.log(`[Gemini API] Attempting generateContent with model "${model}" (${retries} attempts remaining)...`);
        const ai = getGenAI();
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config,
        });
        console.log(`[Gemini API] Success using model "${model}"!`);
        return response;
      } catch (err: any) {
        lastError = err;
        const errorMessage = (err.message || err.toString() || "").toLowerCase();
        
        // Match standard quota, 429, 503, rate-limit, and resource exhausted keywords
        const isTransient = 
          errorMessage.includes("429") || 
          errorMessage.includes("503") || 
          errorMessage.includes("quota") || 
          errorMessage.includes("resource_exhausted") || 
          errorMessage.includes("unavailable") ||
          errorMessage.includes("high demand") ||
          errorMessage.includes("rate-limit") ||
          errorMessage.includes("limit exceeded") ||
          errorMessage.includes("overloaded");

        if (isTransient) {
          console.warn(`[Gemini API] Transient error on model "${model}": ${err.message || err}. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
          retries--;
        } else {
          console.error(`[Gemini API] Non-transient or fatal error on model "${model}": ${err.message || err}. Trying next fallback model.`);
          break; // break retry loop, try next model
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content after exhausting all models and retry attempts.");
}

// Define the comprehensive JSON schema for the Startup Validation Report
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "A startup validator score from 0 to 100, where 0 is extremely poor/unviable and 100 is an incredibly strong, investor-ready unicorn candidate."
    },
    summary: {
      type: Type.STRING,
      description: "A 2-3 sentence high-impact summary of the startup idea's potential, key strengths, and main critical hurdle."
    },
    marketAnalysis: {
      type: Type.OBJECT,
      properties: {
        overview: { type: Type.STRING, description: "Detailed 3-4 sentence analysis of the current market landscape and sector relevance." },
        drivers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key catalysts or secular tailwinds driving demand in this sector (at least 3 items)." },
        barriers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key entry barriers or operational risks in this sector (at least 3 items)." },
        trends: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Emerging technological, regulatory, or demographic trends (at least 3 items)." }
      },
      required: ["overview", "drivers", "barriers", "trends"]
    },
    competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the competitor (or 'Indirect Competitors' / 'Legacy Solutions' if no direct ones exist)." },
          strength: { type: Type.STRING, description: "Core strength of this competitor." },
          weakness: { type: Type.STRING, description: "Core weakness/vulnerability of this competitor." },
          marketShare: { type: Type.STRING, description: "Estimated market standing (e.g. 'Dominant Player (60%)', 'Fast Growing (5%)', 'Niche player')." },
          differentiator: { type: Type.STRING, description: "How the proposed startup will win against or differentiate from them." }
        },
        required: ["name", "strength", "weakness", "marketShare", "differentiator"]
      },
      description: "Competitor mapping of 3 key competitors or alternative solutions."
    },
    marketSize: {
      type: Type.OBJECT,
      properties: {
        tam: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.STRING, description: "The Dollar Value of the Total Addressable Market (e.g. '$45B globally')." },
            definition: { type: Type.STRING, description: "What TAM represents in this context." },
            description: { type: Type.STRING, description: "Brief justification/calculation methodology." }
          },
          required: ["value", "definition", "description"]
        },
        sam: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.STRING, description: "The Dollar Value of the Serviceable Addressable Market (e.g. '$1.2B in North America')." },
            definition: { type: Type.STRING, description: "What SAM represents in this context." },
            description: { type: Type.STRING, description: "Brief justification/calculation methodology." }
          },
          required: ["value", "definition", "description"]
        },
        som: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.STRING, description: "The Dollar Value of the Serviceable Obtainable Market (e.g. '$45M within Year 3')." },
            definition: { type: Type.STRING, description: "What SOM represents in this context." },
            description: { type: Type.STRING, description: "Brief justification/calculation methodology." }
          },
          required: ["value", "definition", "description"]
        }
      },
      required: ["tam", "sam", "som"]
    },
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Strengths of the specific startup idea (at least 4 items)." },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Weaknesses or risks of the specific startup idea (at least 4 items)." },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Future market growth paths or expansion areas (at least 4 items)." },
        threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Macro threats, competitors, or policy changes (at least 4 items)." }
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"]
    },
    revenueModels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          modelName: { type: Type.STRING, description: "E.g. B2B SaaS, Transaction-fee, Premium-freemium, usage-based." },
          description: { type: Type.STRING, description: "Brief operational explanation." },
          pricingStructure: { type: Type.STRING, description: "Suggested pricing details (e.g., '$49/month per seat')." },
          pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pros of this model (at least 2 items)." },
          cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cons of this model (at least 2 items)." }
        },
        required: ["modelName", "description", "pricingStructure", "pros", "cons"]
      },
      description: "2 or 3 highly personalized, viable revenue models."
    },
    targetAudience: {
      type: Type.OBJECT,
      properties: {
        segments: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Audience segment name (e.g. 'Freelance Web Designers')." },
              description: { type: Type.STRING, description: "Who they are." },
              size: { type: Type.STRING, description: "Estimated market share or sizing of this segment." },
              painPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Core problems they face (at least 2 items)." }
            },
            required: ["name", "description", "size", "painPoints"]
          }
        },
        userPersona: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "A realistic representative name (e.g. 'Sarah the Solopreneur')." },
            role: { type: Type.STRING, description: "Job title or life role." },
            bio: { type: Type.STRING, description: "A brief 2-sentence background story." },
            motivations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top motivations (at least 2 items)." },
            frustration: { type: Type.STRING, description: "Their biggest day-to-day bottleneck." }
          },
          required: ["name", "role", "bio", "motivations", "frustration"]
        }
      },
      required: ["segments", "userPersona"]
    },
    marketingStrategy: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          channel: { type: Type.STRING, description: "E.g., LinkedIn outbound, Content marketing, SEO, Strategic partnerships." },
          description: { type: Type.STRING, description: "Actionable marketing action plan." },
          cost: { type: Type.STRING, description: "Relative scale: Low, Medium, High, or specific cost estimates." },
          impact: { type: Type.STRING, description: "Relative scale: Low, Medium, High." }
        },
        required: ["channel", "description", "cost", "impact"]
      },
      description: "3 actionable marketing strategies."
    },
    mvpRoadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING, description: "Phase name (e.g., 'Phase 1: Core Feature Set')." },
          duration: { type: Type.STRING, description: "Timeframe (e.g., 'Weeks 1-4')." },
          keyDeliverables: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Core features to launch (at least 2 deliverables)." },
          focus: { type: Type.STRING, description: "What should be validated in this phase (e.g., 'Core user interaction validation')." }
        },
        required: ["phase", "duration", "keyDeliverables", "focus"]
      },
      description: "A 3-phase phased MVP development and launch roadmap."
    },
    businessPlan12Month: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          monthRange: { type: Type.STRING, description: "E.g. 'Months 1-3: Setup and Alpha', 'Months 4-6: Beta and Early Traction'." },
          objective: { type: Type.STRING, description: "Main target/goal for this period." },
          activities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Core actions / operations (at least 3 items)." },
          milestones: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Primary achievements / targets to hit (at least 2 items)." }
        },
        required: ["monthRange", "objective", "activities", "milestones"]
      },
      description: "A quarterly sequence making up a complete 12-month business operation plan."
    }
  },
  required: [
    "score",
    "summary",
    "marketAnalysis",
    "competitors",
    "marketSize",
    "swot",
    "revenueModels",
    "targetAudience",
    "marketingStrategy",
    "mvpRoadmap",
    "businessPlan12Month"
  ]
};

// API Endpoint to validate a startup idea
app.post("/api/validate", async (req, res) => {
  try {
    const { ideaName, description, industry, geography, fundingStage, targetBudget, currencySymbol, currencyCode } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Idea description is required." });
    }

    const ai = getGenAI();

    const currSym = currencySymbol || "$";
    const currCod = currencyCode || "USD";

    const systemInstruction = `You are an elite Venture Capitalist, startup incubator director, and market research expert. 
Your job is to rigorously validate, score, analyze, and format a startup idea. 
Be analytical, realistic, highly detailed, and quantitative. 
Avoid generic fluff—all details (including TAM/SAM/SOM value justifications, competitor analysis, targets, SWOT points) should be highly contextualized to the specific startup idea, industry, and geography.
Perform actual estimated mathematical deductions for TAM/SAM/SOM sizing based on standard industry statistics or proxies rather than random numbers.

CRITICAL FINANCIAL RULE:
All financial figures, including TAM, SAM, SOM, and pricing structures in the revenue models, MUST be estimated and expressed in the local currency of the targeted geography: ${currCod} (${currSym}). 
All monetary amounts must be denominated in ${currCod} and formatted using its official symbol "${currSym}" (e.g. instead of using USD $, write "${currSym}1.5B" or "${currSym}12,000/month per user").`;

    const prompt = `Validate the following startup idea:
Name: ${ideaName || "Unnamed Venture"}
Industry / Sector: ${industry || "General Technology"}
Primary Target Geography: ${geography || "Global / Unspecified"} (${currCod} - ${currSym})
Core Description: ${description}
Funding Stage / Intent: ${fundingStage || "Pre-Seed / Ideation"}
Target Budget / Initial Capital: ${targetBudget || "Bootstrapped"}

Please provide a full, structured analysis report matching the requested JSON schema. Make sure all TAM/SAM/SOM values and pricing options are written in the local currency ${currCod} using its symbol ${currSym}.`;

    const response = await generateContentWithFallback(prompt, {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.2, // low temperature for analytical consistency
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini.");
    }

    const reportData = JSON.parse(text.trim());
    res.json(reportData);
  } catch (err: any) {
    console.error("Validation error:", err);
    res.status(500).json({ 
      error: err.message || "An unexpected error occurred during analysis.",
      details: err.toString()
    });
  }
});

// Market trends response schema
const marketTrendsResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A highly relevant, specific title for the real-time industry trends (e.g. 'Healthcare AI Trends - Q3 2026')." },
    summary: { type: Type.STRING, description: "A comprehensive 3-4 sentence overview of what is currently happening in the sector based on live search results." },
    trends: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING, description: "The core growth driver, regulatory change, or technology shift (e.g. 'Rapid adoption of LLMs in hospital administrative workflows')." },
          description: { type: Type.STRING, description: "A detailed 2-sentence description with actual stats or contexts if found." },
          sentiment: { type: Type.STRING, description: "Sentiment score or label: E.g., 'Positive / Accelerating', 'Cautionary / Headwind', 'Neutral / Developing'." }
        },
        required: ["headline", "description", "sentiment"]
      },
      description: "3 key real-time trends or market shifts backed by recent info."
    },
    latestNews: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Key news headline or press release topic." },
          impact: { type: Type.STRING, description: "Brief analysis of what this news means for early-stage startups." }
        },
        required: ["title", "impact"]
      },
      description: "2 or 3 recent news topics or sector updates."
    }
  },
  required: ["title", "summary", "trends", "latestNews"]
};

// API Endpoint to fetch latest industry trends via Google Search grounding
app.post("/api/market-trends", async (req, res) => {
  try {
    const { industry, geography } = req.body;
    if (!industry) {
      return res.status(400).json({ error: "Industry is required to fetch trends." });
    }

    const ai = getGenAI();

    const systemInstruction = `You are an elite market intelligence analyst, trend forecaster, and sector researcher.
Your goal is to provide real-time, highly accurate, and up-to-the-minute market trends, growth drivers, regulatory changes, and news for the specified industry and geography.
You MUST utilize Google Search grounding to retrieve current information. 
Focus on specific facts, statistics, active policy debates, and recent news events. Avoid generalized advice.`;

    const prompt = `Search for the latest 2026 industry news, emerging market trends, growth statistics, and key developments for the following:
Industry Sector: ${industry}
Target Geography: ${geography || "Global"}

Provide a structured JSON report matching the requested schema based on your search findings.`;

    const response = await generateContentWithFallback(prompt, {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: marketTrendsResponseSchema,
      temperature: 0.3,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini.");
    }

    const trendData = JSON.parse(text.trim());

    // Extract grounding chunks/sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((c: any) => {
        if (c.web) {
          return {
            title: c.web.title || "Search Source",
            url: c.web.uri || ""
          };
        }
        return null;
      })
      .filter((s: any) => s && s.url);

    // Filter duplicates by URL
    const uniqueSources: { title: string; url: string }[] = [];
    const seenUrls = new Set<string>();
    for (const source of sources) {
      if (source && !seenUrls.has(source.url)) {
        seenUrls.add(source.url);
        uniqueSources.push(source);
      }
    }

    res.json({
      ...trendData,
      sources: uniqueSources
    });
  } catch (err: any) {
    console.error("Market trends error:", err);
    res.status(500).json({
      error: err.message || "Failed to retrieve real-time market trends.",
      details: err.toString()
    });
  }
});

// AUTH ENDPOINTS
app.post("/api/auth/register", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }
    const user = db.createUser(email, password);
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Registration failed." });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const hash = hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Login failed." });
  }
});

// IDEAS ENDPOINTS
app.post("/api/ideas/save", (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }
    const { ideaName, industry, geography, description, fundingStage, targetBudget, report, currencySymbol, currencyCode } = req.body;
    if (!ideaName || !description || !report) {
      return res.status(400).json({ error: "Missing required fields to save idea." });
    }
    const saved = db.saveIdea(userId, {
      ideaName,
      industry: industry || "",
      geography: geography || "",
      description,
      fundingStage: fundingStage || "",
      targetBudget: targetBudget || "",
      report,
      currencySymbol,
      currencyCode,
    });
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save idea." });
  }
});

app.get("/api/ideas", (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(410).json({ error: "User session expired." });
    }
    const ideas = db.getSavedIdeas(userId);
    res.json(ideas);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load saved ideas." });
  }
});

app.delete("/api/ideas/:id", (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const ideaId = req.params.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    const deleted = db.deleteSavedIdea(userId, ideaId);
    if (!deleted) {
      return res.status(404).json({ error: "Saved idea not found or unauthorized." });
    }
    res.json({ success: true, message: "Idea successfully deleted." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete idea." });
  }
});

// SUGGESTIONS ENDPOINTS
app.post("/api/suggestions", (req, res) => {
  try {
    const { email, text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Suggestion text is required." });
    }
    const suggestion = db.addSuggestion(email || "anonymous", text);
    res.status(201).json(suggestion);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to submit suggestion." });
  }
});

app.get("/api/suggestions", (req, res) => {
  try {
    const suggestions = db.getSuggestions();
    res.json(suggestions);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load suggestions." });
  }
});

// FEEDBACK ENDPOINTS
app.post("/api/feedback", (req, res) => {
  try {
    const { ideaName, ratingAccuracy, ratingUsefulness, comment } = req.body;
    if (!ideaName) {
      return res.status(400).json({ error: "Idea name is required." });
    }
    if (typeof ratingAccuracy !== "number" || typeof ratingUsefulness !== "number") {
      return res.status(400).json({ error: "Valid numerical ratings (1-5) are required." });
    }
    const feedback = db.addFeedback(ideaName, ratingAccuracy, ratingUsefulness, comment || "");
    res.status(201).json(feedback);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to submit feedback." });
  }
});

app.get("/api/feedback", (req, res) => {
  try {
    const feedbacks = db.getFeedbacks();
    res.json(feedbacks);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load feedback." });
  }
});

// Serve frontend
app.post("/api/generate-webpage", async (req, res) => {
  try {
    const { ideaName, description, industry, geography, customizationPrompt } = req.body;

    const ai = getGenAI();

    const systemInstruction = `You are an elite UX/UI designer, frontend developer, and startup landing page architect.
Your task is to generate the code for a complete, fully self-contained responsive landing page for the user's startup business.
The landing page should be modern, clean, visually stunning, conversion-focused, and ready to preview in an iframe.

RULES:
1. ONLY return a single HTML document starting with <!DOCTYPE html>.
2. Use Tailwind CSS via the CDN link: <script src="https://cdn.tailwindcss.com"></script>.
3. Include Lucide icons via CDN: <script src="https://unpkg.com/lucide@latest"></script> followed by <script>lucide.createIcons();</script> at the bottom of the body.
4. Ensure the landing page contains:
   - A modern hero section with a compelling value proposition headline, a subheadline, a CTA button, and clean visual layouts.
   - A features/benefits section showcasing the core features.
   - An interactive mock demo or interactive section (like a simple calculator, custom mock app interface, interactive checklist, or feature selector) that responds to user clicks! This makes the generated page interactive and highly impressive.
   - A pricing section styled neatly.
   - A testimonials section with professional placeholders.
   - A clean footer.
5. The page MUST be themed according to the business industry (e.g. green/teal accents for ClimateTech/Sustainability, indigo/violet for AI/Machine Learning, sky/emerald for HealthTech, orange/amber for food/delivery, etc.). Use nice gradients, transitions, and modern cards.
6. Do NOT write any markdown blocks (like \`\`\`html) around the response. Return ONLY raw HTML code. Do NOT return explanation text. Return ONLY the complete HTML string.`;

    const prompt = `Generate a beautiful, responsive, and highly interactive landing page for this startup business:
Name: ${ideaName || "Unnamed Venture"}
Industry / Sector: ${industry || "General Technology"}
Primary Target Geography: ${geography || "Global / Unspecified"}
Core Description: ${description}

CUSTOMIZATION / PROMPT ENGINEERING DIRECTIVES:
${customizationPrompt || "Create a highly modern, professional landing page with a clean layout, a light background, and smooth interactions."}

Remember: Return ONLY valid HTML. Do not wrap in markdown or add anything else. The page must be self-contained and interactive.`;

    const response = await generateContentWithFallback(prompt, {
      systemInstruction,
      temperature: 0.7,
    });

    const htmlCode = response.text;
    if (!htmlCode) {
      throw new Error("Empty response received from Gemini.");
    }

    let cleanedHtml = htmlCode.trim();
    if (cleanedHtml.startsWith("```html")) {
      cleanedHtml = cleanedHtml.replace(/^```html\s*/i, "").replace(/\s*```$/, "");
    } else if (cleanedHtml.startsWith("```")) {
      cleanedHtml = cleanedHtml.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    res.json({ html: cleanedHtml });
  } catch (err: any) {
    console.error("Webpage generation error:", err);
    res.status(500).json({ error: err.message || "An unexpected error occurred during webpage generation." });
  }
});

// Serve frontend
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Startup Idea Validator backend listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
});
