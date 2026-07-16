import React, { useState, useEffect } from "react";
import { ValidationRequest, ValidationReport } from "./types";
import StartupForm from "./components/StartupForm";
import ReportViewer from "./components/ReportViewer";
import AuthModal from "./components/AuthModal";
import SuggestionModal from "./components/SuggestionModal";
import FeedbackSection from "./components/FeedbackSection";
import { 
  Sparkles, RotateCcw, AlertCircle, Cpu, LogIn, LogOut, Trash2, 
  FolderClosed, Calendar, Star, HelpCircle, CheckCircle, BarChart3, TrendingUp,
  Sun, Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const LOADING_STEPS = [
  "🤖 Initializing corporate venture analyst model...",
  "📊 Performing semantic scan of target industry landscape...",
  "🏆 Searching competitive registry for direct and indirect alternatives...",
  "📈 Synthesizing statistical proxies for TAM / SAM / SOM calculation...",
  "⚖️ Weighing operational forces for SWOT quadrant calibration...",
  "💰 Structuring value-capturing monetization models...",
  "👥 Creating target buyer segment profiles & Ideal Customer Personas...",
  "🚀 Designing high-integrity phased MVP roadmaps...",
  "📅 Mapping sequential 12-month operational timelines...",
  "⭐ Synthesizing consolidated startup validation score...",
  "📄 Generating investor-ready corporate validation report..."
];

export default function App() {
  const [request, setRequest] = useState<ValidationRequest | null>(null);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dark Mode Theme State
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const cached = localStorage.getItem("theme");
    if (cached === "dark" || cached === "light") return cached;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  // Authentication & Suggestions & Saved Ideas State
  const [user, setUser] = useState<{ id: string; email: string } | null>(() => {
    const cached = localStorage.getItem("validator_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [isSavingIdea, setIsSavingIdea] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // State for rotating loading steps
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 3500);
    } else {
      setLoadingStepIdx(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Load saved ideas on start or when user changes
  const fetchSavedIdeas = async (userId: string) => {
    try {
      const res = await fetch("/api/ideas", {
        headers: {
          "x-user-id": userId,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSavedIdeas(data);
      }
    } catch (err) {
      console.error("Failed to load saved ideas:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedIdeas(user.id);
    } else {
      setSavedIdeas([]);
    }
  }, [user]);

  const handleAuthSuccess = (userData: { id: string; email: string }) => {
    setUser(userData);
    localStorage.setItem("validator_user", JSON.stringify(userData));
    fetchSavedIdeas(userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("validator_user");
    setSavedIdeas([]);
  };

  const handleSaveIdea = async () => {
    if (!user || !request || !report) return;
    setIsSavingIdea(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/ideas/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          ideaName: request.ideaName,
          industry: request.industry,
          geography: request.geography,
          description: request.description,
          fundingStage: request.fundingStage || "",
          targetBudget: request.targetBudget || "",
          report,
          currencySymbol: request.currencySymbol,
          currencyCode: request.currencyCode,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save startup validation report.");
      }

      setSaveSuccess(true);
      fetchSavedIdeas(user.id);
    } catch (err: any) {
      setSaveError(err.message || "An error occurred while saving.");
    } finally {
      setIsSavingIdea(false);
    }
  };

  const handleDeleteSavedIdea = async (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this saved validation report?")) return;

    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.id,
        },
      });

      if (response.ok) {
        fetchSavedIdeas(user.id);
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || "Failed to delete report.");
      }
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  const handleValidateIdea = async (requestData: ValidationRequest) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    setRequest(requestData);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze startup idea. Please try again.");
      }

      const reportData: ValidationReport = await response.json();
      setReport(reportData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during valuation. Please verify your connection and secrets configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRequest(null);
    setReport(null);
    setError(null);
    setSaveSuccess(false);
    setSaveError(null);
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between transition-colors duration-200">
      
      {/* HEADER SECTION (HIDDEN ON PRINT) */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-sm/5 no-print flex-shrink-0 transition-colors duration-200">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white animate-spin-none" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              VALIDATE<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </div>

          {/* Navigation Indicators */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1 cursor-pointer" onClick={handleReset}>Dashboard</span>
              <button onClick={() => setIsSuggestionOpen(true)} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                Suggest Improvement
              </button>
            </div>

            {report && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Validate New
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
              className="p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer shadow-sm flex items-center justify-center"
              aria-label="Toggle Dark Mode"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Auth section */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-xs font-bold transition-all cursor-pointer border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-lg text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 print-container">
        
        <AnimatePresence mode="wait">
          
          {/* 1. INITIAL FORM SCREEN */}
          {!isLoading && !report && (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Marketing Pitch / Context banner */}
              <div className="text-center max-w-2xl mx-auto py-4 space-y-3">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/30 px-3 py-1 rounded-full">
                  Instant Startup Viability Appraisal
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Validate Your Startup Idea Before Building
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                  Submit your business idea to run an automated venture market analysis, map competitor frameworks, calculate TAM/SAM/SOM boundaries, analyze SWOT quadrants, draft roadmaps, and export a ready-to-use investor validation report.
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl flex items-start gap-3 text-rose-800 dark:text-rose-300">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-rose-500" />
                  <div>
                    <h4 className="font-bold text-sm">Analysis Failed</h4>
                    <p className="text-xs text-rose-700/90 dark:text-rose-400 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* TWO COLUMN GRID FOR PORTFOLIO / FORM */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Form column */}
                <div className="lg:col-span-8">
                  <StartupForm onSubmit={handleValidateIdea} isLoading={isLoading} />
                </div>

                {/* Saved Valuations Sidebar Column */}
                <div className="lg:col-span-4 space-y-6">
                  {user ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 transition-colors duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
                          <FolderClosed className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          Saved Valuations
                        </h3>
                        <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-100/30 dark:border-indigo-900/30">
                          {savedIdeas.length} reports
                        </span>
                      </div>

                      {savedIdeas.length === 0 ? (
                        <div className="text-center py-8 px-2 space-y-2">
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">No saved ideas yet</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal max-w-[200px] mx-auto">
                            Submit your startup idea on the left, then click "Save to Profile" on the report screen.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                          {savedIdeas.map((idea) => (
                            <div
                              key={idea.id}
                              onClick={() => {
                                setRequest({
                                  ideaName: idea.ideaName,
                                  industry: idea.industry,
                                  geography: idea.geography,
                                  description: idea.description,
                                  fundingStage: idea.fundingStage,
                                  targetBudget: idea.targetBudget,
                                  currencySymbol: idea.currencySymbol,
                                  currencyCode: idea.currencyCode,
                                });
                                setReport(idea.report);
                              }}
                              className="group p-3 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-100 dark:hover:border-indigo-900 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition-all duration-200 cursor-pointer text-left flex items-start justify-between gap-2.5 relative"
                            >
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {idea.ideaName}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                                  <span className="truncate max-w-[100px]">{idea.industry || "General"}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    {idea.report?.score || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => handleDeleteSavedIdea(idea.id, e)}
                                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 p-1.5 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/5 rounded-full blur-2xl" />
                      
                      <div className="space-y-2">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/20">
                          PRO Features
                        </span>
                        <h3 className="font-black text-base tracking-tight text-white leading-snug">
                          Secure Your Validation Workspace
                        </h3>
                        <p className="text-xs text-indigo-200/90 leading-relaxed">
                          Sign in or create an account to compile a portfolio of startup reports, compare viability ratings, and manage saved data.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAuthOpen(true)}
                        className="w-full bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Sign In / Register
                      </button>
                    </div>
                  )}

                  {/* Operational Methodology Info Widget */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-3 transition-colors duration-200">
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 tracking-tight uppercase">
                      Analysis Parameters
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <li className="flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span><strong>Quantitative TAM/SAM/SOM:</strong> Proxy mathematics calculated per region.</span>
                      </li>
                      <li className="flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span><strong>SWOT Quadrants:</strong> Rigorously calibrated based on direct threat vectors.</span>
                      </li>
                      <li className="flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span><strong>12-Month Execution:</strong> Structured around core milestone outcomes.</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 2. LOADING SCREEN */}
          {isLoading && (
            <motion.div
              key="loading-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-lg mx-auto space-y-6"
            >
              {/* Spinner Container */}
              <div className="relative">
                {/* Rotating ring */}
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
                {/* Center pulse icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                </div>
              </div>

              {/* Loading Status Updates */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg tracking-tight">
                  Running Market Analysis...
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
                  This can take 15 to 30 seconds
                </p>
              </div>

              {/* Live Status text */}
              <div className="h-14 flex items-center justify-center px-6 py-2.5 bg-slate-100/50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl w-full">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStepIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono text-center leading-normal"
                  >
                    {LOADING_STEPS[loadingStepIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Informational reassurance */}
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed">
                We are actively constructing financial formulas for market sizes, checking target audience segment friction, and structuring competitor differentiation.
              </p>
            </motion.div>
          )}

          {/* 3. REPORT VIEWER SCREEN */}
          {!isLoading && report && request && (
            <motion.div
              key="report-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Quick info top bar (to change or retry idea) */}
              <div className="flex items-center justify-between gap-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 no-print">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Report loaded for: <strong>{request.ideaName || "Unnamed Venture"}</strong></span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Validate Another Idea
                </button>
              </div>

              {/* Save Report Actions Banner */}
              <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 no-print transition-colors duration-200">
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {user ? (
                    <span>Logged in as <strong>{user.email}</strong>. Persist this report to access it anytime from your dashboard.</span>
                  ) : (
                    <span>Create a profile workspace to save this corporate valuation report securely.</span>
                  )}
                </div>
                <div>
                  {user ? (
                    saveSuccess ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        Report Saved to Profile
                      </span>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={handleSaveIdea}
                          disabled={isSavingIdea}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isSavingIdea ? (
                            <div className="w-3 h-3 border-2 border-white rounded-full border-t-transparent animate-spin" />
                          ) : (
                            <>
                              <FolderClosed className="w-3.5 h-3.5" />
                              Save to Profile
                            </>
                          )}
                        </button>
                        {saveError && (
                          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{saveError}</span>
                        )}
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => setIsAuthOpen(true)}
                      className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Sign In to Save Report
                    </button>
                  )}
                </div>
              </div>

              {/* Validation Report Details */}
              <ReportViewer report={report} request={request} />

              {/* Model Calibration / Feedback Section */}
              <FeedbackSection ideaName={request.ideaName} />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Bottom Micro-Bar Footer (HIDDEN ON PRINT) */}
      <footer className="h-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6 sm:px-8 flex-shrink-0 text-[10px] font-medium text-slate-400 dark:text-slate-500 no-print transition-colors duration-200">
        <div>Engine Version: v2.4.12-Stable</div>
        <div className="flex gap-4">
          <span>Real-time market data synced 1m ago</span>
          <span className="text-emerald-500 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
            AI Processing Optimised
          </span>
        </div>
      </footer>

      {/* Auth Modal overlay */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Suggestion modal overlay */}
      <SuggestionModal
        isOpen={isSuggestionOpen}
        onClose={() => setIsSuggestionOpen(false)}
        userEmail={user?.email}
      />
    </div>
  );
}
