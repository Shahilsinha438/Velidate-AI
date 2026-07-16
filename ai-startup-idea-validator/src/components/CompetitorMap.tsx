import React from "react";
import { Competitor } from "../types";
import { Users, ShieldAlert, Award, Star } from "lucide-react";

interface CompetitorMapProps {
  competitors: Competitor[];
}

export default function CompetitorMap({ competitors }: CompetitorMapProps) {
  return (
    <div id="competitor-map-block" className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          🏆 Competitor Analysis
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Mapping core market alternatives, their relative standing, and your unique differentiator.
        </p>
      </div>

      {/* Desktop view Table */}
      <div className="hidden md:block overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm print-card transition-colors duration-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-5">Competitor Name</th>
              <th className="py-4 px-5">Market Standing</th>
              <th className="py-4 px-5">Core Strength</th>
              <th className="py-4 px-5">Core Weakness</th>
              <th className="py-4 px-5 bg-teal-50/50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-400">Your Differentiator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm text-slate-700 dark:text-slate-300">
            {competitors.map((comp, idx) => (
              <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/25 transition-colors">
                <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                  {comp.name}
                </td>
                <td className="py-4 px-5">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {comp.marketShare}
                  </span>
                </td>
                <td className="py-4 px-5 text-emerald-800 dark:text-emerald-400 bg-emerald-50/10">
                  {comp.strength}
                </td>
                <td className="py-4 px-5 text-rose-800 dark:text-rose-400 bg-rose-50/10">
                  {comp.weakness}
                </td>
                <td className="py-4 px-5 font-medium bg-teal-50/30 dark:bg-teal-950/10 text-teal-950 dark:text-teal-300 border-l border-teal-100/50 dark:border-teal-900/30">
                  <span className="flex items-center gap-1 text-teal-800 dark:text-teal-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-teal-500 stroke-teal-600" />
                    {comp.differentiator}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view Cards */}
      <div className="md:hidden space-y-4 print-grid">
        {competitors.map((comp, idx) => (
          <div key={idx} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm space-y-3.5 print-card transition-colors duration-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">{comp.name}</h4>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {comp.marketShare}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <div className="p-2.5 bg-emerald-50/45 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl">
                <span className="block font-bold text-emerald-900 dark:text-emerald-400 mb-1">Core Strength</span>
                <span className="text-slate-600 dark:text-slate-300 text-xs">{comp.strength}</span>
              </div>
              <div className="p-2.5 bg-rose-50/45 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30 rounded-xl">
                <span className="block font-bold text-rose-900 dark:text-rose-400 mb-1">Core Weakness</span>
                <span className="text-slate-600 dark:text-slate-300 text-xs">{comp.weakness}</span>
              </div>
              <div className="p-3 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100/60 dark:border-teal-900/30 rounded-xl">
                <span className="block font-bold text-teal-900 dark:text-teal-400 mb-1 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-teal-500 stroke-teal-600" />
                  Your Differentiator
                </span>
                <span className="text-teal-950 dark:text-teal-300 font-medium text-xs">{comp.differentiator}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
