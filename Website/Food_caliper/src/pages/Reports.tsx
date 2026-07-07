import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Loader, 
  Calendar, 
  Activity, 
  Target, 
  FileText, 
  Sparkles, 
  Utensils, 
  Home, 
  Microscope, 
  BarChart4, 
  User, 
  Info,
  Ruler,
  Scale,
  Printer,
  Share2,
  Check,
  Edit3,
  Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundLayout from "@/components/BackgroundLayout";
import Navbar from "@/components/Navbar";
import Dock from "@/components/Dock";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";

const Reports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Feature 4: Actions state
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const dockItems = [
    { 
      icon: <Home size={20} />, 
      label: 'Home', 
      onClick: () => navigate('/') 
    },
    { 
      icon: <Microscope size={20} />, 
      label: 'Analyze', 
      onClick: () => navigate('/analysis') 
    },
    { 
      icon: <BarChart4 size={20} />, 
      label: 'Dashboard', 
      onClick: () => navigate('/dashboard') 
    },
    { 
      icon: <FileText size={20} />, 
      label: 'Reports', 
      onClick: () => navigate('/reports') 
    },
    { 
      icon: <User size={20} />, 
      label: 'Profile', 
      onClick: () => navigate('/profile') 
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReportsData();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Load notes from localStorage when latestAnalysis changes
  useEffect(() => {
    if (latestAnalysis?.id) {
      const savedNotes = localStorage.getItem(`food_caliper_notes_${latestAnalysis.id}`) || "";
      setNotes(savedNotes);
    }
  }, [latestAnalysis]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = apiClient.getUserId();
      if (!userId) {
        setUser({ full_name: "Guest User", email: "Not logged in" });
        setAnalysisHistory([]);
        setLoading(false);
        return;
      }

      // Fetch user profile
      try {
        const profile = await apiClient.getUserProfile(userId);
        setUser(profile);
      } catch (profileErr) {
        console.error("Profile fetch error:", profileErr);
        setUser(null);
      }

      // Fetch analysis history
      try {
        const history = await apiClient.getAnalysisHistory(100, 0);
        console.log("Full analysis history response:", history);
        
        let analysisArray = [];
        if (Array.isArray(history)) {
          analysisArray = history;
        } else if (history?.analyses && Array.isArray(history.analyses)) {
          analysisArray = history.analyses;
        } else if (history?.data && Array.isArray(history.data)) {
          analysisArray = history.data;
        }
        
        console.log("Extracted analysis array:", analysisArray);
        
        if (analysisArray.length > 0) {
          setAnalysisHistory(analysisArray);
          const latest = analysisArray[0];
          setLatestAnalysis(latest);
        } else {
          setAnalysisHistory([]);
          setLatestAnalysis(null);
          console.log("No analysis history found");
        }
      } catch (historyErr) {
        console.error("History fetch error:", historyErr);
        setAnalysisHistory([]);
        setLatestAnalysis(null);
      }
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  // Feature 1: Compute chart data
  const getMacroChartData = () => {
    if (!latestAnalysis?.foods || latestAnalysis.foods.length === 0) return [];
    
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    latestAnalysis.foods.forEach((food: any) => {
      totalProtein += food.protein_g || 0;
      totalCarbs += food.carbohydrates_g || 0;
      totalFat += food.fat_g || 0;
    });

    return [
      { name: "Protein", value: parseFloat(totalProtein.toFixed(1)), color: "hsl(350, 70%, 55%)" },
      { name: "Carbs", value: parseFloat(totalCarbs.toFixed(1)), color: "hsl(30, 90%, 55%)" },
      { name: "Fats", value: parseFloat(totalFat.toFixed(1)), color: "hsl(50, 90%, 50%)" }
    ];
  };

  const macroChartData = getMacroChartData();
  const hasMacros = macroChartData.some(d => d.value > 0);

  // Feature 4: Handle Toolbar
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Shareable link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotes = () => {
    if (latestAnalysis?.id) {
      localStorage.setItem(`food_caliper_notes_${latestAnalysis.id}`, notes);
      setIsEditingNotes(false);
      toast.success("Meal notes saved successfully!");
    }
  };

  if (loading) {
    return (
      <BackgroundLayout>
        <Navbar isAuthenticated={true} />
        <div className="relative z-20 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader className="h-8 w-8 text-primary" />
            </motion.div>
            <p className="text-foreground font-medium">Loading your reports...</p>
          </div>
        </div>
      </BackgroundLayout>
    );
  }

  return (
    <>
      {/* Screen Layout - Only visible on screen */}
      <div className="no-print">
        <BackgroundLayout>
          <Navbar isAuthenticated={true} />
          
          {/* Styles for printing layout cleanly, matching the original reports design */}
          <style>{`
            .print-only {
              display: none !important;
            }

            @media print {
              .print-only {
                display: block !important;
              }
              .no-print {
                display: none !important;
              }
              @page {
                margin: 15mm !important;
                size: portrait !important;
              }
              
              body {
                background: white !important;
                color: black !important;
              }

              /* Page break controls to prevent orphaned headers and split metric sections */
              h2, h3 {
                page-break-after: avoid !important;
                break-after: avoid !important;
              }
              
              .detected-foods, .key-metrics, .nutrition-table {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }

              .print-disclaimer-section {
                page-break-before: always !important;
                break-before: page !important;
              }

              /* Print User Profile Header styles */
              .print-user-header {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                border: 1.5px solid #d1d5db !important;
                border-radius: 12px !important;
                padding: 12px 16px !important;
                margin-bottom: 24px !important;
                background: white !important;
                box-sizing: border-box !important;
              }

              .print-user-profile {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
              }

              .print-avatar, .print-avatar-placeholder {
                width: 40px !important;
                height: 40px !important;
                border-radius: 50% !important;
                border: 1.5px solid #9ca3af !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-weight: bold !important;
                font-size: 14px !important;
                color: #374151 !important;
                background: #f3f4f6 !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
              }
              
              .print-avatar {
                object-fit: cover !important;
              }

              .print-username {
                font-size: 16px !important;
                font-weight: bold !important;
                color: #111827 !important;
              }

              .print-user-metrics {
                border: 1.5px solid #d1d5db !important;
                border-radius: 8px !important;
                padding: 8px 16px !important;
                display: flex !important;
                gap: 16px !important;
                font-size: 13px !important;
                font-weight: 600 !important;
                color: #374151 !important;
                background: white !important;
              }
              
              /* Original reports styling rules */
              .report-container {
                max-width: 750px !important;
                margin: 0 auto !important;
                padding: 20px !important;
                background: white !important;
                color: black !important;
              }

              .report-container h2 {
                font-size: 22px !important;
                font-weight: 600 !important;
                color: #111827 !important;
                margin-top: 28px !important;
                border-bottom: none !important;
                padding-bottom: 0 !important;
              }

              .report-container p {
                font-size: 15px !important;
                line-height: 1.7 !important;
                color: #4b5563 !important;
                margin-top: 10px !important;
              }

              .report-container h2:first-child {
                margin-top: 0 !important;
              }

              .key-metrics {
                max-width: 750px !important;
                margin: 0 auto !important;
                padding: 30px 0 !important;
              }

              .key-metrics h2 {
                font-size: 22px !important;
                font-weight: 600 !important;
                color: #111827 !important;
              }

              .key-metrics p {
                font-size: 15px !important;
                line-height: 1.7 !important;
                color: #4b5563 !important;
                margin-top: 10px !important;
              }

              .metrics-pills {
                display: flex !important;
                gap: 10px !important;
                flex-wrap: wrap !important;
                margin-top: 18px !important;
              }

              .metrics-pills .pill {
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                background: #374151 !important;
                color: #fff !important;
                padding: 8px 14px !important;
                border-radius: 999px !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .metrics-pills .pill strong {
                font-weight: 600 !important;
                color: #e5e7eb !important;
              }

              .detected-foods {
                max-width: 750px !important;
                margin: 0 auto !important;
                padding: 30px 0 !important;
              }

              .detected-foods h2 {
                font-size: 22px !important;
                font-weight: 600 !important;
                color: #111827 !important;
                margin-top: 0 !important;
              }

              .detected-foods p {
                font-size: 15px !important;
                line-height: 1.7 !important;
                color: #4b5563 !important;
                margin-top: 10px !important;
                margin-bottom: 18px !important;
              }

              .food-items-container {
                display: flex !important;
                gap: 8px !important;
                flex-wrap: wrap !important;
                margin-top: 15px !important;
              }

              .food-pill {
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                background: #374151 !important;
                color: #fff !important;
                padding: 10px 16px !important;
                border-radius: 999px !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .food-pill strong {
                font-weight: 600 !important;
                color: #e5e7eb !important;
              }

              .detected-foods-image-container {
                display: flex !important;
                gap: 20px !important;
                margin-top: 20px !important;
                align-items: flex-start !important;
              }

              .detected-foods-image-box {
                flex-shrink: 0 !important;
                border: 2px solid #d1d5db !important;
                border-radius: 12px !important;
                padding: 12px !important;
                min-width: 200px !important;
                max-width: 250px !important;
                background: white !important;
              }

              .detected-foods-image-box img {
                width: 100% !important;
                height: 200px !important;
                object-fit: cover !important;
                border-radius: 8px !important;
                display: block !important;
              }

              .detected-foods-text {
                flex: 1 !important;
                font-size: 15px !important;
                line-height: 1.7 !important;
                color: #4b5563 !important;
              }

              .nutrition-table {
                margin-top: 16px !important;
                display: grid !important;
                grid-template-columns: 1.5fr 1fr 1fr 1fr !important;
                border: 2px solid #d1d5db !important;
                border-radius: 10px !important;
                overflow: hidden !important;
              }

              .table-row {
                display: contents !important;
              }

              .table-row span {
                padding: 12px 14px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                text-align: center !important;
                border-right: 1px solid #d1d5db !important;
                border-bottom: 1px solid #d1d5db !important;
                background: white !important;
                color: black !important;
              }

              .table-row.header span {
                background: #f3f4f6 !important;
                font-weight: bold !important;
                border-bottom: 2px solid #d1d5db !important;
                color: black !important;
              }

              .table-row span.pill {
                background: #e5e7eb !important;
                color: black !important;
                font-weight: bold !important;
                padding: 6px 12px !important;
                border-radius: 999px !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                border: none !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              .table-row span.pill.protein {
                background: #fecaca !important;
                color: #b91c1c !important;
              }
              
              .table-row span.pill.carbs {
                background: #fed7aa !important;
                color: #c2410c !important;
              }
              
              .table-row span.pill.fat {
                background: #fef08a !important;
                color: #a16207 !important;
              }
            }
          `}</style>

      <div className="relative z-20 min-h-[calc(100vh-80px)] px-4 py-12 pb-24 max-w-4xl mx-auto px-4 md:px-8">
        <div>
          {/* Top Actions Row */}
          <div className="no-print flex items-center justify-between gap-4 mb-10">
            {/* Back Button on Left */}
            <motion.button
              whileHover={{ x: -4 }}
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors bg-card/45 border border-border/40 hover:border-border px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-semibold">
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </span>
            </motion.button>

            {/* Action Buttons on Right */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <button
                onClick={handlePrint}
                className="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-border/80 hover:border-border px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl transition-all"
                title="Export Report to PDF"
              >
                <Printer size={13} />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button
                onClick={handleShare}
                className="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-border/80 hover:border-border px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl transition-all"
                title="Copy report shareable URL"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
                <span>
                  {copied ? "Copied!" : (
                    <>
                      <span className="hidden sm:inline">Copy Link</span>
                      <span className="sm:hidden">Link</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* User Profile Card Header */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="no-print mb-10 p-6 glass-card border border-border/60 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.full_name || "User"}
                      className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/20 border-2 border-background"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl border-2 border-background shadow-md">
                      {getInitials(user?.full_name)}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 pt-1">
                  <h1 className="text-2xl font-black text-foreground mb-1">
                    {user?.full_name || user?.username || "User"}
                  </h1>
                  <p className="text-sm text-muted-foreground mb-3 font-medium">
                    {user?.email || "No email"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.created_at 
                      ? `Member since ${new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}`
                      : "Member since recent"}
                  </p>
                </div>
              </div>

              {/* Health Information Grid Row */}
              {(user?.height_cm || user?.weight_kg || user?.age || user?.dietary_preferences) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-border/60">
                  {user?.height_cm && (
                    <div className="bg-muted/10 dark:bg-muted/5 border border-border/30 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Height</p>
                        <p className="text-base font-extrabold text-foreground">{user.height_cm} <span className="text-xs font-normal">cm</span></p>
                      </div>
                      <Ruler size={16} className="text-primary/70" />
                    </div>
                  )}
                  {user?.weight_kg && (
                    <div className="bg-muted/10 dark:bg-muted/5 border border-border/30 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Weight</p>
                        <p className="text-base font-extrabold text-foreground">{user.weight_kg} <span className="text-xs font-normal">kg</span></p>
                      </div>
                      <Scale size={16} className="text-primary/70" />
                    </div>
                  )}
                  {user?.age && (
                    <div className="bg-muted/10 dark:bg-muted/5 border border-border/30 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Age</p>
                        <p className="text-base font-extrabold text-foreground">{user.age} <span className="text-xs font-normal">yrs</span></p>
                      </div>
                      <Calendar size={16} className="text-primary/70" />
                    </div>
                  )}
                  {user?.dietary_preferences && (
                    <div className="col-span-2 md:col-span-1 bg-muted/10 dark:bg-muted/5 border border-border/30 rounded-xl p-3 flex items-center justify-between">
                      <div className="truncate max-w-full">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Diet</p>
                        <p className="text-base font-extrabold text-foreground truncate max-w-full">{user.dietary_preferences}</p>
                      </div>
                      <Utensils size={16} className="text-primary/70 flex-shrink-0" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Redesigned Outer Box Analysis Report Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-16"
          >
            <div className="glass-card p-6 md:p-10 border border-border/60 shadow-xl relative overflow-hidden backdrop-blur-md">
              {/* Decorative Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600" />
              
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                    <FileText size={10} /> Food Analysis Report
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                    {latestAnalysis?.food_items?.[0]?.name || latestAnalysis?.created_at 
                      ? `Report: ${formatDate(latestAnalysis.created_at)}` 
                      : "Latest Analysis"}
                  </h2>
                </div>
                {latestAnalysis?.avg_confidence && (
                  <div className="bg-muted/60 dark:bg-muted/20 border border-border/50 rounded-xl px-4 py-2 flex flex-col items-center justify-center text-center self-start sm:self-auto">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Confidence</span>
                    <span className="text-lg font-black text-primary">
                      {Math.round(latestAnalysis.avg_confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>



              {/* Summary Block */}
              <div className="py-6 border-b border-border/60 space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                  This report provides a comprehensive analysis of the scanned meal, transforming
                  a simple image into meaningful nutritional insights. By interpreting visual details,
                  it estimates portion size, weight, calorie content, and overall composition,
                  offering a clear and practical understanding of the meal at a glance.
                </p>
                
                <div className="bg-muted/20 dark:bg-muted/10 rounded-2xl p-5 border border-border/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Summary</h3>
                  <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                    The analyzed meal is estimated to weigh approximately <strong className="text-foreground font-semibold">{latestAnalysis?.total_weight_grams ? `${latestAnalysis.total_weight_grams}g` : "—"}</strong> and delivers
                    around <strong className="text-foreground font-semibold">{latestAnalysis?.total_calories ? `${Math.round(latestAnalysis.total_calories)} kcal` : "—"}</strong> of energy. Multiple food components have been identified
                    and evaluated to present a balanced view of portion size and nutritional distribution,
                    helping you quickly understand the overall dietary impact.
                  </p>
                </div>
              </div>

              {/* Detected Food Items Section */}
              <div className="py-6 border-b border-border/60">
                <h3 className="text-base md:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Utensils size={18} className="text-primary" />
                  Detected Food Items
                </h3>

                {(latestAnalysis?.image_data || latestAnalysis?.image_path) && (
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start mb-6">
                    <div className="md:col-span-4 bg-muted/20 dark:bg-muted/10 p-3 rounded-2xl border border-border/60 flex flex-col shadow-sm">
                      <img 
                        src={latestAnalysis.image_data || latestAnalysis.image_path} 
                        alt="Latest food analysis" 
                        className="w-full h-44 object-cover rounded-xl shadow-inner"
                      />
                      <span className="text-[10px] text-muted-foreground font-semibold text-center mt-2.5 uppercase tracking-wider">Scanned Meal</span>
                    </div>
                    <div className="md:col-span-6">
                      <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                        The meal is analyzed by examining visual cues such as color, texture, and structure,
                        allowing distinct portions to be identified and separated. Each component is then
                        interpreted individually to understand what items are present on the plate, ensuring
                        a more accurate representation of the meal. As the process completes, the system
                        successfully detects and recognizes the food items, forming the basis for further
                        measurement and nutritional analysis.
                      </p>
                    </div>
                  </div>
                )}

                {latestAnalysis?.foods && latestAnalysis.foods.length > 0 ? (
                  <div className="bg-muted/10 dark:bg-muted/5 rounded-2xl p-5 border border-border/40">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                      Total Items Detected: <span className="text-primary font-black">{latestAnalysis.foods.length}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {latestAnalysis.foods.map((food: any, idx: number) => (
                        <div key={idx} className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full tracking-wide transition-all hover:bg-primary/20">
                          🍽️ <strong>{food.name}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No food items detected in this analysis.</p>
                )}
              </div>

              {/* Key Metrics Section */}
              <div className="py-6 border-b border-border/60">
                <h3 className="text-base md:text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Activity size={18} className="text-primary" />
                  Key Metrics
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground mb-6">
                  Once the food items are clearly identified, their portion size, weight, and overall
                  energy value can be understood more meaningfully. These key measurements offer a
                  clear picture of how much is being consumed and its nutritional impact, making it
                  easier to assess the meal in a practical and relatable way.
                </p>

                {/* Styled Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 px-4 py-3 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💧</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Volume</span>
                    </div>
                    <strong className="text-sm font-bold text-blue-900 dark:text-blue-100">
                      {latestAnalysis?.total_volume_ml ? `${latestAnalysis.total_volume_ml} ml` : "— ml"}
                    </strong>
                  </div>

                  <div className="bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 px-4 py-3 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚖️</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Weight</span>
                    </div>
                    <strong className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                      {latestAnalysis?.total_weight_grams ? `${latestAnalysis.total_weight_grams} g` : "— g"}
                    </strong>
                  </div>

                  <div className="bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 px-4 py-3 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔥</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300">Calories</span>
                    </div>
                    <strong className="text-sm font-bold text-orange-900 dark:text-orange-100">
                      {latestAnalysis?.total_calories ? `${Math.round(latestAnalysis.total_calories)} kcal` : "— kcal"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Feature 1: Nutritional Breakdown Table & Macronutrient Chart */}
              <div className="py-6 border-b border-border/60">
                <h3 className="text-base md:text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Target size={18} className="text-primary" />
                  Nutritional Breakdown
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground mb-6">
                  With the key measurements in place, the meal can be further understood through its
                  nutritional composition. Each food item contributes differently, and the breakdown
                  below highlights how proteins, carbohydrates, and fats are distributed across the meal.
                </p>

                {latestAnalysis?.foods && latestAnalysis.foods.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Table */}
                    <div className="lg:col-span-7 w-full min-w-0">
                      <div className="border border-border/80 rounded-2xl overflow-hidden shadow-sm grid grid-cols-10 text-xs md:text-sm">
                        {/* Table Header Row */}
                        <div className="col-span-10 bg-muted/80 dark:bg-slate-800/80 border-b border-border/80 grid grid-cols-10 font-bold text-muted-foreground text-[9px] md:text-xs uppercase tracking-wider py-3 px-2 sm:px-4 text-center">
                          <div className="col-span-4 text-left font-bold text-foreground truncate">Food Item</div>
                          <div className="col-span-2 text-red-600 dark:text-red-400">Protein</div>
                          <div className="col-span-2 text-orange-600 dark:text-orange-400">Carbs</div>
                          <div className="col-span-2 text-yellow-600 dark:text-yellow-400">Fats</div>
                        </div>
                        
                        {/* Table Body Rows */}
                        {latestAnalysis.foods.map((food: any, idx: number) => (
                          <div key={idx} className="col-span-10 grid grid-cols-10 border-b border-border/40 last:border-b-0 hover:bg-muted/10 transition-colors">
                            <div className="col-span-4 py-3 px-2 sm:px-4 flex items-center text-left font-bold text-foreground truncate" title={food.name}>
                              {food.name}
                            </div>
                            <div className="col-span-2 py-3 px-1 sm:px-4 flex items-center justify-center text-center font-bold text-red-600 dark:text-red-400 bg-red-500/5 dark:bg-red-500/10 border-l border-border/30">
                              {food.protein_g && food.protein_g > 0 ? `${food.protein_g.toFixed(1)}g` : "—"}
                            </div>
                            <div className="col-span-2 py-3 px-1 sm:px-4 flex items-center justify-center text-center font-bold text-orange-600 dark:text-orange-400 bg-orange-500/5 dark:bg-orange-500/10 border-l border-border/30">
                              {food.carbohydrates_g && food.carbohydrates_g > 0 ? `${food.carbohydrates_g.toFixed(1)}g` : "—"}
                            </div>
                            <div className="col-span-2 py-3 px-1 sm:px-4 flex items-center justify-center text-center font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-500/5 dark:bg-yellow-500/10 border-l border-border/30">
                              {food.fat_g && food.fat_g > 0 ? `${food.fat_g.toFixed(1)}g` : "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Pie Chart */}
                    {hasMacros && (
                      <div className="lg:col-span-5 flex flex-col items-center justify-center bg-muted/10 dark:bg-muted/5 border border-border/40 rounded-2xl p-4 shadow-inner w-full min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Macronutrient Ratio (g)</span>
                        <div className="h-48 w-full flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={macroChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={68}
                                paddingAngle={4}
                                dataKey="value"
                              >
                                {macroChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                formatter={(value) => [`${value}g`, 'Amount']}
                                contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '12px' }}
                              />
                              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nutritional breakdown data not available.</p>
                )}
              </div>

              {/* AI Insights Section */}
              <div className="py-6 border-b border-border/60">
                <h3 className="text-base md:text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" />
                  AI Insights
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                  The analysis offers an overall understanding of the meal based on the visual input,
                  with an estimated confidence level of <strong className="text-foreground">{latestAnalysis?.avg_confidence ? `${Math.round(latestAnalysis.avg_confidence * 100)}%` : "90%"}</strong>. This indicates a moderate level of
                  reliability in identifying the food and estimating its measurements. While factors
                  such as lighting, image clarity, or food arrangement may influence precision, the
                  results still provide a useful and practical view of portion size and nutritional impact.
                </p>
              </div>

              {/* Feature 4: Meal Journal & Notes Section */}
              <div className="py-6 border-b border-border/60 no-print">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    Meal Journal & Notes
                  </h3>
                  {!isEditingNotes && (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="cursor-pointer text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg transition-all"
                    >
                      <Edit3 size={12} />
                      Edit Notes
                    </button>
                  )}
                </div>
                
                {isEditingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="cursor-pointer w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="Add personal notes about this meal (e.g. how it tasted, substitutions made, how you felt afterwards)..."
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          const savedNotes = localStorage.getItem(`food_caliper_notes_${latestAnalysis.id}`) || "";
                          setNotes(savedNotes);
                          setIsEditingNotes(false);
                        }}
                        className="cursor-pointer text-xs font-bold text-foreground bg-card border border-border/80 hover:bg-muted px-3.5 py-2 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNotes}
                        className="cursor-pointer text-xs font-bold text-white bg-primary hover:bg-primary/95 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-primary/10"
                      >
                        <Save size={12} />
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/20 dark:bg-muted/10 rounded-2xl p-4 border border-border/40 text-sm min-h-[60px] flex items-center">
                    {notes ? (
                      <p className="text-foreground leading-relaxed italic whitespace-pre-line">"{notes}"</p>
                    ) : (
                      <p className="text-muted-foreground italic text-xs">
                        No notes added. Click "Edit Notes" to write a journal entry for this meal analysis.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Disclaimer footer */}
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground leading-relaxed flex gap-2.5 items-start">
                <Info size={16} className="text-muted-foreground/60 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block mb-0.5">Disclaimer</span>
                  The values presented in this report are estimated based on image analysis and
                  standard nutritional data. Actual results may vary depending on ingredients,
                  preparation methods, and portion sizes. This report is intended to provide general
                  dietary insights and should be used as a reference for understanding food composition,
                  not as a substitute for professional medical or nutritional advice.
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Dock 
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </div>
    </BackgroundLayout>
  </div>

  {/* PDF Print Layout - Only visible during print */}
  <div className="print-only">
    <div className="report-container">
      {/* Print User Profile Header matching hand-drawn sketch */}
      {user && (
        <div className="print-user-header">
          <div className="print-user-profile">
            {user.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" className="print-avatar" />
            ) : (
              <div className="print-avatar-placeholder">
                {getInitials(user.full_name || user.username)}
              </div>
            )}
            <span className="print-username">{user.full_name || user.username}</span>
          </div>
          <div className="print-user-metrics">
            {user.height_cm && <span>Height: {user.height_cm} cm</span>}
            {user.weight_kg && <span>Weight: {user.weight_kg} kg</span>}
            {user.age && <span>Age: {user.age} yrs</span>}
          </div>
        </div>
      )}

      <h2>Food Analysis Report - {latestAnalysis?.food_items?.[0]?.name || latestAnalysis?.created_at ? formatDate(latestAnalysis.created_at) : "Latest Analysis"}</h2>
      <p>
        This report provides a comprehensive analysis of the scanned meal, transforming
        a simple image into meaningful nutritional insights. By interpreting visual details,
        it estimates portion size, weight, calorie content, and overall composition,
        offering a clear and practical understanding of the meal at a glance.
      </p>

      <h2>Summary</h2>
      <p>
        The analyzed meal is estimated to weigh approximately <strong>{latestAnalysis?.total_weight_grams ? `${latestAnalysis.total_weight_grams}g` : "—"}</strong> and delivers
        around <strong>{latestAnalysis?.total_calories ? `${Math.round(latestAnalysis.total_calories)} kcal` : "—"}</strong> of energy. Multiple food components have been identified
        and evaluated to present a balanced view of portion size and nutritional distribution,
        helping you quickly understand the overall dietary impact.
      </p>

      <div className="detected-foods">
        <h2>Detected Food Items</h2>

        {(latestAnalysis?.image_data || latestAnalysis?.image_path) && (
          <div className="detected-foods-image-container">
            <div className="detected-foods-image-box">
              <img 
                src={latestAnalysis.image_data || latestAnalysis.image_path} 
                alt="Latest food analysis" 
              />
            </div>
            <div className="detected-foods-text">
              <p>
                The meal is analyzed by examining visual cues such as color, texture, and structure,
                allowing distinct portions to be identified and separated. Each component is then
                interpreted individually to understand what items are present on the plate, ensuring
                a more accurate representation of the meal. As the process completes, the system
                successfully detects and recognizes the food items, forming the basis for further
                measurement and nutritional analysis.
              </p>
            </div>
          </div>
        )}

        {latestAnalysis?.foods && latestAnalysis.foods.length > 0 ? (
          <div>
            <p style={{marginTop: '5px', marginBottom: '12px'}}>
              <strong>Total Items Detected: {latestAnalysis.foods.length}</strong>
            </p>
            <div className="food-items-container">
              {latestAnalysis.foods.map((food: any, idx: number) => (
                <div key={idx} className="food-pill">
                  🍽️ <strong>{food.name}</strong>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No food items detected in this analysis.</p>
        )}
      </div>

      <div className="key-metrics">
        <h2>Key Metrics</h2>
        <p>
          Once the food items are clearly identified, their portion size, weight, and overall
          energy value can be understood more meaningfully. These key measurements offer a
          clear picture of how much is being consumed and its nutritional impact, making it
          easier to assess the meal in a practical and relatable way.
        </p>

        {/* Pills */}
        <div className="metrics-pills">
          <div className="pill">💧 Volume <strong>{latestAnalysis?.total_volume_ml ? `${latestAnalysis.total_volume_ml} ml` : "— ml"}</strong></div>
          <div className="pill">⚖️ Weight <strong>{latestAnalysis?.total_weight_grams ? `${latestAnalysis.total_weight_grams} g` : "— g"}</strong></div>
          <div className="pill">🔥 Calories <strong>{latestAnalysis?.total_calories ? `${latestAnalysis.total_calories} kcal` : "— kcal"}</strong></div>
        </div>
      </div>

      <h2>Nutritional Breakdown</h2>
      <p>
        With the key measurements in place, the meal can be further understood through its
        nutritional composition. Each food item contributes differently, and the breakdown
        below highlights how proteins, carbohydrates, and fats are distributed across the meal.
      </p>
      {latestAnalysis?.foods && latestAnalysis.foods.length > 0 ? (
        <div className="nutrition-table">
          {/* Header */}
          <div className="table-row header">
            <span>Food Item</span>
            <span>Protein</span>
            <span>Carbs</span>
            <span>Fats</span>
          </div>
          {/* Data Rows */}
          {latestAnalysis.foods.map((food: any, idx: number) => (
            <div key={idx} className="table-row">
              <span><strong>{food.name}</strong></span>
              <span className="pill protein">{food.protein_g && food.protein_g > 0 ? `${food.protein_g.toFixed(1)}g` : "—"}</span>
              <span className="pill carbs">{food.carbohydrates_g && food.carbohydrates_g > 0 ? `${food.carbohydrates_g.toFixed(1)}g` : "—"}</span>
              <span className="pill fat">{food.fat_g && food.fat_g > 0 ? `${food.fat_g.toFixed(1)}g` : "—"}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>Nutritional breakdown data not available.</p>
      )}

      {/* AI Insights & Disclaimer on a fresh page */}
      <div className="print-disclaimer-section">
        <h2>AI Insights</h2>
        <p>
          The analysis offers an overall understanding of the meal based on the visual input,
          with an estimated confidence level of <strong>{latestAnalysis?.avg_confidence ? `${Math.round(latestAnalysis.avg_confidence * 100)}%` : "90%"}</strong>. This indicates a moderate level of
          reliability in identifying the food and estimating its measurements. While factors
          such as lighting, image clarity, or food arrangement may influence precision, the
          results still provide a useful and practical view of portion size and nutritional impact.
        </p>

        <h2>Disclaimer</h2>
        <p>
          The values presented in this report are estimated based on image analysis and
          standard nutritional data. Actual results may vary depending on ingredients,
          preparation methods, and portion sizes. This report is intended to provide general
          dietary insights and should be used as a reference for understanding food composition,
          not as a substitute for professional medical or nutritional advice.
        </p>
      </div>
    </div>
  </div>
</>
  );
};

export default Reports;
