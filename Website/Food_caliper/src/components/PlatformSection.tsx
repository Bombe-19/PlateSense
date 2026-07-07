import { useEffect, useState } from "react";
import CardSwap, { Card } from "./CardSwap";

// Import images from assets to allow Vite to bundle and resolve them correctly
import aiDashboard from "@/assets/images/AI_dashboard.png";
import foodReports from "@/assets/images/Food_reports.png";
import dataInsights from "@/assets/images/data_insights.png";
import scanHistory from "@/assets/images/Scan_history.png";
import nutritionalAnalysis from "@/assets/images/nutritional_analysis.png";

export default function PlatformSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const sections = ["dashboard", "reports", "insights", "history", "nutrition"];
  const tabNames = ["AI Dashboard", "Food Reports", "Data Insights", "Scan History", "Nutrition Analysis"];
  const tabIcons = ["📊", "📋", "📈", "🔍", "🔬"];
  const images = [aiDashboard, foodReports, dataInsights, scanHistory, nutritionalAnalysis];
  const descriptions = [
    "View detected foods, estimated volume, weight, and nutritional analysis results in a centralized dashboard powered by AI food recognition and volumetric analysis.",
    "Automatically generated reports provide structured insights including food measurements, portion estimation, and nutritional breakdown after every scan.",
    "Visual insights and analytics help users understand trends in portion sizes, nutritional intake, and food measurement data across multiple scans.",
    "Access previously analyzed meals and track historical food measurement results, enabling consistent monitoring of dietary patterns and food intake.",
    "FoodCaliper estimates calories and macronutrients such as protein, carbohydrates, and fat by combining detected food items with structured nutrition datasets."
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.indexOf(entry.target.id);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Mobile Tab-based Layout (lg:hidden) */}
      <div className="lg:hidden w-full space-y-6">
        {/* Horizontal Scrollable Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide border-b border-border/40">
          {tabNames.map((name, index) => (
            <button
              key={name}
              onClick={() => setMobileActiveIndex(index)}
              className={`cursor-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border ${
                mobileActiveIndex === index
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                  : "bg-card hover:bg-muted text-muted-foreground border-border"
              }`}
            >
              <span>{tabIcons[index]}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>

        {/* Selected Content Card */}
        <div className="glass-card p-6 flex flex-col gap-6 border border-border shadow-lg">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">{tabNames[mobileActiveIndex]}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{descriptions[mobileActiveIndex]}</p>
          </div>
          
          {/* Preview Image Container */}
          <div className="relative rounded-xl overflow-hidden border border-border bg-slate-950/40 p-4 aspect-video flex items-center justify-center">
            <img 
              src={images[mobileActiveIndex]} 
              alt={tabNames[mobileActiveIndex]}
              className="max-h-full max-w-full object-contain rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Desktop Scroll-Reveal Layout (hidden lg:grid) */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-20 items-start">
        {/* LEFT TEXT */}
        <div className="space-y-32">
          <section id="dashboard" className="min-h-[70vh] flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">AI Dashboard</h2>
            <p>View detected foods, estimated volume, weight, and nutritional
              analysis results in a centralized dashboard powered by AI food
              recognition and volumetric analysis.</p>
          </section>

          <section id="reports" className="min-h-[70vh] flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Food Reports</h2>
            <p> Automatically generated reports provide structured insights
              including food measurements, portion estimation, and nutritional
              breakdown after every scan.</p>
          </section>

          <section id="insights" className="min-h-[70vh] flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Data Insights</h2>
            <p>Visual insights and analytics help users understand trends in
              portion sizes, nutritional intake, and food measurement data
              across multiple scans.</p>
          </section>

          <section id="history" className="min-h-[70vh] flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Scan History</h2>
            <p>Access previously analyzed meals and track historical food
              measurement results, enabling consistent monitoring of dietary
              patterns and food intake.</p>
          </section>

          <section id="nutrition" className="min-h-[70vh] flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Nutrition Analysis</h2>
            <p>FoodCaliper estimates calories and macronutrients such as protein,
              carbohydrates, and fat by combining detected food items with
              structured nutrition datasets.</p>
          </section>
        </div>

        {/* RIGHT CARDS */}
        <div className="sticky top-32 flex items-center justify-center h-[500px]">
          <CardSwap activeIndex={activeIndex}>
            <Card>
              <h3 className="absolute top-4 left-4 text-lg font-semibold z-10">AI Dashboard</h3>
              <img 
                src={aiDashboard} 
                alt="AI Dashboard Preview"
                className="w-full h-full object-contain"
              />
            </Card>

            <Card>
              <h3 className="absolute top-4 left-4 text-lg font-semibold z-10">Food Reports</h3>
              <img 
                src={foodReports} 
                alt="Food Reports Preview"
                className="w-full h-full object-contain"
              />
            </Card>

            <Card>
              <h3 className="absolute top-4 left-4 text-lg font-semibold z-10">Data Insights</h3>
              <img 
                src={dataInsights} 
                alt="Data Insights Preview"
                className="w-full h-full object-contain"
              />
            </Card>

            <Card>
              <h3 className="absolute top-4 left-4 text-lg font-semibold z-10">Scan History</h3>
              <img 
                src={scanHistory} 
                alt="Scan History Preview"
                className="w-full h-full object-contain"
              />
            </Card>

            <Card>
              <h3 className="absolute top-4 left-4 text-lg font-semibold z-10">Nutrition Analysis</h3>
              <img 
                src={nutritionalAnalysis} 
                alt="Nutrition Analysis Preview"
                className="w-full h-full object-contain"
              />
            </Card>
          </CardSwap>
        </div>
      </div>
    </>
  );
}