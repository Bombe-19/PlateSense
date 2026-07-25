import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Settings, Globe, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLenis } from "lenis/react";

import aiDashboard from "@/assets/images/AI_dashboard.png";
import foodReports from "@/assets/images/Food_reports.png";
import dataInsights from "@/assets/images/data_insights.png";
import scanHistory from "@/assets/images/Scan_history.png";
import nutritionalAnalysis from "@/assets/images/nutritional_analysis.png";

const CARDS = [
  {
    id: "dashboard",
    title: "AI Volumetric Dashboard",
    subtitle: "Real-time AI Food & Volumetric Telemetry",
    image: aiDashboard,
    path: "/dashboard",
    stats: [
      { label: "Weight / Mass", val: "285 g" },
      { label: "Calorie Estimate", val: "675 kcal" },
      { label: "Detection Match", val: "99.2%" },
    ],
    tags: ["Journey", "Stats", "Duels"],
  },
  {
    id: "reports",
    title: "Structured Food Reports",
    subtitle: "Automated Portion & PDF Exports",
    image: foodReports,
    path: "/reports",
    stats: [
      { label: "Export Format", val: "PDF Audit" },
      { label: "Serving Standard", val: "USDA Sync" },
      { label: "Compliance", val: "Medical Grade" },
    ],
    tags: ["Overview", "Reports", "Audits"],
  },
  {
    id: "insights",
    title: "Intake & Data Insights",
    subtitle: "Longitudinal Portion Trends",
    image: dataInsights,
    path: "/dashboard",
    stats: [
      { label: "Macro Split", val: "42P / 38C / 20F" },
      { label: "Calorie Budget", val: "2,200 kcal" },
      { label: "Weekly Trend", val: "+4.2% Accuracy" },
    ],
    tags: ["Recharts Logs", "Macro Trends", "Calorie Budget"],
  },
  {
    id: "history",
    title: "Meal Scan History",
    subtitle: "Historical Meal Tracking Archive",
    image: scanHistory,
    path: "/analysis",
    stats: [
      { label: "Historical Logs", val: "1,240 Meals" },
      { label: "Scan Latency", val: "<0.5 sec" },
      { label: "Database Sync", val: "Supabase DB" },
    ],
    tags: ["Meal Archive", "History Log", "Instant Lookup"],
  },
  {
    id: "nutrition",
    title: "Nutrition & Density Analysis",
    subtitle: "Serving Density & Mass Models",
    image: nutritionalAnalysis,
    path: "/analysis",
    stats: [
      { label: "Density Standard", val: "Voxel Calibration" },
      { label: "Error Margin", val: "±1.8%" },
      { label: "Nutrient Catalogs", val: "50,000+ Items" },
    ],
    tags: ["Voxel Density", "Nutrient Catalogs", "Macro Ratios"],
  },
];

interface PlatformSectionProps {
  sectionRef?: React.RefObject<HTMLElement>;
}

export default function PlatformSection({ sectionRef }: PlatformSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const navigate = useNavigate();
  const lenis = useLenis();

  // Dynamic scroll handler — updates active card index as user scrolls down #platform
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef?.current || document.getElementById("platform");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      const scrolledIn = -rect.top;
      const progress = Math.max(0, Math.min(0.99, scrolledIn / scrollable));
      const idx = Math.min(CARDS.length - 1, Math.floor(progress * CARDS.length));

      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
    };

    // Initial check on mount
    handleScroll();

    if (lenis) {
      lenis.on("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (lenis) lenis.off("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lenis, sectionRef]);

  const updateCardIndex = (newIdx: number) => {
    activeIndexRef.current = newIdx;
    setActiveIndex(newIdx);
  };

  return (
    <div className="relative w-full max-w-full overflow-x-clip">
      {/* Card Deck Stage — overflow-x-clip eliminates horizontal window scrollbars */}
      <div className="relative w-full max-w-full min-h-[500px] md:min-h-[560px] flex items-center justify-center overflow-x-clip py-4">
        <div className="w-full flex items-center justify-center relative min-h-[500px]">
          {CARDS.map((card, idx) => {
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
                  scale: isActive ? 1 : 0.85,
                  opacity: isActive ? 1 : 0.45,
                  zIndex: isActive ? 30 : 10 - Math.abs(offset),
                }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => updateCardIndex(idx)}
                className="absolute w-[82vw] max-w-[850px] shrink-0 cursor-pointer"
              >
                {/* Fast, GPU-friendly dark glass container */}
                <div
                  className={`rounded-[36px] border border-white/15 p-5 md:p-7 relative overflow-hidden transition-all duration-300 ${
                    isActive
                      ? "bg-slate-900/95 shadow-[0_25px_70px_rgba(0,0,0,0.6)]"
                      : "bg-slate-900/80 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                  }`}
                >
                  {/* Top Control Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-black text-xs">
                      FC
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-xs text-white/80">
                      <span className="font-bold text-white">{card.title}</span>
                      <span className="text-white/30">•</span>
                      <span className="text-white/60 hidden sm:inline">{card.subtitle}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                        <Settings size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                        <Globe size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Screenshot Container */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 aspect-[16/9] md:h-[350px] w-full flex items-center justify-center">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-contain p-2"
                      loading="eager"
                    />

                    {/* Metric badge — only on active card */}
                    {isActive && (
                      <div className="absolute top-4 right-4 bg-slate-950/90 border border-white/15 p-4 rounded-2xl hidden sm:flex flex-col gap-1.5 text-right shadow-2xl">
                        {card.stats.map((s) => (
                          <div key={s.label} className="text-xs">
                            <span className="text-white/40">{s.label}: </span>
                            <span className="font-bold text-orange-400">{s.val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Bar */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
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

                    <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
                      {card.tags.map((tag, tIdx) => (
                        <span
                          key={tag}
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            tIdx === 0 ? "bg-white/15 text-white" : "text-white/55"
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

      {/* Pagination dots + arrows */}
      <div className="mt-6 flex items-center justify-center gap-4 relative z-30">
        <button
          onClick={() => updateCardIndex(Math.max(0, activeIndex - 1))}
          className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-foreground hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-md"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-full shadow-md">
          {CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => updateCardIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-8 bg-orange-500" : "w-2.5 bg-slate-300 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => updateCardIndex(Math.min(CARDS.length - 1, activeIndex + 1))}
          className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-foreground hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-md"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}