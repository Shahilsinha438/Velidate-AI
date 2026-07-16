import React from "react";
import { TargetAudience } from "../types";
import { Users, Smile, Compass, Flame, AlertCircle } from "lucide-react";

interface AudiencePersonaProps {
  targetAudience: TargetAudience;
}

export default function AudiencePersona({ targetAudience }: AudiencePersonaProps) {
  const { segments, userPersona } = targetAudience;

  return (
    <div id="audience-persona-block" className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          👥 Target Audience Identification
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Profiling core market segments and your primary Ideal Customer Profile (ICP).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print-grid">
        {/* Audience Segments */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            Key Customer Segments
          </h4>
          
          <div className="space-y-4">
            {segments.map((segment, idx) => (
              <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 rounded-2xl hover:bg-slate-50/70 dark:hover:bg-slate-950/35 transition-colors duration-150 print-card">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {segment.name}
                  </h5>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                    Est. Size: {segment.size}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                  {segment.description}
                </p>
                
                <div className="flex flex-wrap gap-1.5">
                  {segment.painPoints.map((pain, pIdx) => (
                    <span key={pIdx} className="text-[10px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-100/40 dark:border-rose-900/30 px-2 py-0.5 rounded-full">
                      🔥 {pain}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Persona Profile */}
        <div className="lg:col-span-5">
          <div className="p-5 border border-indigo-100/80 dark:border-indigo-900/40 bg-indigo-50/10 dark:bg-indigo-950/10 rounded-2xl h-full flex flex-col justify-between print-card transition-colors duration-200">
            <div>
              <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                Ideal Buyer Persona (ICP)
              </h4>

              <div className="flex items-center gap-3.5 mb-4">
                {/* Visual Placeholder Avatar */}
                <div className="w-12 h-12 rounded-full bg-indigo-500 dark:bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                  {userPersona.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                    {userPersona.name}
                  </h5>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                    {userPersona.role}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white/60 dark:bg-slate-900/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-800 mb-4 leading-relaxed">
                "{userPersona.bio}"
              </div>

              <div className="space-y-3">
                {/* Motivations */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                    Core Motivations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {userPersona.motivations.map((mot, mIdx) => (
                      <span key={mIdx} className="text-[10px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {mot}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Frustration */}
                <div className="pt-2 border-t border-indigo-50/50 dark:border-indigo-900/30">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                    Key Bottleneck / Frustration
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    {userPersona.frustration}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
