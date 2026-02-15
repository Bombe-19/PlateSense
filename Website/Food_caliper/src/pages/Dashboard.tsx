import { motion } from "framer-motion";
import { Search, Layers, Ruler, Scale, Target, Eye, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Navbar from "@/components/Navbar";
import AnimatedCounter from "@/components/AnimatedCounter";
import { mockAnalysis, mockWeeklyData, mockRecentAnalyses } from "@/lib/mockData";
import { Link } from "react-router-dom";

const COLORS = ["hsl(145, 63%, 42%)", "hsl(260, 50%, 65%)", "hsl(220, 70%, 55%)", "hsl(30, 90%, 55%)"];

const categoryData = [
  { name: "Protein", value: 40 },
  { name: "Carbs", value: 30 },
  { name: "Vegetables", value: 20 },
  { name: "Fruits", value: 10 },
];

const Dashboard = () => {
  const latest = mockAnalysis;

  return (
    <div className="page-gradient min-h-screen">
      <Navbar isAuthenticated />

      <div className="container py-8">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hello, User 👋</h1>
            <p className="text-muted-foreground">You analyzed {mockRecentAnalyses.length} food items this week.</p>
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
          {/* LEFT – Recent Analyses */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Recent Analyses
            </h2>
            <div className="space-y-4">
              {mockRecentAnalyses.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{a.foods[0]?.name}</span>
                    <span className="text-xs text-muted-foreground">{a.date}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="metric-badge metric-violet text-xs"><Ruler className="h-3 w-3" />{a.totalVolume} ml</span>
                    <span className="metric-badge metric-blue text-xs"><Scale className="h-3 w-3" />{a.totalWeight} g</span>
                    <span className="metric-badge metric-green text-xs">{a.avgConfidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CENTER */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Volume", value: 867, suffix: " ml", icon: Ruler, cls: "metric-violet" },
                { label: "Total Weight", value: 755, suffix: " g", icon: Scale, cls: "metric-blue" },
                { label: "Avg Confidence", value: 91.6, suffix: "%", icon: Target, cls: "metric-orange" },
                { label: "Total Items", value: 7, icon: Layers, cls: "metric-green" },
              ].map(m => (
                <div key={m.label} className="glass-card p-4">
                  <div className={`${m.cls} metric-badge mb-2`}>
                    <m.icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-xl font-bold text-foreground">
                    <AnimatedCounter value={m.value} suffix={m.suffix} />
                  </p>
                </div>
              ))}
            </div>

            {/* Weekly Trend Chart */}
            <div className="glass-card p-6">
              <h2 className="font-semibold text-foreground mb-4">Weekly Volume Trend</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockWeeklyData}>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(240, 10%, 50%)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(240, 10%, 50%)" }} />
                  <Tooltip />
                  <Bar dataKey="volume" fill="hsl(145, 63%, 42%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
            <div className="rounded-xl overflow-hidden bg-muted aspect-video mb-4 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Analysis image</p>
            </div>
            <div className="space-y-3">
              {latest.foods.map(f => (
                <div key={f.name} className="p-3 rounded-xl bg-muted/50">
                  <p className="font-medium text-foreground text-sm">{f.name}</p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-muted-foreground">Vol: {f.volume}ml</span>
                    <span className="text-xs text-muted-foreground">Wt: {f.weight}g</span>
                    <span className="text-xs text-muted-foreground">Area: {f.area}cm²</span>
                    <span className="text-xs text-muted-foreground">H: {f.height}cm</span>
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {f.components.map(c => (
                      <span key={c} className="metric-badge metric-violet text-xs py-0.5 px-2">{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/analysis"
              className="cursor-target mt-4 w-full py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" /> View Full Analysis
            </Link>
          </motion.div>
        </div>

        {/* Full Width Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 glass-card p-6">
          <h2 className="font-semibold text-foreground mb-4">All Food Analyses</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Food", "Volume (ml)", "Weight (g)", "Area (cm²)", "Height (cm)", "Confidence", "Components"].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockRecentAnalyses.flatMap(a => a.foods).map((f, i) => (
                  <tr key={`${f.name}-${i}`} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-foreground">{f.name}</td>
                    <td className="py-3 px-3 text-foreground">{f.volume}</td>
                    <td className="py-3 px-3 text-foreground">{f.weight}</td>
                    <td className="py-3 px-3 text-foreground">{f.area}</td>
                    <td className="py-3 px-3 text-foreground">{f.height}</td>
                    <td className="py-3 px-3">
                      <span className={`metric-badge ${f.confidence > 90 ? "metric-green" : "metric-orange"}`}>{f.confidence}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {f.components.map(c => (
                          <span key={c} className="metric-badge metric-violet text-xs">{c}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
