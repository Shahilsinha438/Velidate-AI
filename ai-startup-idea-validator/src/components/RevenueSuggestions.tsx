import React from "react";
import { RevenueModel } from "../types";
import { Coins, CheckCircle, XCircle } from "lucide-react";

interface RevenueSuggestionsProps {
  revenueModels: RevenueModel[];
}

export default function RevenueSuggestions({ revenueModels }: RevenueSuggestionsProps) {
  return (
    <div id="revenue-suggestions-block" className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          💰 Revenue Model Suggestions
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Suggested monetization structures optimized for your specific target market and scalability goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print-grid">
        {revenueModels.map((model, idx) => {
          const isDark = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 border print-card ${
                isDark
                  ? "bg-slate-900 dark:bg-slate-950 text-white border-slate-800 shadow-xl"
                  : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 border-slate-200 dark:border-slate-800 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl border ${
                    isDark
                      ? "bg-white/5 text-amber-400 border-white/10"
                      : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
                  }`}>
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-extrabold text-base tracking-tight ${isDark ? "text-white" : "text-slate-800 dark:text-white"}`}>
                      {model.modelName}
                    </h4>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      isDark
                        ? "text-amber-300 bg-amber-400/10"
                        : "text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40"
                    }`}>
                      {model.pricingStructure}
                    </span>
                  </div>
                </div>
                
                <p className={`text-sm mb-6 leading-relaxed font-medium ${isDark ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>
                  {model.description}
                </p>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 border-t pt-5 mt-auto ${
                  isDark ? "border-white/10" : "border-slate-100 dark:border-slate-800"
                }`}>
                  {/* Pros */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2.5 ${
                      isDark ? "text-slate-400" : "text-slate-400 dark:text-slate-500"
                    }`}>
                      Strengths &amp; Pros
                    </span>
                    <ul className="space-y-2">
                      {model.pros.map((pro, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs leading-normal">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className={isDark ? "text-slate-200" : "text-slate-600 dark:text-slate-300"}>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2.5 ${
                      isDark ? "text-slate-400" : "text-slate-400 dark:text-slate-500"
                    }`}>
                      Cons &amp; Hurdles
                    </span>
                    <ul className="space-y-2">
                      {model.cons.map((con, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2 text-xs leading-normal">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                          <span className={isDark ? "text-slate-200" : "text-slate-600 dark:text-slate-300"}>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
