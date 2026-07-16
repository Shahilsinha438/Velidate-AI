import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ValidationRequest } from "../types";
import { 
  Sparkles, 
  Code, 
  Eye, 
  Globe, 
  Settings, 
  Check, 
  Copy, 
  Rocket, 
  AlertCircle, 
  X, 
  ArrowRight,
  Maximize2,
  RefreshCw,
  Palette,
  LayoutGrid
} from "lucide-react";

interface WebpageGeneratorProps {
  request: ValidationRequest;
}

const TEMPLATE_PRESETS = [
  {
    name: "Modern SaaS Landing Page",
    icon: Rocket,
    prompt: "Create a modern, sleek SaaS landing page with dark mode twilight themes, beautiful gradients, a feature grid with cards, clear call-to-actions, and interactive pricing toggles.",
  },
  {
    name: "Minimalist / Warm Aesthetic",
    icon: Palette,
    prompt: "Generate a minimalist, elegant webpage utilizing generous negative space, soft cream backgrounds, high contrast dark charcoal serif headings, responsive interactive accordion FAQs, and a clean newsletter sign-up card.",
  },
  {
    name: "Cyberpunk Tech",
    icon: Code,
    prompt: "Generate a high-tech cyberpunk terminal landing page. Styled with deep obsidian background, neon cyan and violet highlights, responsive interactive system status widgets, monospaced logs panel, and a command terminal CTA.",
  },
  {
    name: "E-Commerce Launch",
    icon: LayoutGrid,
    prompt: "Generate a modern product launch page with a grid showcasing core product collections, clean light cards, responsive cart badges/count counters, customer review sliders, and a primary purchase checkout simulation widget.",
  }
];

export default function WebpageGenerator({ request }: WebpageGeneratorProps) {
  const [customPrompt, setCustomPrompt] = useState(
    `Create a highly professional, high-converting landing page for ${request.ideaName || "our startup"}. Theme it for the ${request.industry || "General Technology"} industry. Include a hero section with a bold headline, key features, an interactive value-added widget, customized pricing in ${request.currencyCode || "USD"} (${request.currencySymbol || "$"}), and a newsletter signup form.`
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState("");

  const LOADING_MESSAGES = [
    "Structuring responsive grid frameworks...",
    "Injecting beautiful Tailwind color palettes...",
    "Composing hero copywriting and value propositions...",
    "Adding dynamic client-side JS interactions...",
    "Polishing responsive touch target layouts...",
    "Assembling Lucide icon classes..."
  ];

  useEffect(() => {
    if (isLoading) {
      let idx = 0;
      setCurrentLoadingMessage(LOADING_MESSAGES[0]);
      const timer = setInterval(() => {
        idx = (idx + 1) % LOADING_MESSAGES.length;
        setCurrentLoadingMessage(LOADING_MESSAGES[idx]);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isLoading]);

  // Initial auto-generation when component mounts, so they see something instantly
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-webpage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ideaName: request.ideaName,
          description: request.description,
          industry: request.industry,
          geography: request.geography,
          customizationPrompt: customPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate webpage. Please try again.");
      }

      const data = await response.json();
      setGeneratedHtml(data.html);
      setActiveTab("preview");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during webpage generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (presetPrompt: string) => {
    setCustomPrompt(
      `${presetPrompt} Specially tailored for our startup "${request.ideaName || "our venture"}" in the ${request.industry || "General Technology"} sector. Set pricing in ${request.currencyCode || "USD"} (${request.currencySymbol || "$"}).`
    );
  };

  return (
    <div id="webpage-generator-section" className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800/80">
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
            Prompt Engineering Playground
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            AI Landing Page &amp; GTM Builder
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Validate your market concept further by instantly spinning up a highly customized, interactive, and responsive landing page for <strong>{request.ideaName || "your startup"}</strong>. Use prompt engineering to customize templates, colors, sections, and client-side interactions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Panel: Prompt & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-5 transition-colors duration-200">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
              <Settings className="w-4 h-4 text-indigo-500" /> Prompt &amp; Style Controls
            </h3>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Style Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATE_PRESETS.map((preset, idx) => {
                  const IconComponent = preset.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset.prompt)}
                      className="flex flex-col items-start gap-1 p-2.5 text-left border border-slate-100 dark:border-slate-850 hover:border-indigo-550/40 dark:hover:border-indigo-500/30 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 rounded-xl transition-all cursor-pointer group"
                    >
                      <span className="p-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <IconComponent className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Prompt Text Area */}
            <div className="space-y-2">
              <label htmlFor="custom-prompt" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex justify-between items-center">
                <span>Tailored Prompt Directive</span>
                <span className="text-[10px] font-mono lowercase">Gemini-3.5-Flash</span>
              </label>
              <textarea
                id="custom-prompt"
                rows={5}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe your design vision..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                Tip: Instruct the AI on specific color hex codes, target layout structures, localized language, or dynamic visual elements to enrich your business preview.
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !customPrompt.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating Page...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                  Generate / Update Webpage
                </>
              )}
            </button>
          </div>

          {/* Quick Stats/Feedback */}
          {generatedHtml && !isLoading && (
            <div className="bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/30 rounded-2xl p-4 text-xs space-y-2 text-slate-600 dark:text-slate-300 transition-all">
              <p className="font-bold text-indigo-850 dark:text-indigo-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-indigo-500" /> Page Successfully Compiled
              </p>
              <p className="leading-relaxed text-[11px]">
                The generated webpage includes optimized viewport layouts, clean styling tags, vector icon initializations, and standalone client-side javascript logic tailored to <strong>{request.ideaName}</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Right Preview Panel: Live rendering inside iframe / Code output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[650px] transition-colors duration-200">
            
            {/* Header controls for output */}
            <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between flex-shrink-0 transition-colors duration-200">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "code"
                      ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" /> Source HTML
                </button>
              </div>

              {generatedHtml && !isLoading && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all border border-slate-200/50 dark:border-slate-800 cursor-pointer active:scale-95"
                    title="Copy HTML code to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Code
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowPublishModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Publish Page
                  </button>
                </div>
              )}
            </div>

            {/* Viewport Frame */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 relative">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 z-10"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1.5 max-w-xs">
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                        Synthesizing Landing Page...
                      </h4>
                      <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 min-h-[16px]">
                        {currentLoadingMessage}
                      </p>
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10"
                  >
                    <AlertCircle className="w-8 h-8 text-rose-500" />
                    <div className="space-y-1 max-w-sm">
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                        Failed to Generate Page
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={handleGenerate}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Retry Generation
                    </button>
                  </motion.div>
                ) : !generatedHtml ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3"
                  >
                    <LayoutGrid className="w-10 h-10 text-slate-300 dark:text-slate-700 animate-pulse" />
                    <div className="space-y-1 max-w-xs">
                      <h4 className="font-extrabold text-sm text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Frame Initializing
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
                        Your prompt engineering request is compiling in the background...
                      </p>
                    </div>
                  </motion.div>
                ) : activeTab === "preview" ? (
                  <motion.iframe
                    key="iframe-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    srcDoc={generatedHtml}
                    className="w-full h-full border-0 bg-white"
                    title="Landing Page Live Preview Frame"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <motion.div
                    key="code-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full overflow-auto bg-slate-950 text-indigo-200 font-mono text-[11px] p-5 leading-relaxed selection:bg-indigo-500 selection:text-white"
                  >
                    <pre className="whitespace-pre-wrap">{generatedHtml}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Notification Popup Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center space-y-5 transition-all"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPublishModal(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mx-auto w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  Publish Feature Coming Soon!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We are actively building the global deployment infrastructure. Soon, you will be able to publish this exact generated landing page to a custom corporate domain with full HTTPS, contact form webhooks, and visitor analytics.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-850 text-left text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Upcoming Capabilities:</span>
                <p>🚀 Instant Global Edge CDNs (under 1s cold starts)</p>
                <p>📩 Secure client-side email capture &amp; Mailchimp pipelines</p>
                <p>📊 High-fidelity SEO optimization &amp; meta tag builder</p>
              </div>

              <button
                onClick={() => setShowPublishModal(false)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
              >
                Acknowledge &amp; Return
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
