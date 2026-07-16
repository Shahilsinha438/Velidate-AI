import React from "react";
import { MarketingChannel, MVPPhase, MonthMilestone } from "../types";
import { Megaphone, Rocket, Calendar, CheckSquare, Target, BarChart2 } from "lucide-react";

interface RoadmapTimelineProps {
  marketingStrategy: MarketingChannel[];
  mvpRoadmap: MVPPhase[];
  businessPlan12Month: MonthMilestone[];
}

export default function RoadmapTimeline({
  marketingStrategy,
  mvpRoadmap,
  businessPlan12Month,
}: RoadmapTimelineProps) {
  return (
    <div id="roadmap-timeline-block" className="space-y-12">
      {/* 1. MARKETING STRATEGY */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-slate-700 dark:text-slate-400" />
            📣 Marketing Strategy
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A targeted Go-To-Market (GTM) playbook for reaching and converting early adopters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print-grid">
          {marketingStrategy.map((strat, idx) => (
            <div key={idx} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md dark:hover:border-slate-700 transition-all duration-150 flex flex-col justify-between print-card">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                  {strat.channel}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {strat.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/60 pt-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <div>
                  Cost: <span className={`font-bold ${strat.cost.toLowerCase().includes('low') ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{strat.cost}</span>
                </div>
                <div>
                  Impact: <span className="font-bold text-indigo-600 dark:text-indigo-400">{strat.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MVP ROADMAP */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-slate-700 dark:text-slate-400" />
            🚀 MVP Roadmap
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Phased development plan designed to achieve maximum validation with minimal initial capital.
          </p>
        </div>

        <div className="relative border-l-2 border-indigo-100 dark:border-indigo-950 pl-6 ml-4 space-y-8 print:border-l-0 print:pl-0 print:ml-0 print-grid">
          {mvpRoadmap.map((mvp, idx) => (
            <div key={idx} className="relative print-card print:border print:p-5 print:rounded-2xl">
              {/* Timeline dot */}
              <div className="absolute -left-10 top-0.5 w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950 border-2 border-indigo-500 dark:border-indigo-400 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 print:hidden">
                {idx + 1}
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">{mvp.phase}</h4>
                  <span className="px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 rounded-full border border-indigo-100 dark:border-indigo-900/30 self-start">
                    {mvp.duration}
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-3">
                  Validation Focus: <span className="text-slate-700 dark:text-slate-300">{mvp.focus}</span>
                </div>

                <div className="p-3.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100/60 dark:border-slate-800/60 max-w-2xl">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                    Key Deliverables
                  </span>
                  <ul className="space-y-1.5">
                    {mvp.keyDeliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 12-MONTH BUSINESS PLAN */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-700 dark:text-slate-400" />
            📅 12-Month Business Plan
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A quarterly breakdown of major business building milestones, operational priorities, and execution pathways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-grid">
          {businessPlan12Month.map((plan, idx) => (
            <div key={idx} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-md dark:hover:border-slate-750 transition-all duration-200 print-card">
              <div className="flex items-center justify-between mb-3 border-b border-slate-50 dark:border-slate-800/60 pb-2.5">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  Quarter {idx + 1}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full">
                  {plan.monthRange}
                </span>
              </div>

              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3.5">
                Objective: {plan.objective}
              </h4>

              <div className="space-y-3">
                {/* Activities */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                    Operational Activities
                  </span>
                  <ul className="space-y-1 pl-1">
                    {plan.activities.map((act, aIdx) => (
                      <li key={aIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 flex-shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Milestones */}
                <div className="pt-2 border-t border-slate-50 dark:border-slate-800/60">
                  <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block mb-1.5">
                    Target Milestones
                  </span>
                  <ul className="space-y-1 pl-1">
                    {plan.milestones.map((ms, mIdx) => (
                      <li key={mIdx} className="text-xs text-indigo-950 dark:text-indigo-300 font-medium flex items-center gap-1.5 bg-indigo-50/50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-md">
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                        <span>{ms}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
