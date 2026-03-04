import { motion } from "framer-motion";
import { Search, Layers, Ruler, Scale, Target, Eye, TrendingUp, Home, Microscope, BarChart4, Settings, User, Loader, ChevronLeft, ChevronRight, Pencil, CheckCircle2, Circle } from "lucide-react";
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
  const visibleDates = dateRange.slice(visibleDateStart, visibleDateStart + 6);

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

      <div className="container py-8">
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
            <div className="mt-8 grid lg:grid-cols-3 gap-6">
              {/* LEFT – Today's Scans with Date Navigation */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
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
                    onClick={() => setVisibleDateStart(Math.max(0, visibleDateStart - 6))}
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
                    onClick={() => setVisibleDateStart(Math.min(Math.max(0, dateRange.length - 6), visibleDateStart + 6))}
                  />
                </div>

                {/* Scans for Selected Date */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                  {(() => {
                    const dateStr = selectedDate.toLocaleDateString();
                    const scansForDate = analysisHistory.filter((analysis: any) => {
                      const analysisDate = new Date(analysis.date || analysis.analysis_date);
                      return analysisDate.toLocaleDateString() === dateStr;
                    });

                    if (scansForDate.length === 0) {
                      return <p className="text-sm text-muted-foreground text-center py-4">No scans for this date</p>;
                    }

                    return scansForDate.map((analysis: any) => {
                      const analysisTime = new Date(analysis.date || analysis.analysis_date);
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Volume", value: totalStats.totalVolume, suffix: " ml", icon: Ruler, cls: "metric-violet" },
                    { label: "Total Weight", value: totalStats.totalWeight, suffix: " g", icon: Scale, cls: "metric-blue" },
                    { label: "Avg Confidence", value: totalStats.avgConfidence, suffix: "%", icon: Target, cls: "metric-orange" },
                    { label: "Total Items", value: totalStats.totalItems, icon: Layers, cls: "metric-green" },
                  ].map(m => (
                    <div key={m.label} className="glass-card p-4">
                      <div className={`${m.cls} metric-badge mb-2`}>
                        <m.icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                      <p className="text-xl font-bold text-foreground">
                        <AnimatedCounter value={Math.round(m.value)} suffix={m.suffix} />
                      </p>
                    </div>
                  ))}
                </div>

                {/* Weekly Trend Chart */}
                <div className="glass-card p-6">
                  <h2 className="font-semibold text-foreground mb-4">Recent Activity</h2>
                  {analysisHistory.length > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Latest analysis: {new Date(analysisHistory[0].date || analysisHistory[0].analysis_date).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Start by uploading a food image for analysis</p>
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
              </motion.div>

              {/* RIGHT – Latest Analysis */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
                <h2 className="font-semibold text-foreground mb-4">Latest Analysis</h2>
                {analysisHistory.length > 0 ? (
                  <>
                    <div className="rounded-xl overflow-hidden bg-muted flex items-center justify-center mb-4 aspect-video">
                      {analysisHistory[0].image_data ? (
                        <img 
                          src={analysisHistory[0].image_data} 
                          alt="Latest analysis" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">Analysis {analysisHistory[0].id}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-muted/50">
                        <p className="font-medium text-foreground text-sm mb-2">
                          {analysisHistory[0].image_filename || "Latest Analysis"}
                        </p>
                        <div className="flex gap-2 mb-3 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            Vol: {analysisHistory[0].total_volume_ml?.toFixed(1) || 0}ml
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Wt: {analysisHistory[0].total_weight_grams?.toFixed(1) || 0}g
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Items: {analysisHistory[0].total_items || 0}
                          </span>
                        </div>
                      </div>
                      
                      {/* Detected Food Items */}
                      {analysisHistory[0].foods && analysisHistory[0].foods.length > 0 && (
                        <div className="p-3 rounded-xl bg-muted/50">
                          <p className="text-xs font-medium text-primary mb-2">Detected Items:</p>
                          <div className="space-y-2">
                            {analysisHistory[0].foods.map((food: any) => (
                              <div key={food.id} className="text-xs text-muted-foreground p-1.5 bg-black/20 rounded-lg">
                                <span className="font-medium text-foreground">{food.name}</span>
                                <div className="flex gap-2 mt-0.5">
                                  <span>{food.volume?.toFixed(1) || 0}ml</span>
                                  <span>•</span>
                                  <span>{food.weight?.toFixed(1) || 0}g</span>
                                  <span>•</span>
                                  <span>{(food.confidence * 100)?.toFixed(0) || 0}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <Link
                      to="/analysis"
                      className="cursor-target mt-4 w-full py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" /> View Full Analysis
                    </Link>
                  </>
                ) : (
                  <div className="rounded-xl overflow-hidden bg-muted aspect-video mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">No analysis yet</p>
                      <Link
                        to="/analysis"
                        className="cursor-target inline-block px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Start Analysis
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Full Width Table */}
            {analysisHistory.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 glass-card p-6">
                <h2 className="font-semibold text-foreground mb-4">All Analyses</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {["Date", "Image", "Volume (ml)", "Weight (g)", "Items", "Confidence"].map(h => (
                          <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysisHistory.map((analysis: any) => (
                        <tr key={analysis.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-3 text-foreground">
                            {new Date(analysis.date || analysis.analysis_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 font-medium text-foreground">
                            {analysis.image_filename || `Analysis #${analysis.id}`}
                          </td>
                          <td className="py-3 px-3 text-foreground">{analysis.total_volume_ml?.toFixed(1) || 0}</td>
                          <td className="py-3 px-3 text-foreground">{analysis.total_weight_grams?.toFixed(1) || 0}</td>
                          <td className="py-3 px-3 text-foreground">{analysis.total_items || 0}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`metric-badge ${
                                analysis.avg_confidence > 90 ? "metric-green" : "metric-orange"
                              }`}
                            >
                              {analysis.avg_confidence?.toFixed(0) || 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
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
                icon: <Settings size={20} />, 
                label: 'Settings', 
                onClick: () => navigate('/login') 
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
