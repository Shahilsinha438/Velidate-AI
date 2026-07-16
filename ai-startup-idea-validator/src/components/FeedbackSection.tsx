import React, { useState } from "react";
import { Star, CheckCircle, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

interface FeedbackSectionProps {
  ideaName: string;
}

export default function FeedbackSection({ ideaName }: FeedbackSectionProps) {
  const [accuracy, setAccuracy] = useState(0);
  const [usefulness, setUsefulness] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredAccuracy, setHoveredAccuracy] = useState(0);
  const [hoveredUsefulness, setHoveredUsefulness] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accuracy === 0 || usefulness === 0) {
      setError("Please select a rating for both accuracy and usefulness.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ideaName,
          ratingAccuracy: accuracy,
          ratingUsefulness: usefulness,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback. Please try again.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-6 md:p-8 no-print mt-8 transition-colors duration-200">
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 space-y-3"
        >
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thank you for your feedback!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Your evaluation has been logged securely. We use this direct response to calibrate the venture analyst models and improve reporting integrity.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                Calibrate Valuation Engine
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Rate this automatic validation report to help refine the corporate intelligence parameters.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Accuracy Rating */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Analysis Accuracy (1-5 Stars)
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">How realistic/factual are the competitive landscape &amp; SWOT quadrants?</p>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setAccuracy(star)}
                    onMouseEnter={() => setHoveredAccuracy(star)}
                    onMouseLeave={() => setHoveredAccuracy(0)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoveredAccuracy || accuracy)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Usefulness Rating */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Operational Usefulness (1-5 Stars)
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">How applicable are the revenue streams, personas, and 12-month roadmaps?</p>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUsefulness(star)}
                    onMouseEnter={() => setHoveredUsefulness(star)}
                    onMouseLeave={() => setHoveredUsefulness(0)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoveredUsefulness || usefulness)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Additional Review / Critique (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide context or suggestions on how the engine can improve SWOT calibration, TAM accuracy, or roadmap steps..."
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all hover:shadow-md hover:shadow-indigo-500/10 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white rounded-full border-t-transparent animate-spin" />
              ) : (
                "Submit Report Calibration"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
