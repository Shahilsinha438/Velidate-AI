import React from "react";
import { Shield, ShieldAlert, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface SwotMatrixProps {
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export default function SwotMatrix({ swot }: SwotMatrixProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div id="swot-matrix-block" className="space-y-6">
      <div className="flex flex-col md:flex-row items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            ⚠️ SWOT Analysis
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Internal and external strategic factors critical to your venture's viability.
          </p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5 print-grid"
      >
        {/* STRENGTHS */}
        <motion.div 
          variants={itemVariants} 
          className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/40 hover:shadow-sm transition-all duration-200 print-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-400 tracking-tight">
              Strengths (S)
            </h4>
          </div>
          <ul className="space-y-2.5">
            {swot.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* WEAKNESSES */}
        <motion.div 
          variants={itemVariants} 
          className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/80 dark:border-rose-900/40 hover:shadow-sm transition-all duration-200 print-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-rose-900 dark:text-rose-400 tracking-tight">
              Weaknesses (W)
            </h4>
          </div>
          <ul className="space-y-2.5">
            {swot.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* OPPORTUNITIES */}
        <motion.div 
          variants={itemVariants} 
          className="p-5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100/80 dark:border-sky-900/40 hover:shadow-sm transition-all duration-200 print-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-sky-900 dark:text-sky-400 tracking-tight">
              Opportunities (O)
            </h4>
          </div>
          <ul className="space-y-2.5">
            {swot.opportunities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* THREATS */}
        <motion.div 
          variants={itemVariants} 
          className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/80 dark:border-amber-900/40 hover:shadow-sm transition-all duration-200 print-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-amber-900 dark:text-amber-400 tracking-tight">
              Threats (T)
            </h4>
          </div>
          <ul className="space-y-2.5">
            {swot.threats.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
