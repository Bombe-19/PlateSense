import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Settings, Globe, ArrowRight, Grid } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import images from assets to allow Vite to bundle and resolve them correctly
import aiDashboard from "@/assets/images/AI_dashboard.png";
import foodReports from "@/assets/images/Food_reports.png";
import dataInsights from "@/assets/images/data_insights.png";
import scanHistory from "@/assets/images/Scan_history.png";
import nutritionalAnalysis from "@/assets/images/nutritional_analysis.png";

export default function PlatformSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const platformCards = [
    {
      id: "dashboard",
      title: "AI Volumetric Dashboard",
      subtitle: "Real-time AI Food & Volumetric Telemetry",
      image: aiDashboard,
      path: "/dashboard",
      desc: "Centralized AI food recognition and 3D volumetric mass telemetry dashboard. View detected food items, estimated volume, weight, and calorie breakdown.",
      stats: [
        { label: "Weight Loss / Mass", val: "285 g" },
        { label: "Calories Loss / Intake", val: "675 kcal" },
        { label: "Current Match", val: "99.2%" }
      ],
      tags: ["Journey", "Stats", "Duels"]
    },
    {
      id: "reports",
      title: "Structured Food Reports",
      subtitle: "Automated Portion & PDF Exports",
      image: foodReports,
      path: "/reports",
      desc: "Automatically generated structured reports providing portion estimations, macronutrient ratios, and exportable PDF audit logs after every scan.",
      stats: [
        { label: "Export Format", val: "PDF Audit" },
        { label: "Serving Standard", val: "USDA Sync" },
        { label: "Compliance", val: "Medical Grade" }
      ],
      tags: ["Overview", "Reports", "Audits"]
    },
    {
      id: "insights",
      title: "Intake & Data Insights",
      subtitle: "Longitudinal Portion Trends",
      image: dataInsights,
      path: "/dashboard",
      desc: "Visual charts and data analytics helping users monitor portion trends, caloric variance, and macro split performance across multiple scans.",
      stats: [
        { label: "Macro Split", val: "42P / 38C / 20F" },
        { label: "Calorie Budget", val: "2,200 kcal" },
        { label: "Weekly Trend", val: "+4.2% Accuracy" }
      ],
      tags: ["Recharts Logs", "Macro Trends", "Calorie Budget"]
    },
    {
      id: "history",
      title: "Meal Scan History",
      subtitle: "Historical Meal Tracking Archive",
      image: scanHistory,
      path: "/analysis",
      desc: "Access previously analyzed meal logs, inspect historical volume calibration metrics, and maintain consistent dietary tracking habits.",
      stats: [
        { label: "Historical Logs", val: "1,240 Meals" },
        { label: "Scan Latency", val: "<0.5 sec" },
        { label: "Database Sync", val: "Supabase DB" }
      ],
      tags: ["Meal Archive", "History Log", "Instant Lookup"]
    },
    {
      id: "nutrition",
      title: "Nutrition & Density Analysis",
      subtitle: "Serving Density & Mass Models",
      image: nutritionalAnalysis,
      path: "/analysis",
      desc: "Calculates precise calorie density and macronutrients (protein, carbohydrates, fat) by combining detected food items with structured density profiles.",
      stats: [
        { label: "Density Standard", val: "Voxel Calibration" },
        { label: "Error Margin", val: "±1.8%" },
        { label: "Nutrient Catalogs", val: "50,000+ Items" }
      ],
      tags: ["Voxel Density", "Nutrient Catalogs", "Macro Ratios"]
    }
  ];

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // Scroll tracking to update active index dynamically as user scrolls down the section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const sectionHeight = rect.height;
      if (sectionHeight > 0 && rect.top <= viewportHeight && rect.bottom >= 0) {
        const scrolled = (viewportHeight * 0.5) - rect.top;
        const progress = Math.max(0, Math.min(0.99, scrolled / sectionHeight));
        const index = Math.min(platformCards.length - 1, Math.floor(progress * platformCards.length));
        
        if (index !== activeIndexRef.current) {
          activeIndexRef.current = index;
          setActiveIndex(index);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [platformCards.length]);

  const prevCard = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : platformCards.length - 1));
  };

  const nextCard = () => {
    setActiveIndex((prev) => (prev < platformCards.length - 1 ? prev + 1 : 0));
  };

  return (
    <div ref={containerRef} className="relative w-full py-8 overflow-hidden">
      {/* Horizontal Sliding Stage Container */}
      <div className="relative w-full mx-auto min-h-[520px] md:min-h-[580px] flex items-center justify-center">
        
        <div className="w-full flex items-center justify-center relative min-h-[520px]">
          {platformCards.map((card, idx) => {
            const offset = idx - activeIndex;
            const isActive = idx === activeIndex;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            return (
              <motion.div
                key={card.id}
                initial={false}
                animate={{
                  x: `${offset * 72}%`,
                  scale: isActive ? 1 : 0.84,
                  opacity: isActive ? 1 : 0.55,
                  zIndex: isActive ? 30 : 10 - Math.abs(offset),
                }}
                style={{ willChange: "transform, opacity" }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                onClick={() => setActiveIndex(idx)}
                className="absolute w-[82vw] max-w-[850px] shrink-0 cursor-pointer"
              >
                {/* Glass Card Container matching exact reference screenshot */}
                <div className="rounded-[36px] bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-2xl border border-white/15 p-5 md:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.5)] relative overflow-hidden">
                  
                  {/* Top Control Bar (matching reference photo) */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    {/* Left Brand Badge */}
                    <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-black text-xs shadow-inner">
                      FC
                    </div>

                    {/* Middle Glass Pill Tabs (matching reference photo) */}
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-xs text-white/80 font-medium backdrop-blur-md">
                      <span className="font-bold text-white">{card.title}</span>
                      <span className="text-white/30">•</span>
                      <span className="text-white/60">{card.subtitle}</span>
                    </div>

                    {/* Right Action Icons */}
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                        <Settings size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                        <Globe size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Center Main Platform Screenshot Showcase */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 aspect-[16/9] md:h-[360px] w-full flex items-center justify-center group">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-102"
                    />

                    {/* Right Floating Glass Metric Badge (matching reference photo) */}
                    <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md border border-white/15 p-4 rounded-2xl hidden sm:flex flex-col gap-1.5 text-right shadow-2xl">
                      {card.stats.map((s) => (
                        <div key={s.label} className="text-xs">
                          <span className="text-white/40">{s.label}: </span>
                          <span className="font-bold text-orange-400">{s.val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Center Bottom Floating Glass Grid Button (matching reference photo) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-orange-500/90 border border-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 backdrop-blur-md">
                      <Grid size={18} />
                    </div>
                  </div>

                  {/* Bottom Footer Bar (matching reference photo) */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                    {/* Left Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(card.path);
                      }}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-lg shadow-orange-500/20"
                    >
                      <span>Explore Module</span>
                      <ArrowRight size={14} />
                    </button>

                    {/* Right Navigation Pills (matching Journey / Stats / Duels in reference photo) */}
                    <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
                      {card.tags.map((tag, tIdx) => (
                        <span
                          key={tag}
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            tIdx === 0
                              ? "bg-white/15 text-white shadow-sm"
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Bottom Carousel Controls Bar (matching exact reference screenshot) */}
      <div className="mt-6 flex items-center justify-center gap-4 relative z-30">
        <button
          onClick={prevCard}
          className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-foreground flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-md"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Active Pill Dots (matching reference photo) */}
        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-full shadow-md">
          {platformCards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "w-8 bg-orange-500 shadow-sm"
                  : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-foreground flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-md"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}