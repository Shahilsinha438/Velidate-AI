import React from "react";
import { motion } from "motion/react";

interface CircularProgressProps {
  score: number;
}

export default function CircularProgress({ score }: CircularProgressProps) {
  // SVG Ring settings
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine colors and rating label based on score
  let ratingLabel = "Unviable";
  let ratingColor = "text-rose-500 dark:text-rose-400 border-rose-500 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/20";
  let strokeColor = "stroke-rose-500 animate-pulse";
  let gradientFrom = "#f43f5e";
  let gradientTo = "#fda4af";

  if (score >= 85) {
    ratingLabel = "Highly Viable (Unicorn Potential)";
    ratingColor = "text-emerald-600 dark:text-emerald-400 border-emerald-500 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20";
    strokeColor = "stroke-emerald-500";
    gradientFrom = "#10b981";
    gradientTo = "#6ee7b7";
  } else if (score >= 70) {
    ratingLabel = "Strong Potential";
    ratingColor = "text-teal-600 dark:text-teal-400 border-teal-500 dark:border-teal-900 bg-teal-50 dark:bg-teal-950/20";
    strokeColor = "stroke-teal-500";
    gradientFrom = "#14b8a6";
    gradientTo = "#5eead4";
  } else if (score >= 50) {
    ratingLabel = "Moderate Viability";
    ratingColor = "text-amber-600 dark:text-amber-400 border-amber-500 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20";
    strokeColor = "stroke-amber-500";
    gradientFrom = "#f59e0b";
    gradientTo = "#fcd34d";
  } else if (score >= 35) {
    ratingLabel = "High Risk / Pivot Required";
    ratingColor = "text-orange-600 dark:text-orange-400 border-orange-500 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20";
    strokeColor = "stroke-orange-500";
    gradientFrom = "#f97316";
    gradientTo = "#ffedd5";
  }

  return (
    <div id="startup-score-container" className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800/80 fill-none"
            strokeWidth={strokeWidth}
          />
          {/* Active Gradient Circle */}
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            className={`${strokeColor} fill-none`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight"
          >
            {score}
          </motion.span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Score
          </span>
        </div>
      </div>

      {/* Rating Tag */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-4 px-3 py-1 text-xs font-bold rounded-full border ${ratingColor} text-center`}
      >
        {ratingLabel}
      </motion.div>
    </div>
  );
}
