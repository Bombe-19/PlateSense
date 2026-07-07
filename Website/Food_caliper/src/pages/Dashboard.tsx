import { motion } from "framer-motion";
import { Search, Layers, Ruler, Scale, Target, Eye, TrendingUp, Home, Microscope, BarChart4, Settings, User, Loader, ChevronLeft, ChevronRight, Pencil, CheckCircle2, Circle, Flame, Zap, Droplet, Activity, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Navbar from "@/components/Navbar";
import BackgroundLayout from "@/components/BackgroundLayout";
import AnimatedCounter from "@/components/AnimatedCounter";
import Dock from "@/components/Dock";
import { Link } from "react-router-dom";
import { apiClient } from "@/services/apiClient";

const COLORS = ["hsl(145, 63%, 42%)", "hsl(260, 50%, 65%)", "hsl(220, 70%, 55%)", "hsl(30, 90%, 55%)"];

// Parse backend UTC dates correctly — append 'Z' so JS converts to local timezone
const parseUTCDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  // Add Z if no timezone info present so JS treats it as UTC (not local)
  if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.includes('-', 10)) {
    return new Date(dateStr + 'Z');
  }
  return new Date(dateStr);
};


const categoryData = [
  { name: "Protein", value: 40 },
  { name: "Carbs", value: 30 },
  { name: "Vegetables", value: 20 },
  { name: "Fruits", value: 10 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleDateStart, setVisibleDateStart] = useState(0);
  const [totalStats, setTotalStats] = useState({
    totalVolume: 0,
    totalWeight: 0,
    totalItems: 0,
    avgConfidence: 0,
  });

  // Generate all dates for the entire year
  const generateDateRange = () => {
    const dates = [];
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    // Generate all dates from start of year to today
    let currentDate = new Date(startOfYear);
    while (currentDate <= today) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates.reverse(); // Newest first
  };

  const dateRange = generateDateRange();
  const visibleDates = dateRange.slice(visibleDateStart, visibleDateStart + 5);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userId = apiClient.getUserId();
      
      if (!userId) {
        navigate("/login");
        return;
      }

      // Fetch user profile
      const profile = await apiClient.getUserProfile(userId);
      setUser(profile);

      // Fetch analysis history
      const history = await apiClient.getAnalysisHistory(10, 0);
      setAnalysisHistory(history.analyses || []);

      // Calculate totals
      if (history.analyses && history.analyses.length > 0) {
        const totals = history.analyses.reduce(
          (acc: any, analysis: any) => ({
            totalVolume: acc.totalVolume + (analysis.total_volume_ml || 0),
            totalWeight: acc.totalWeight + (analysis.total_weight_grams || 0),
            totalItems: acc.totalItems + (analysis.total_items || 0),
            avgConfidence: acc.avgConfidence + (analysis.avg_confidence || 0),
          }),
          { totalVolume: 0, totalWeight: 0, totalItems: 0, avgConfidence: 0 }
        );

        totals.avgConfidence = totals.avgConfidence / history.analyses.length;
        setTotalStats(totals);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <Navbar isAuthenticated />

      <div className="container pt-8 pb-36 px-4 md:px-8 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Greeting */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Hello, {user?.full_name || user?.username || "User"} 👋
                </h1>
                <p className="text-muted-foreground">
                  You analyzed {analysisHistory.length} food items. Total volume: {totalStats.totalVolume.toFixed(0)} ml
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search food, volume, or reports"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </motion.div>

            {/* 3-Column Grid */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* LEFT – Today's Scans with Date Navigation */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔍</span>
                    <h3 className="font-semibold text-foreground">Today's Scans</h3>
                  </div>
                  <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                </div>

                {/* Date Picker with Navigation */}
                <div className="flex items-center gap-2 mb-5">
                  <ChevronLeft 
                    className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                    onClick={() => setVisibleDateStart(Math.max(0, visibleDateStart - 5))}
                  />
                  <div className="flex gap-2 flex-1">
                    {visibleDates.map((date) => {
                      const isSelected = date.toLocaleDateString() === selectedDate.toLocaleDateString();
                      return (
                        <div
                          key={date.toLocaleDateString()}
                          onClick={() => setSelectedDate(new Date(date))}
                          className={`flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                            isSelected
                              ? "bg-orange-500 text-white"
                              : "text-muted-foreground hover:bg-orange-100 dark:hover:bg-orange-900/30"
                          }`}
                        >
                          <span className="text-base font-bold">{date.getDate()}</span>
                          <span>{date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <ChevronRight 
                    className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                    onClick={() => setVisibleDateStart(Math.min(Math.max(0, dateRange.length - 5), visibleDateStart + 5))}
                  />
                </div>

                {/* Scans for Selected Date */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                  {(() => {
                    // Normalize date to YYYY-MM-DD in local timezone to avoid UTC vs local mismatch
                    const toLocalDateStr = (d: Date) =>
                      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    const dateStr = toLocalDateStr(selectedDate);
                    const scansForDate = analysisHistory.filter((analysis: any) => {
                      const analysisDate = parseUTCDate(analysis.date || analysis.analysis_date);
                      return toLocalDateStr(analysisDate) === dateStr;
                    });

                    if (scansForDate.length === 0) {
                      return <p className="text-sm text-muted-foreground text-center py-4">No scans for this date</p>;
                    }

                    return scansForDate.map((analysis: any) => {
                      const analysisTime = parseUTCDate(analysis.date || analysis.analysis_date);
                      const timeStr = analysisTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      return (
                        <div key={analysis.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer group">
                          <div className="mt-1">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">{timeStr}</p>
                            <p className="text-sm font-medium text-foreground truncate">
                              {analysis.image_filename || "Food Analysis"}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Ruler className="h-3 w-3 text-primary" />
                                {analysis.total_volume_ml?.toFixed(0) || 0} ml
                              </span>
                              <span className="flex items-center gap-1">
                                <Scale className="h-3 w-3 text-primary" />
                                {analysis.total_weight_grams?.toFixed(0) || 0} g
                              </span>
                              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                {analysis.avg_confidence?.toFixed(0) || 0}% match
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </motion.div>

              {/* CENTER */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6 lg:col-span-4">
                {/* Reports Container */}
                <div className="glass-card p-6">
                  <h2 className="font-semibold text-foreground mb-4">Reports</h2>
                  {/* Analysis Metrics Cards */}
                  <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: "Weight", value: analysisHistory[0]?.total_weight_grams || 0, suffix: "g", icon: Scale, color: "bg-orange-500", textColor: "text-orange-500", progress: 60 },
                    { label: "Volume", value: analysisHistory[0]?.total_volume_ml || 0, suffix: "ml", icon: Droplet, color: "bg-blue-500", textColor: "text-blue-500", progress: 70 },
                    { label: "Calories", value: analysisHistory[0]?.total_calories || 0, suffix: "kcal", icon: Flame, color: "bg-red-500", textColor: "text-red-500", progress: Math.min((analysisHistory[0]?.total_calories || 0) / 30, 100) },
                    { label: "Nutrients", value: analysisHistory[0]?.total_protein_g || 0, suffix: "g protein", icon: Activity, color: "bg-purple-500", textColor: "text-purple-500", progress: 80 },
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.label}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className="relative p-5 rounded-2xl bg-slate-950/50 dark:bg-[#0f172a] border border-white/10 overflow-hidden shadow-xl backdrop-blur-sm hover:border-white/20 transition-all"
                      >
                        {/* BACKGROUND ICON */}
                        <div className={`absolute top-3 right-3 ${card.textColor} opacity-30`}>
                          <Icon size={60} />
                        </div>

                        {/* CONTENT */}
                        <div className="relative z-10">
                          {/* TITLE */}
                          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                            {card.label}
                          </p>

                          {/* VALUE */}
                          <h3 className="text-2xl font-bold text-white">
                            {typeof card.value === "number"
                              ? card.value.toFixed(0)
                              : card.value}
                            {card.suffix && (
                              <span className="text-sm text-gray-400 ml-1">
                                {card.suffix}
                              </span>
                            )}
                          </h3>

                          {/* PROGRESS BAR */}
                          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${card.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full ${card.color} rounded-full`}
                            />
                          </div>

                          {/* NUTRIENT BREAKDOWN */}
                          {card.label === "Nutrients" && (
                            <div className="mt-3 text-xs text-gray-300 space-y-1">
                              <div className="flex justify-between">
                                <span>Protein</span><span className="font-semibold">{(analysisHistory[0]?.total_protein_g || 0).toFixed(1)}g</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Carbs</span><span className="font-semibold">{(analysisHistory[0]?.total_carbohydrates_g || 0).toFixed(1)}g</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Fat</span><span className="font-semibold">{(analysisHistory[0]?.total_fat_g || 0).toFixed(1)}g</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                </div>

                {/* Activity & Food Categories - Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Activity Chart */}
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h2 className="font-semibold text-foreground">Activity</h2>
                    </div>
                    {analysisHistory.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={analysisHistory.slice(0, 4).reverse().map((item: any) => ({
                          ...item,
                          shortName: item.image_filename?.substring(0, 8) + (item.image_filename?.length > 8 ? '...' : '') || 'Analysis'
                        }))} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                          <XAxis 
                            dataKey="shortName" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Bar 
                            dataKey="total_volume_ml" 
                            fill="hsl(145, 63%, 42%)" 
                            radius={[8, 8, 0, 0]}
                            name="Volume (ml)"
                          />
                          <Bar 
                            dataKey="total_weight_grams" 
                            fill="hsl(30, 90%, 55%)" 
                            radius={[8, 8, 0, 0]}
                            name="Weight (g)"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-48 text-muted-foreground">
                        <p className="text-sm">No activity data yet</p>
                      </div>
                    )}
                  </div>

                  {/* Category Distribution */}
                  <div className="glass-card p-6">
                    <h2 className="font-semibold text-foreground mb-4">Food Categories</h2>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40} label>
                          {categoryData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT – Latest Analysis */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 flex flex-col lg:col-span-3">
                <h2 className="font-semibold text-foreground mb-4">Latest Analysis</h2>
                
                {analysisHistory.length > 0 ? (
                  <>
                    {/* Image */}
                    <div className="rounded-xl overflow-hidden bg-muted flex items-center justify-center mb-4 aspect-square">
                      {analysisHistory[0].image_data ? (
                        <img 
                          src={analysisHistory[0].image_data} 
                          alt="Latest analysis" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">Analysis {analysisHistory[0].id}</p>
                      )}
                    </div>

                    {/* Title/Heading */}
                    <p className="font-semibold text-foreground text-sm mb-3">
                      {analysisHistory[0].image_filename || "Latest Analysis"}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      {analysisHistory[0].foods ? `Detected ${analysisHistory[0].foods.length} food item(s)` : "Food analysis ready for review"}
                    </p>

                    {/* Tags/Metrics */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span className="px-3 py-1 bg-muted/50 rounded-lg text-xs font-medium text-foreground border border-border">
                        {(analysisHistory[0]?.total_volume_ml || 0).toFixed(0)} ml
                      </span>
                      <span className="px-3 py-1 bg-muted/50 rounded-lg text-xs font-medium text-foreground border border-border">
                        {(analysisHistory[0]?.total_weight_grams || 0).toFixed(0)} g
                      </span>
                      <span className="px-3 py-1 bg-muted/50 rounded-lg text-xs font-medium text-foreground border border-border">
                        {(analysisHistory[0]?.total_calories || 0).toFixed(0)} kcal
                      </span>
                    </div>

                    {/* Detected Items */}
                    {analysisHistory[0].foods && analysisHistory[0].foods.length > 0 && (
                      <div className="mb-4 p-2 bg-muted/30 rounded-lg max-h-16 overflow-y-auto">
                        <p className="text-xs text-muted-foreground font-medium mb-2">Detected Items:</p>
                        <div className="space-y-1">
                          {analysisHistory[0].foods.slice(0, 2).map((food: any) => (
                            <p key={food.id} className="text-xs text-foreground">
                              • {food.name}
                            </p>
                          ))}
                          {analysisHistory[0].foods.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{analysisHistory[0].foods.length - 2} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Button */}
                    <Link
                      to="/analysis"
                      className="cursor-target w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-auto"
                    >
                      <Eye className="h-4 w-4" /> View the Analysis
                    </Link>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="rounded-xl overflow-hidden bg-muted aspect-square mb-4 flex items-center justify-center w-full">
                      <p className="text-sm text-muted-foreground">No image</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">No analysis yet</p>
                    <Link
                      to="/analysis"
                      className="cursor-target w-full py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      Start Analysis
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Full Width Table - Total Calories Breakdown by Time of Day */}
            {analysisHistory.length > 0 && (() => {
              const latestDate = parseUTCDate(analysisHistory[0].date || analysisHistory[0].analysis_date);
              const latestDateStr = latestDate.toLocaleDateString();
              
              // Get all analyses for the latest date
              const latestDateAnalyses = analysisHistory.filter((analysis: any) => {
                const analysisDate = parseUTCDate(analysis.date || analysis.analysis_date);
                return analysisDate.toLocaleDateString() === latestDateStr;
              });

              // Helper function to get time period
              const getTimePeriod = (date: Date) => {
                const hour = date.getHours();
                if (hour >= 6 && hour < 12) return 'morning';
                if (hour >= 12 && hour < 17) return 'afternoon';
                if (hour >= 17 && hour < 21) return 'evening';
                return 'night';
              };

              // Calculate calories by time period
              const caloriesByPeriod = {
                morning: { calories: 0, count: 0 },
                afternoon: { calories: 0, count: 0 },
                evening: { calories: 0, count: 0 },
                night: { calories: 0, count: 0 }
              };

              let totalCaloriesLatestDate = 0;
              latestDateAnalyses.forEach((analysis: any) => {
                const date = parseUTCDate(analysis.date || analysis.analysis_date);
                const period = getTimePeriod(date);
                const calories = analysis.total_calories || 0;
                caloriesByPeriod[period as keyof typeof caloriesByPeriod].calories += calories;
                caloriesByPeriod[period as keyof typeof caloriesByPeriod].count += 1;
                totalCaloriesLatestDate += calories;
              });

              return (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 glass-card p-6">
                  <h2 className="font-semibold text-foreground mb-6">
                    Total Calories Taken in {latestDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h2>

                  {/* Time Period Breakdown - Grid Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                      { 
                        period: 'Morning', 
                        icon: '🌅', 
                        time: '6:00 AM - 12:00 PM',
                        data: caloriesByPeriod.morning,
                        bgColor: 'bg-yellow-500/20',
                        borderColor: 'border-yellow-500/30'
                      },
                      { 
                        period: 'Afternoon', 
                        icon: '☀️', 
                        time: '12:00 PM - 5:00 PM',
                        data: caloriesByPeriod.afternoon,
                        bgColor: 'bg-orange-500/20',
                        borderColor: 'border-orange-500/30'
                      },
                      { 
                        period: 'Evening', 
                        icon: '🌆', 
                        time: '5:00 PM - 9:00 PM',
                        data: caloriesByPeriod.evening,
                        bgColor: 'bg-purple-500/20',
                        borderColor: 'border-purple-500/30'
                      },
                      { 
                        period: 'Night', 
                        icon: '🌙', 
                        time: '9:00 PM - 6:00 AM',
                        data: caloriesByPeriod.night,
                        bgColor: 'bg-blue-500/20',
                        borderColor: 'border-blue-500/30'
                      }
                    ].map((item, idx) => (
                      <motion.div
                        key={item.period}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 rounded-xl border ${item.bgColor} ${item.borderColor} backdrop-blur-sm`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <p className="font-semibold text-foreground">{item.period}</p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-foreground">
                            {item.data.calories.toFixed(0)}
                            <span className="text-xs text-muted-foreground ml-1">kcal</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.data.count} {item.data.count === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Total Summary Card */}
                  <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/20 backdrop-blur-sm mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Total Calories for Today</p>
                        <p className="text-3xl font-bold text-green-500">{totalCaloriesLatestDate.toFixed(0)} kcal</p>
                      </div>
                      <div className="text-4xl">🎯</div>
                    </div>
                  </div>

                  {/* Detailed Table */}
                  <div className="overflow-x-auto">
                    <h3 className="font-semibold text-foreground mb-3 text-sm">All Analyses Details</h3>
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left py-4 px-6 text-muted-foreground font-semibold text-xs uppercase tracking-wider min-w-[100px]">Time</th>
                          <th className="text-left py-4 px-6 text-muted-foreground font-semibold text-xs uppercase tracking-wider min-w-[140px]">Image</th>
                          <th className="text-left py-4 px-6 text-muted-foreground font-semibold text-xs uppercase tracking-wider min-w-[90px]">Volume</th>
                          <th className="text-left py-4 px-6 text-muted-foreground font-semibold text-xs uppercase tracking-wider min-w-[90px]">Weight</th>
                          <th className="text-left py-4 px-6 text-muted-foreground font-semibold text-xs uppercase tracking-wider min-w-[100px]">Calories</th>
                          <th className="text-left py-4 px-6 text-muted-foreground font-semibold text-xs uppercase tracking-wider min-w-[280px]">Nutrients</th>
                          <th className="text-left py-4 px-6 text-muted-foreground font-semibold text-xs uppercase tracking-wider min-w-[70px]">Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestDateAnalyses.map((analysis: any) => {
                          const analysisDate = parseUTCDate(analysis.date || analysis.analysis_date);
                          const period = getTimePeriod(analysisDate);
                          const periodEmoji = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' }[period];
                          return (
                            <tr key={analysis.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="py-4 px-6 text-foreground text-xs whitespace-nowrap">
                                {analysisDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="py-4 px-6 font-medium text-foreground text-xs max-w-[140px] truncate">
                                {analysis.image_filename || `Analysis #${analysis.id}`}
                              </td>
                              <td className="py-4 px-6 text-foreground text-xs whitespace-nowrap">
                                {analysis.total_volume_ml?.toFixed(0) || 0} ml
                              </td>
                              <td className="py-4 px-6 text-foreground text-xs whitespace-nowrap">
                                {analysis.total_weight_grams?.toFixed(0) || 0} g
                              </td>
                              <td className="py-4 px-6 text-foreground font-semibold text-xs text-orange-500 whitespace-nowrap">
                                {analysis.total_calories?.toFixed(0) || 0} kcal
                              </td>
                              <td className="py-4 px-6 text-foreground text-xs">
                                <div className="flex gap-2 flex-wrap">
                                  <span className="px-3 py-1.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 font-semibold text-xs whitespace-nowrap">
                                    Protein: {(analysis.total_protein_g || 0).toFixed(1)}g
                                  </span>
                                  <span className="px-3 py-1.5 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 font-semibold text-xs whitespace-nowrap">
                                    Carbs: {(analysis.total_carbohydrates_g || 0).toFixed(1)}g
                                  </span>
                                  <span className="px-3 py-1.5 rounded-full bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 font-semibold text-xs whitespace-nowrap">
                                    Fats: {(analysis.total_fat_g || 0).toFixed(1)}g
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-foreground font-medium text-xs whitespace-nowrap">
                                <span className="text-lg">{periodEmoji}</span> {period.charAt(0).toUpperCase() + period.slice(1)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              );
            })()}
          </>
        )}
      </div>

      {/* Navigation Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Dock 
            items={[
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
            ]}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default Dashboard;
