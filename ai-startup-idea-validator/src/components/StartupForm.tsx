import React, { useState } from "react";
import { ValidationRequest } from "../types";
import { Sparkles, ArrowRight, Lightbulb, Landmark, HelpCircle, Layers, Globe } from "lucide-react";
import { COUNTRIES } from "../data/countries";

interface StartupFormProps {
  onSubmit: (data: ValidationRequest) => void;
  isLoading: boolean;
}

const INDUSTRY_PRESETS = [
  "B2B SaaS / Productivity",
  "FinTech / Payments",
  "HealthTech / Biotech",
  "ClimateTech / Sustainability",
  "AI / Machine Learning",
  "EdTech / E-Learning",
  "E-Commerce / Consumer Tech",
  "PropTech / Real Estate",
  "Web3 / Cryptocurrencies",
  "Hardware / Robotics"
];

export const getBudgetPresets = (symbol: string) => [
  `Bootstrapped (${symbol}0 - ${symbol}10k)`,
  `Pre-Seed Funding (${symbol}10k - ${symbol}100k)`,
  `Seed Funding (${symbol}100k - ${symbol}500k)`,
  `Series A or Venture Scale (${symbol}500k+)`
];

export function getBudgetPresetIndex(value: string): number {
  const normalized = (value || "").toLowerCase();
  if (normalized.includes("bootstrapped")) return 0;
  if (normalized.includes("pre-seed")) return 1;
  if (normalized.includes("seed")) return 2;
  if (normalized.includes("series a") || normalized.includes("venture scale")) return 3;
  return 0;
}

const STAGE_PRESETS = [
  "Ideation / Simple Concept",
  "MVP Built / Early Testing",
  "Pre-Revenue with Early Beta Users",
  "Post-Revenue seeking Expansion"
];

const SAMPLE_IDEAS = [
  {
    ideaName: "CrumbCast",
    industry: "AI / Machine Learning",
    geography: "Germany",
    currencyCode: "EUR",
    currencySymbol: "€",
    fundingStage: "Ideation / Simple Concept",
    targetBudget: "Bootstrapped ($0 - $10k)",
    description: "An AI-powered B2B inventory optimization platform for small local bakeries that uses local weather patterns, calendar holidays, and historical sensor data to forecast exact daily pastry demand, minimizing food waste by up to 40%."
  },
  {
    ideaName: "VeloShare Cargo",
    industry: "ClimateTech / Sustainability",
    geography: "United States",
    currencyCode: "USD",
    currencySymbol: "$",
    fundingStage: "MVP Built / Early Testing",
    targetBudget: "Pre-Seed Funding ($10k - $100k)",
    description: "A subscription-based rent-to-own heavy-duty cargo e-bike network tailored specifically for independent gig economy delivery riders in high-density urban areas. Includes mobile maintenance support, battery swapping hubs, and dynamic routing software."
  },
  {
    ideaName: "MindSync Workplace",
    industry: "HealthTech / Biotech",
    geography: "India",
    currencyCode: "INR",
    currencySymbol: "₹",
    fundingStage: "Pre-Revenue with Early Beta Users",
    targetBudget: "Seed Funding ($100k - $500k)",
    description: "A corporate mental wellness platform pairing high-stress remote technology workers with certified therapists. Uses unobtrusive AI sentiment logs (from integrated Slack/Teams speech-to-text channels) to flags burn-out signals and auto-schedule preventive micro-interventions."
  }
];

export default function StartupForm({ onSubmit, isLoading }: StartupFormProps) {
  const [formData, setFormData] = useState<ValidationRequest>({
    ideaName: "",
    description: "",
    industry: "B2B SaaS / Productivity",
    geography: "United States",
    currencySymbol: "$",
    currencyCode: "USD",
    fundingStage: "Ideation / Simple Concept",
    targetBudget: "Bootstrapped ($0 - $10k)"
  });

  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "geography") {
      const selectedCountry = COUNTRIES.find(c => c.name === value) || COUNTRIES[0];
      const newSymbol = selectedCountry.symbol;
      const currentIdx = getBudgetPresetIndex(formData.targetBudget);
      const newPresets = getBudgetPresets(newSymbol);
      const updatedBudget = newPresets[currentIdx];

      setFormData(prev => ({ 
        ...prev, 
        geography: value,
        currencySymbol: newSymbol,
        currencyCode: selectedCountry.currency,
        targetBudget: updatedBudget
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === "description") {
        setCharCount(value.length);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.trim().length < 20) {
      alert("Please provide a more detailed description of at least 20 characters.");
      return;
    }
    onSubmit(formData);
  };

  const handleLoadSample = (sample: typeof SAMPLE_IDEAS[0]) => {
    const symbol = sample.currencySymbol || "$";
    const currentIdx = getBudgetPresetIndex(sample.targetBudget);
    const presets = getBudgetPresets(symbol);
    const localizedBudget = presets[currentIdx];

    setFormData({
      ...sample,
      targetBudget: localizedBudget
    });
    setCharCount(sample.description.length);
  };

  return (
    <div id="startup-input-form-block" className="space-y-6">
      {/* Quick load suggestion bar */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Want to test immediately? Load a sample:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_IDEAS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleLoadSample(sample)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 text-xs font-semibold rounded-lg transition-all shadow-sm cursor-pointer"
            >
              🚀 {sample.ideaName}
            </button>
          ))}
        </div>
      </div>

      {/* Main input form */}
      <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Idea Name */}
          <div>
            <label htmlFor="ideaName" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Venture / Idea Name <span className="text-slate-300 dark:text-slate-600 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              id="ideaName"
              name="ideaName"
              value={formData.ideaName}
              onChange={handleChange}
              placeholder="e.g., CrumbCast"
              disabled={isLoading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
            />
          </div>

          {/* Industry Selection */}
          <div>
            <label htmlFor="industry" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Industry / Sector
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
            >
              {INDUSTRY_PRESETS.map((ind, idx) => (
                <option key={idx} value={ind} className="dark:bg-slate-900">
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Target Geography */}
          <div>
            <label htmlFor="geography" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Target Geography (Country &amp; Currency)
            </label>
            <select
              id="geography"
              name="geography"
              value={formData.geography}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60 cursor-pointer"
            >
              {["North America", "Europe", "Asia-Pacific", "Latin America", "Middle East & Africa", "Global"].map((region) => (
                <optgroup key={region} label={region} className="font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-950">
                  {COUNTRIES.filter(c => c.region === region).map((c) => (
                    <option key={c.code} value={c.name} className="font-normal text-slate-800 dark:text-slate-200 dark:bg-slate-900">
                      {c.flag} {c.name} ({c.currency} - {c.symbol})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            
            {/* Currency feedback badge */}
            <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 transition-all duration-200">
              <span>Financial Estimates:</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-900/30">
                {formData.currencyCode || "USD"} ({formData.currencySymbol || "$"})
              </span>
            </p>
          </div>

          {/* Funding Stage */}
          <div>
            <label htmlFor="fundingStage" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Current Stage
            </label>
            <select
              id="fundingStage"
              name="fundingStage"
              value={formData.fundingStage}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
            >
              {STAGE_PRESETS.map((stage, idx) => (
                <option key={idx} value={stage} className="dark:bg-slate-900">
                  {stage}
                </option>
              ))}
            </select>
          </div>

          {/* Target Budget */}
          <div className="md:col-span-2">
            <label htmlFor="targetBudget" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Landmark className="w-3 h-3" /> Initial Capital / Target Scale
            </label>
            <select
              id="targetBudget"
              name="targetBudget"
              value={formData.targetBudget}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
            >
              {getBudgetPresets(formData.currencySymbol || "$").map((bud, idx) => (
                <option key={idx} value={bud} className="dark:bg-slate-900">
                  {bud}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Core Startup Concept &amp; Problem Solved <span className="text-rose-500 font-extrabold">*</span>
            </label>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {charCount} characters (min 20)
            </span>
          </div>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the startup idea in detail. What is the core problem? Who experiences it? How does your product solve it? What is your magic sauce or technology?"
            disabled={isLoading}
            rows={5}
            required
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-relaxed disabled:opacity-60"
          />
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading || formData.description.trim().length < 20}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Venture Capitalist AI Analysing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Analyze and Validate Idea
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
