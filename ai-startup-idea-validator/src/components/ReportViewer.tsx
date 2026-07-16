import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { ValidationReport, ValidationRequest } from "../types";
import CircularProgress from "./CircularProgress";
import SwotMatrix from "./SwotMatrix";
import CompetitorMap from "./CompetitorMap";
import MarketSizingChart from "./MarketSizingChart";
import RevenueSuggestions from "./RevenueSuggestions";
import AudiencePersona from "./AudiencePersona";
import RoadmapTimeline from "./RoadmapTimeline";
import MarketTrendsSection from "./MarketTrendsSection";
import WebpageGenerator from "./WebpageGenerator";
import { Download, FileText, ArrowRight, Share2, Printer, MapPin, Briefcase, Landmark, Sparkles, Globe } from "lucide-react";
import { getCountryByGeography } from "../data/countries";

interface ReportViewerProps {
  report: ValidationReport;
  request: ValidationRequest;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 14,
    },
  },
};

export default function ReportViewer({ report, request }: ReportViewerProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<"analysis" | "webpage">("analysis");

  const country = getCountryByGeography(request.geography);
  const currencySymbol = request.currencySymbol || country.symbol;

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
      ref={printAreaRef}
    >
      {/* 1. Header Actions (Sticky / Floating bar for ease of printing) */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 no-print"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-xl text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
              Investor Validation Report Ready
            </h3>
            <p className="text-xs text-slate-400">
              Export to PDF to share with stakeholders or save for your records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl w-full sm:w-fit no-print">
        <button
          onClick={() => setActiveMode("analysis")}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
            activeMode === "analysis"
              ? "bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-100 shadow-sm shadow-indigo-500/5"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          Investor Valuation Report
        </button>
        <button
          onClick={() => setActiveMode("webpage")}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
            activeMode === "webpage"
              ? "bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-100 shadow-sm shadow-indigo-500/5"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          AI Landing Page Builder
        </button>
      </div>

      {activeMode === "webpage" ? (
        <WebpageGenerator request={request} />
      ) : (
        <>
          {/* 1.5. Current Startup Idea Display - Highly aligned with design instructions */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 px-6 py-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm no-print transition-colors duration-200"
      >
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
              Analyzed Startup Concept
            </label>
            <div className="relative">
              <textarea
                value={request.description}
                readOnly
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none resize-none transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Viability Grade</p>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {report.score}<span className="text-slate-300 dark:text-slate-700 text-lg font-normal">/100</span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-400 flex items-center justify-center">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                {report.score >= 80 ? "Elite" : report.score >= 65 ? "High" : "Moderate"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. PRINT EXCLUSIVE HEADER (Hidden on screen, visible on Print) */}
      <div className="hidden print:block border-b border-slate-300 pb-6 mb-8 text-slate-900">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              AI Venture Analysis & Research Report
            </span>
            <h1 className="text-3xl font-black tracking-tight">{request.ideaName || "Unnamed Startup Venture"}</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Strictly confidential analysis prepared by the AI Startup Idea Validator.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">Report ID: SIV-{Math.floor(100000 + Math.random() * 900000)}</span>
            <span className="text-xs font-mono text-slate-400 block">Generated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wide text-[9px]">Sector / Industry</span>
            <span className="font-semibold text-slate-800">{request.industry || "General Technology"}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wide text-[9px]">Target Geography</span>
            <span className="font-semibold text-slate-800">{request.geography || "Global"}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wide text-[9px]">Funding Stage</span>
            <span className="font-semibold text-slate-800">{request.fundingStage || "Pre-Seed / Ideation"}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wide text-[9px]">Initial Budget</span>
            <span className="font-semibold text-slate-800">{request.targetBudget || "Bootstrapped"}</span>
          </div>
        </div>
      </div>

      {/* 3. EXECUTIVE HERO DASHBOARD (Executive summary & Score) */}
      <motion.div
        variants={itemVariants}
        id="executive-summary-section"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 print-grid"
      >
        {/* Score Ring Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between print-card transition-colors duration-200">
          <div className="text-center lg:text-left mb-4">
            <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Startup Viability
            </h4>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Score Assessment
            </span>
          </div>
          <CircularProgress score={report.score} />
        </div>

        {/* Executive Summary Narrative */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between print-card transition-colors duration-200">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                Executive Summary
              </span>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">
                Venture Potential &amp; Core Hurdles
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed font-medium">
              "{report.summary}"
            </p>

            <div className="border-t border-slate-100/80 dark:border-slate-800/60 pt-4 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 no-print">
              <div className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">Geography Target</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{request.geography || "Global / Unspecified"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <Briefcase className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">Sector Focus</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{request.industry || "General Tech"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. MARKET RESEARCH & LANDSCAPE (Overview, Drivers, Trends) */}
      <motion.div
        variants={itemVariants}
        id="market-analysis-section"
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 print-card print-page-break transition-colors duration-200"
      >
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            📊 AI Market Analysis
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Strategic appraisal of industry forces, key drivers, entry barriers, and technological trends.
          </p>
        </div>

        <div className="p-5 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-900/40 rounded-2xl">
          <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-widest mb-2">
            Market Overview
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {report.marketAnalysis.overview}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print-grid">
          {/* Catalysts/Drivers */}
          <div className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-950/30 shadow-sm print-card transition-colors">
            <h5 className="font-bold text-emerald-900 dark:text-emerald-400 text-sm mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Demand Catalysts
            </h5>
            <ul className="space-y-2.5">
              {report.marketAnalysis.drivers.map((driver, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 flex-shrink-0" />
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Barriers */}
          <div className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-955/30 shadow-sm print-card transition-colors">
            <h5 className="font-bold text-rose-900 dark:text-rose-400 text-sm mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Sector Barriers / Friction
            </h5>
            <ul className="space-y-2.5">
              {report.marketAnalysis.barriers.map((barrier, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 flex-shrink-0" />
                  <span>{barrier}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trends */}
          <div className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-950/30 shadow-sm print-card transition-colors">
            <h5 className="font-bold text-indigo-900 dark:text-indigo-400 text-sm mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Secular / Tech Trends
            </h5>
            <ul className="space-y-2.5">
              {report.marketAnalysis.trends.map((trend, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 flex-shrink-0" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* 4.5 REAL-TIME MARKET TRENDS (Grounded Live Search) */}
      <motion.div variants={itemVariants}>
        <MarketTrendsSection 
          industry={request.industry || "General Technology"} 
          geography={request.geography || "Global"} 
        />
      </motion.div>

      {/* 5. MARKET SIZING (TAM/SAM/SOM) */}
      <motion.div
        variants={itemVariants}
        id="market-size-section"
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm print-card print-page-break transition-colors duration-200"
      >
        <MarketSizingChart marketSize={report.marketSize} currencySymbol={currencySymbol} />
      </motion.div>

      {/* 6. SWOT ANALYSIS */}
      <motion.div
        variants={itemVariants}
        id="swot-section"
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm print-card print-page-break transition-colors duration-200"
      >
        <SwotMatrix swot={report.swot} />
      </motion.div>

      {/* 7. COMPETITOR ANALYSIS */}
      <motion.div
        variants={itemVariants}
        id="competitors-section"
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm print-card print-page-break transition-colors duration-200"
      >
        <CompetitorMap competitors={report.competitors} />
      </motion.div>

      {/* 8. AUDIENCE IDENTIFICATION & ICP */}
      <motion.div
        variants={itemVariants}
        id="audience-section"
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm print-card print-page-break transition-colors duration-200"
      >
        <AudiencePersona targetAudience={report.targetAudience} />
      </motion.div>

      {/* 9. REVENUE MODEL SUGGESTIONS */}
      <motion.div
        variants={itemVariants}
        id="revenue-section"
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm print-card print-page-break transition-colors duration-200"
      >
        <RevenueSuggestions revenueModels={report.revenueModels} />
      </motion.div>

      {/* 10. MARKETING STRATEGY, MVP ROADMAP & 12-MONTH PLAN */}
      <motion.div
        variants={itemVariants}
        id="roadmap-section"
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm print-card print-page-break transition-colors duration-200"
      >
        <RoadmapTimeline
          marketingStrategy={report.marketingStrategy}
          mvpRoadmap={report.mvpRoadmap}
          businessPlan12Month={report.businessPlan12Month}
        />
      </motion.div>

        </>
      )}

      {/* Footer print disclaimer */}
      <div className="hidden print:block text-center text-[10px] text-slate-400 pt-8 border-t border-slate-200">
        AI Startup Idea Validator • Generated with Gemini 3.5 Flash Research Engine • Strictly Confidential • © {new Date().getFullYear()} All Rights Reserved.
      </div>
    </motion.div>
  );
}

