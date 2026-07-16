import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Newspaper, 
  Globe2, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle,
  Flame,
  CheckCircle2,
  HelpCircle,
  Clock
} from "lucide-react";

interface TrendItem {
  headline: string;
  description: string;
  sentiment: string;
}

interface NewsItem {
  title: string;
  impact: string;
}

interface GroundingSource {
  title: string;
  url: string;
}

interface MarketTrendsData {
  title: string;
  summary: string;
  trends: TrendItem[];
  latestNews: NewsItem[];
  sources: GroundingSource[];
}

interface MarketTrendsSectionProps {
  industry: string;
  geography: string;
}

export default function MarketTrendsSection({ industry, geography }: MarketTrendsSectionProps) {
  const [data, setData] = useState<MarketTrendsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/market-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, geography }),
      });
      if (!response.ok) {
        throw new Error("Failed to load real-time market trends.");
      }
      const resData = await response.json();
      setData(resData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching live trends.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (industry) {
      fetchTrends();
    }
  }, [industry, geography]);

  const getSentimentStyles = (sentiment: string) => {
    const s = sentiment.toLowerCase();
    if (s.includes("positive") || s.includes("accelerat") || s.includes("bullish") || s.includes("grow")) {
      return {
        bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100/60 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400",
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
        dot: "bg-emerald-500"
      };
    }
    if (s.includes("caution") || s.includes("headwind") || s.includes("bearish") || s.includes("risk")) {
      return {
        bg: "bg-rose-50 dark:bg-rose-950/30 border-rose-100/60 dark:border-rose-900/40 text-rose-700 dark:text-rose-400",
        icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />,
        dot: "bg-rose-500"
      };
    }
    return {
      bg: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100/60 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-400",
      icon: <Clock className="w-3.5 h-3.5 text-indigo-500" />,
      dot: "bg-indigo-500"
    };
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 no-print transition-colors duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="space-y-1.5 flex-1">
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-3 w-72 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
          </div>
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center animate-spin">
            <RefreshCw className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-16 w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-44 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl animate-pulse" />
            <div className="h-44 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl animate-pulse" />
            <div className="h-44 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm no-print transition-colors duration-200">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-rose-800 dark:text-rose-300">
            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-sm">Real-time Trends Unavailable</h4>
              <p className="text-xs text-rose-600/90 dark:text-rose-400 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchTrends}
            className="flex-shrink-0 bg-white dark:bg-slate-950 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Grounded Search
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 print-card print-page-break transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-500 animate-pulse" />
              Live Industry Trends & News
            </h3>
            <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/60 dark:border-emerald-900/30 px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Google Search Grounded
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Real-time market shifts and active policy news for <span className="font-bold text-slate-700 dark:text-slate-300">{industry}</span> in <span className="font-bold text-slate-700 dark:text-slate-300">{geography || "Global"}</span>.
          </p>
        </div>
        <button
          onClick={fetchTrends}
          title="Refresh Live Trends"
          className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-xl transition-all cursor-pointer text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 no-print"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Context Summary */}
      <div className="p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/20 dark:from-emerald-950/20 dark:to-teal-950/10 border border-emerald-100/30 dark:border-emerald-900/20 rounded-2xl">
        <h4 className="text-xs font-extrabold text-emerald-800/90 dark:text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          Sector Intelligence Overview
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {data.summary}
        </p>
      </div>

      {/* Main Trends Grid */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Emerging Growth Dynamics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.trends.map((trend, idx) => {
            const styles = getSentimentStyles(trend.sentiment);
            return (
              <div 
                key={idx}
                className="p-5 border border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-950/30 hover:bg-white dark:hover:bg-slate-900 rounded-2xl transition-all duration-200 flex flex-col justify-between gap-4 group hover:shadow-md"
              >
                <div className="space-y-2">
                  <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold px-2 py-0.5 border rounded-md uppercase tracking-wider ${styles.bg}`}>
                    {styles.icon}
                    {trend.sentiment}
                  </span>
                  <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {trend.headline}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {trend.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest News & Events Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1">
            <Newspaper className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Active Sector Developments
            </h4>
          </div>
          <div className="space-y-3">
            {data.latestNews.map((news, idx) => (
              <div 
                key={idx} 
                className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-xl bg-slate-50/20 dark:bg-slate-950/30 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200 space-y-1.5"
              >
                <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 leading-snug">
                  {news.title}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  <strong className="text-emerald-700 dark:text-emerald-400">Startup Impact:</strong> {news.impact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Citations/Grounding Sources list */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1">
            <Globe2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Web Citation Sources
            </h4>
          </div>
          {data.sources && data.sources.length > 0 ? (
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {data.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-slate-100 dark:border-slate-800/60 hover:border-emerald-100 dark:hover:border-emerald-900 rounded-xl bg-slate-50/30 dark:bg-slate-950/30 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/15 transition-all duration-200 flex items-center justify-between gap-3 text-left group cursor-pointer"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-bold text-[11px] text-slate-700 dark:text-slate-300 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {source.title}
                    </p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono truncate">
                      {source.url}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex-shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          ) : (
            <div className="border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 text-center py-8">
              <HelpCircle className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">No direct source links recorded</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[180px] mx-auto mt-0.5">Synthesized using general web grounding indexes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
