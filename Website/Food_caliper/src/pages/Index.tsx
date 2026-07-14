import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Scale, Brain, BarChart3, Zap, Target, Upload, Home, BarChart4, Settings, User, Eye, Utensils, TrendingUp, Database, Hospital, Activity, Users, FlaskConical, Play, Cpu, FileText, ChevronRight, Droplet, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import ScanAnimation from "@/components/ScanAnimation";
import AnimatedCounter from "@/components/AnimatedCounter";
import Dock from "@/components/Dock";

import ScrollReveal from "@/components/ScrollReveal";
import LogoLoop from "@/components/LogoLoop";
import PlatformSection from "@/components/PlatformSection";
import heroFood from "@/assets/hero-food.jpg";
import logo from "@/assets/logo.png";
import bgTexture from "@/assets/bg-texture.jpg";
import { useLenis } from "lenis/react";
import CinematicLoader from "@/components/CinematicLoader";

gsap.registerPlugin(ScrollTrigger);

const mockMetrics = { volume: 342, weight: 285, items: 4 };

const features = [
  { icon: Target, title: "Accurate AI Estimation", desc: "State-of-the-art volumetric analysis powered by deep learning models." },
  { icon: Zap, title: "Instant Results", desc: "Get volume and weight estimations in seconds from a single image." },
  { icon: BarChart3, title: "Structured Analytics", desc: "Beautiful dashboards to track trends and food analysis history." },
  { icon: Brain, title: "Smart Detection", desc: "Ideal for health tracking, research labs, and smart kitchens." },
];

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem("loaderRun");
  });

  // Interactive Left Bento Card States (linking to actual implemented features)
  // Interactive Left Bento Card Accordion States
  const [expandedStrip, setExpandedStrip] = useState<number | null>(0);

  const featuresList = [
    {
      title: "Volumetric AI Scanner",
      desc: "Upload plate images or use the webcam to scan portion boundaries, calibrate camera angles, and calculate calorie breakdowns.",
      action: "Open Scanner →",
      path: "/analysis"
    },
    {
      title: "Intake & Calorie Dashboard",
      desc: "Monitor daily target budgets, view weekly Recharts calorie logs, and track daily hydration goals.",
      action: "Open Dashboard →",
      path: "/dashboard"
    },
    {
      title: "Hydration Log Counter",
      desc: "Log daily water cups directly in-app to track hydration targets alongside food records.",
      action: "Log Hydration →",
      path: "/dashboard"
    },
    {
      title: "Notes & Report Exporter",
      desc: "Write persistent database notes for any analysis, copy sharing links, or print summaries.",
      action: "Open Reports →",
      path: "/reports"
    }
  ];

  const handleLoaderComplete = () => {
    setLoading(false);
    sessionStorage.setItem("loaderRun", "true");
  };

  useEffect(() => {
    if (loading) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [loading, lenis]);

  const heroImageRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const productScanBeamRef = useRef<HTMLDivElement>(null);
  const productPlateImageRef = useRef<HTMLDivElement>(null);

  // Scroll to section post-navigation
  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const target = (location.state as any).scrollTo;
      setTimeout(() => {
        if (target === "#") {
          lenis?.scrollTo(0);
        } else {
          const el = document.querySelector(target);
          if (el) lenis?.scrollTo(el, { offset: -80 });
        }
      }, 300);
      
      // Clear navigation state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, lenis, navigate]);

  useEffect(() => {
    // Media Query Check: Only run horizontal scroll on screens larger than 768px (desktop)
    const isDesktop = window.innerWidth >= 768;

    const ctx = gsap.context(() => {
      // 1. Clip-Path Expansion Reveal on hero showcase image
      if (heroImageRef.current) {
        gsap.fromTo(heroImageRef.current,
          { clipPath: "inset(12% 16% round 40px)" },
          {
            clipPath: "inset(0% 0% round 24px)",
            ease: "none",
            scrollTrigger: {
              trigger: heroImageRef.current,
              start: "top 95%",
              end: "top 30%",
              scrub: true
            }
          }
        );
      }

      // 2. Parallax floating background orbs
      gsap.to(".parallax-orb-1", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".parallax-orb-2", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // 3. What is FoodCaliper holographic scan beam sweep
      if (productScanBeamRef.current) {
        gsap.fromTo(productScanBeamRef.current,
          { top: "0%" },
          {
            top: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: "#product",
              start: "top 75%",
              end: "bottom 75%",
              scrub: true
            }
          }
        );
      }

      // 4. Parallax zoom on the salmon plate image
      if (productPlateImageRef.current) {
        gsap.fromTo(productPlateImageRef.current,
          { scale: 1.05 },
          {
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: "#product",
              start: "top 95%",
              end: "bottom 35%",
              scrub: true
            }
          }
        );
      }

      // 5. Horizontal Scroll Pinning (only on desktop)
      if (isDesktop && horizontalSectionRef.current && horizontalContainerRef.current) {
        const scrollWidth = horizontalContainerRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        
        gsap.to(horizontalContainerRef.current, {
          x: () => -(scrollWidth - windowWidth),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            pin: true,
            scrub: 1.2,
            start: "top top",
            end: () => `+=${scrollWidth - windowWidth}`,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleDemoAnalyze = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2500);
  };

  const dockItems = [
    { 
      icon: <Home size={20} />, 
      label: 'Home', 
      onClick: () => {
        if (location.pathname === "/") {
          lenis?.scrollTo(0);
        } else {
          navigate('/', { state: { scrollTo: '#' } });
        }
      }
    },
    { 
      icon: <BarChart4 size={20} />, 
      label: 'Dashboard', 
      onClick: () => navigate('/dashboard') 
    },
    { 
      icon: <Utensils size={20} />, 
      label: 'Scan', 
      onClick: () => navigate('/analysis') 
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

  const stats = [
    { value: "1.2M+", label: "MEALS SCANNED", detail: "+12.4% MoM", icon: "📈" },
    { value: "98.2%", label: "ACCURACY RATE", detail: "Medical Grade", icon: "✓" },
    { value: "<0.5s", label: "ANALYSIS SPEED", detail: "Real-time AI", icon: "⚡" },
    { value: "500+", label: "ENTERPRISE CLIENTS", detail: "Global Support", icon: "🤝" },
  ];

  return (
    <>
      <AnimatePresence>
        {loading && (
          <CinematicLoader onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      <div className="relative min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300 ease-out">
      {/* Background Texture Layer */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `url(${bgTexture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }} />
      {/* Cloud-White Mesh Overlay - In Front */}
      <div className="fixed inset-0 z-10 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(236, 240, 241, 0.08) 1.5px, transparent 1.5px)',
        backgroundSize: '25px 25px',
        backgroundPosition: '0 0',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Floating Parallax Orbs */}
      <div className="absolute top-[25vh] left-[10vw] w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none parallax-orb-1 z-0" />
      <div className="absolute top-[35vh] right-[10vw] w-[450px] h-[450px] bg-orange-500/10 rounded-full blur-[130px] pointer-events-none parallax-orb-2 z-0" />

      {!loading && <Navbar />}

      {/* Hero Section - Centered */}
      <section className="relative px-6 py-12 md:py-24 flex flex-col items-center min-h-[60vh] justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tight leading-none">
            Precision meets <br />
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">Appetite.</span>
          </h1>
          <p className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            High-definition volume and depth estimation delivering medical-grade nutritional accuracy through advanced computer vision.
          </p>
        </motion.div>

        {/* Hero Image with Overlays */}
        <motion.div
          ref={heroImageRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white/20 dark:border-slate-800 mt-16"
        >
          {/* Hero Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroFood})`,
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          
          {/* Cloud Mesh Effect */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(236, 240, 241, 0.12) 1.5px, transparent 1.5px)',
              backgroundSize: '25px 25px',
              backgroundPosition: '0 0',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)',
            }}
          />
          
          {/* Scanner Animation */}
          {isScanning && <ScanAnimation isScanning={isScanning} />}

          {/* Top Left - Weight Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden sm:flex absolute top-8 left-8 glass-card p-5 rounded-2xl items-center gap-4 shadow-xl"
          >
            <div className="bg-cyan-500/20 p-2 rounded-lg">
              <Scale className="text-cyan-400" size={24} />
            </div>
            <div>
              <p className="text-foreground text-xs font-bold uppercase tracking-wider opacity-60">Calculated Weight</p>
              <p className="text-foreground text-2xl font-extrabold leading-none">450g</p>
            </div>
          </motion.div>

          {/* Bottom Right - Volume Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden sm:flex absolute bottom-8 right-8 glass-card p-5 rounded-2xl items-center gap-4 shadow-xl"
          >
            <div className="bg-cyan-500/20 p-2 rounded-lg">
              <Ruler className="text-cyan-400" size={24} />
            </div>
            <div>
              <p className="text-foreground text-xs font-bold uppercase tracking-wider opacity-60">Volume Analysis</p>
              <p className="text-foreground text-2xl font-extrabold leading-none">120 cm³</p>
            </div>
          </motion.div>

          {/* Center Scanner Circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-cyan-400/30 rounded-full animate-pulse" />
            <div className="absolute w-48 h-48 border-4 border-cyan-400/50 rounded-full" />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <button
            onClick={handleDemoAnalyze}
            className="cursor-target group relative flex min-w-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-16 px-8 bg-orange-500 text-white text-lg font-black tracking-wide shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isScanning ? "Analyzing..." : (
                <>
                  <BarChart3 size={24} />
                  Start Analysis
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>
      </section>

      {/* Product Section - Redesigned */}
      <section id="product" className="px-6 py-32 bg-white/40 dark:bg-background-dark/40 border-y border-border relative z-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <ScrollReveal
              enableBlur
              textClassName="text-5xl md:text-6xl font-black text-foreground"
            >
              What is FoodCaliper?
            </ScrollReveal>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mt-4" />
          </div>

          {/* Asymmetrical Bento Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column (span-5) — Horizontal Accordion Strips in Container */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="lg:col-span-5 relative overflow-hidden rounded-3xl bg-white dark:bg-slate-950/60 shadow-2xl border border-slate-200 dark:border-slate-800/85 hover:border-orange-500/20 transition-all p-8 flex flex-col justify-between min-h-[640px]"
            >
              
              {/* Short and sweet project paragraph */}
              <p className="text-sm text-muted-foreground leading-relaxed pb-6 border-b border-slate-200 dark:border-slate-800/55">
                FoodCaliper is a spatial nutrition platform designed to estimate meal weights and nutritional breakdown from a single camera frame. By tracking calories, logging daily water intake, and generating printable logs, it simplifies tracking your dietary goals.
              </p>

              {/* Stacked feature strips with sliding layout animations */}
              <div className="flex flex-col flex-1 justify-center divide-y divide-slate-200 dark:divide-slate-800/55 mt-4">
                {featuresList.map((feat, idx) => {
                  const isExpanded = expandedStrip === idx;
                  
                  // Setup custom neon theme parameters for each capability
                  let activeBorder = "border-orange-500";
                  let activeBg = "bg-orange-500/10";
                  let activeText = "text-orange-500";
                  let glowColor = "shadow-[0_0_20px_rgba(249,115,22,0.2)]";

                  if (idx === 0) { // Scanner
                    activeBorder = "border-cyan-500/60";
                    activeBg = "bg-cyan-500/10";
                    activeText = "text-cyan-400";
                    glowColor = "shadow-[0_0_20px_rgba(6,182,212,0.2)]";
                  } else if (idx === 2) { // Hydration
                    activeBorder = "border-blue-500/60";
                    activeBg = "bg-blue-500/10";
                    activeText = "text-blue-400";
                    glowColor = "shadow-[0_0_20px_rgba(59,130,246,0.2)]";
                  } else if (idx === 3) { // Reports
                    activeBorder = "border-emerald-500/60";
                    activeBg = "bg-emerald-500/10";
                    activeText = "text-emerald-400";
                    glowColor = "shadow-[0_0_20px_rgba(16,185,129,0.2)]";
                  }

                  return (
                    <motion.div 
                      key={feat.title}
                      layout
                      onClick={() => setExpandedStrip(isExpanded ? null : idx)}
                      className={`transition-colors duration-300 cursor-pointer min-h-[96px] flex items-center py-5 px-3 relative overflow-hidden select-none group rounded-xl ${
                        isExpanded ? "bg-white/[0.02] dark:bg-slate-900/20" : "hover:bg-white/[0.01]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full gap-6">
                        
                        {/* Left Slot: Holds the arrow when collapsed */}
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 relative">
                          <AnimatePresence>
                            {!isExpanded && (
                              <motion.div
                                layoutId={`arrow-circle-${idx}`}
                                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                                className="w-12 h-12 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-foreground group-hover:border-orange-500 group-hover:text-orange-500 transition-colors"
                              >
                                <ArrowUpRight size={20} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Middle Slot: Holds the text content (stable width) */}
                        <div className="flex-1 min-w-0">
                          <AnimatePresence mode="wait">
                            {!isExpanded ? (
                              <motion.span
                                key="title"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.25 }}
                                className="text-base md:text-lg font-black text-foreground tracking-tight group-hover:text-orange-500 transition-colors block"
                              >
                                {feat.title}
                              </motion.span>
                            ) : (
                              <motion.div
                                key="desc"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-2"
                              >
                                <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${activeText}`}>
                                  {feat.title}
                                </span>
                                <p className="text-xs md:text-sm text-foreground font-medium leading-relaxed max-w-sm">
                                  {feat.desc}
                                </p>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(feat.path);
                                  }}
                                  className={`text-[10px] font-bold font-mono text-left w-fit mt-1 flex items-center gap-1 hover:underline ${activeText}`}
                                >
                                  {feat.action}
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Right Slot: Holds the arrow when expanded */}
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 relative">
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                layoutId={`arrow-circle-${idx}`}
                                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                                className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${activeBorder} ${activeBg} ${activeText} ${glowColor}`}
                              >
                                <motion.div 
                                  animate={{ rotate: 45 }}
                                  transition={{ duration: 0.4 }}
                                  className="flex items-center justify-center"
                                >
                                  <ArrowUpRight size={20} />
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </motion.div>

            {/* Right Column (span-7) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-white dark:bg-slate-955/60 shadow-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/20 transition-all group min-h-[640px] flex flex-col justify-between"
            >
              {/* Simulated scan image */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                <div 
                  ref={productPlateImageRef}
                  className="w-full h-full bg-cover bg-center opacity-65 transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${heroFood})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Holographic Laser Scan Line */}
                <div 
                  ref={productScanBeamRef}
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] pointer-events-none z-10"
                  style={{ top: "0%" }}
                />
              </div>

              {/* Scanner radar mesh overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 1.5px, transparent 1.5px)',
                backgroundSize: '20px 20px',
              }} />

              {/* Bounding Hotspots overlays */}
              <div className="absolute inset-0 z-20">
                {/* Protein Hotspot (Salmon/Steak) */}
                <div 
                  onMouseEnter={() => setHoveredIngredient("protein")}
                  onMouseLeave={() => setHoveredIngredient(null)}
                  className="absolute top-[22%] left-[25%] w-[45%] h-[35%] cursor-crosshair rounded-full border-2 border-dashed border-cyan-400/20 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all flex items-center justify-center group/item"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-400 animate-ping absolute opacity-70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 relative" />
                </div>

                {/* Carbs Hotspot (Potatoes/Rice) */}
                <div 
                  onMouseEnter={() => setHoveredIngredient("carbs")}
                  onMouseLeave={() => setHoveredIngredient(null)}
                  className="absolute bottom-[20%] right-[15%] w-[32%] h-[30%] cursor-crosshair rounded-full border-2 border-dashed border-orange-400/20 hover:border-orange-400 hover:bg-orange-500/10 transition-all flex items-center justify-center group/item"
                >
                  <span className="w-5 h-5 rounded-full bg-orange-400 animate-ping absolute opacity-70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400 relative" />
                </div>

                {/* Veggies Hotspot (Salad) */}
                <div 
                  onMouseEnter={() => setHoveredIngredient("veggies")}
                  onMouseLeave={() => setHoveredIngredient(null)}
                  className="absolute bottom-[18%] left-[12%] w-[35%] h-[32%] cursor-crosshair rounded-full border-2 border-dashed border-emerald-400/20 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all flex items-center justify-center group/item"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-400 animate-ping absolute opacity-70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
                </div>
              </div>

              {/* Title Header */}
              <div className="relative z-35 p-6 pointer-events-none">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                  Interactive AI Scanner
                </span>
                <p className="text-white text-xs mt-3 opacity-60">Hover hotspots on the plate to trigger spatial measurements.</p>
              </div>

              {/* Popover Live Data Panel */}
              <div className="relative z-35 p-6 w-full mt-auto">
                <AnimatePresence mode="wait">
                  {hoveredIngredient ? (
                    <motion.div
                      key={hoveredIngredient}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-5 rounded-2xl bg-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-md"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-white font-bold text-base">
                          {hoveredIngredient === "protein" && "🥩 Sirloin Steak"}
                          {hoveredIngredient === "carbs" && "🥔 Roasted Potatoes"}
                          {hoveredIngredient === "veggies" && "🥗 Green Broccoli & Salad"}
                        </p>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          98.6% match
                        </span>
                      </div>
                      
                      {/* Telemetry info */}
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <p className="text-white/40 uppercase tracking-wider font-semibold text-[10px]">Volume</p>
                          <p className="text-white font-extrabold text-sm">
                            {hoveredIngredient === "protein" && "245 cm³"}
                            {hoveredIngredient === "carbs" && "185 cm³"}
                            {hoveredIngredient === "veggies" && "310 cm³"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-white/40 uppercase tracking-wider font-semibold text-[10px]">Weight</p>
                          <p className="text-white font-extrabold text-sm">
                            {hoveredIngredient === "protein" && "210 g"}
                            {hoveredIngredient === "carbs" && "140 g"}
                            {hoveredIngredient === "veggies" && "85 g"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-white/40 uppercase tracking-wider font-semibold text-[10px]">Calories</p>
                          <p className="text-orange-500 font-extrabold text-sm">
                            {hoveredIngredient === "protein" && "420 kcal"}
                            {hoveredIngredient === "carbs" && "210 kcal"}
                            {hoveredIngredient === "veggies" && "45 kcal"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-[11px] text-white/50">
                        <span>Macros:</span>
                        <span className="font-semibold text-white/80">
                          {hoveredIngredient === "protein" && "P: 38g  ·  C: 0g  ·  F: 22g"}
                          {hoveredIngredient === "carbs" && "P: 4g  ·  C: 32g  ·  F: 3g"}
                          {hoveredIngredient === "veggies" && "P: 2g  ·  C: 8g  ·  F: 1g"}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-5 rounded-2xl bg-slate-950/40 border border-white/[0.03] text-center"
                    >
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">AI Scanner Telemetry Offline</p>
                      <p className="text-white/20 text-[11px] mt-1">Hover the target highlights to start calibration.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Bottom Telemetry Metric Row - Updated to researched features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: "Multi-Source Media Inputs",
                val: "Upload, Cam, Paste",
                desc: "Capture webcam snapshots, drag-and-drop local files, or paste images directly from your clipboard to calibrate calibrations instantly.",
                icon: Upload,
                color: "text-cyan-500",
                bgColor: "bg-cyan-500/10 border-cyan-500/20",
                hoverGlow: "hover:border-cyan-500/35 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
              },
              {
                title: "Serving Calibrations",
                val: "Plate Diameter Slider",
                desc: "Refine portion calculations by adjusting physical plate scale measurements (cm) and selecting custom nutrition reference databases.",
                icon: Ruler,
                color: "text-orange-500",
                bgColor: "bg-orange-500/10 border-orange-500/20",
                hoverGlow: "hover:border-orange-500/35 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)]"
              },
              {
                title: "Printable Nutrition Audits",
                val: "PDF Report Exports",
                desc: "Export historical food logs, daily stats, and macronutrient charts directly into clean, styled printed PDF sheets.",
                icon: FileText,
                color: "text-blue-500",
                bgColor: "bg-blue-500/10 border-blue-500/20",
                hoverGlow: "hover:border-blue-500/35 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]"
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 transition-all duration-300 flex flex-col justify-between items-start h-full hover:-translate-y-1 ${card.hoverGlow}`}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between w-full mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.bgColor} ${card.color}`}>
                      <card.icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">capability 0{idx + 1}</span>
                  </div>
                  <h4 className="text-xs text-muted-foreground uppercase font-black tracking-wider">{card.title}</h4>
                  <p className="text-2xl font-black text-foreground mt-2 tracking-tight">{card.val}</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="px-6 py-32 bg-background-light dark:bg-background-dark transition-colors duration-300 ease-out">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <ScrollReveal
              enableBlur
              containerClassName="mb-6"
              textClassName="text-5xl font-black text-black dark:text-white"
            >
              Solutions
            </ScrollReveal>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto" />
          </div>

          {/* Solution Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Healthcare */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/80 p-8 shadow-lg border border-border hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Hospital className="text-red-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Healthcare</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  In healthcare environments, accurate dietary monitoring is essential for patient recovery and long-term health management. FoodCaliper helps hospitals and nutritionists estimate food portions and calorie intake more consistently by analyzing meal images. This enables healthcare professionals to track patient nutrition, maintain dietary compliance, and support better nutritional planning without relying on manual portion estimation.
                </p>
              </div>
            </motion.div>

            {/* Nutrition Platforms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/80 p-8 shadow-lg border border-border hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Activity className="text-green-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Nutrition Platforms</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Digital nutrition and fitness platforms require reliable data to help users track their meals and manage dietary goals. FoodCaliper can integrate with these platforms to automatically estimate portion size, weight, and calories from food images. This simplifies meal tracking and allows users to monitor their nutritional intake with minimal effort while improving the accuracy of food logging.
                </p>
              </div>
            </motion.div>

            {/* Food Service Operations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/80 p-8 shadow-lg border border-border hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Utensils className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Food Service Operations</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  FoodCaliper helps food service providers maintain consistent portion sizes across meals and locations. Restaurants, cloud kitchens, and institutional food services can use the platform to monitor portion measurements, reduce food waste, and ensure quality control in meal preparation. By analyzing meal portions through images, the system supports operational efficiency and better resource management.
                </p>
              </div>
            </motion.div>

            {/* Research & Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/80 p-8 shadow-lg border border-border hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <FlaskConical className="text-purple-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Research &amp; Analytics</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  In academic and nutritional research, collecting accurate food intake data is often difficult and time-consuming. FoodCaliper enables researchers to analyze food images and convert them into measurable dietary data such as portion size, weight, and calorie estimates. This allows research teams to gather structured food consumption data more efficiently and conduct large-scale dietary studies with improved data consistency.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-32 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md border-y border-border relative z-20">
        <LogoLoop
          logos={stats}
          speed={60}
          logoHeight={120}
          gap={48}
          pauseOnHover={true}
          direction="left"
          width="100%"
          renderItem={(stat) => (
            <div className="flex flex-col items-center justify-center min-w-[220px]">
              <p className="text-slate-deep dark:text-white text-5xl font-black mb-2">{stat.value}</p>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">{stat.label}</p>
              <div className="mt-2 flex items-center gap-1 text-emerald-500 font-bold text-sm">
                <span>{stat.icon}</span>
                {stat.detail}
              </div>
            </div>
          )}
        />
      </section>

      {/* Platform Section */}
      <section
        id="platform"
        className="px-6 py-32 bg-white/40 dark:bg-background-dark/40 backdrop-blur-sm border-y border-border relative z-20"
      >
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <ScrollReveal
              enableBlur

              containerClassName="mb-6"
              textClassName="text-5xl md:text-6xl font-black text-foreground"
            >
              Platform
            </ScrollReveal>

            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto" />

            <p className="mt-6 text-muted-foreground max-w-3xl mx-auto text-lg">
              The FoodCaliper platform provides a complete AI-powered environment
              for analyzing food images and extracting measurable insights such as
              volume, weight, and nutritional data. The system combines computer
              vision with structured analytics to help organizations track food
              measurements, monitor nutritional intake, and generate reliable
              food analysis reports.
            </p>
          </div>

          {/* Platform Component */}
          <PlatformSection />

        </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={horizontalSectionRef}
        id="features"
        className="px-6 py-24 md:py-32 bg-background-light dark:bg-background-dark transition-colors duration-300 ease-out overflow-hidden md:h-screen md:flex md:flex-col md:justify-center relative z-20"
      >
        <div className="max-w-7xl mx-auto w-full md:absolute md:top-24 md:left-12 md:right-12 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-0">
          <div>
            <ScrollReveal
              enableBlur
              containerClassName="mb-4"
              textClassName="text-5xl md:text-6xl font-black text-foreground"
            >
              How It Works
            </ScrollReveal>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
          </div>
          <p className="text-muted-foreground text-sm max-w-md font-medium leading-relaxed">
            Our multi-stage pipeline turns simple images into precise volume, weight, and nutritional breakdowns in seconds.
          </p>
        </div>

        {/* Horizontal scroll strip */}
        <div className="w-full overflow-x-auto md:overflow-x-visible md:overflow-y-hidden select-none scrollbar-hide py-4 md:py-10">
          <div
            ref={horizontalContainerRef}
            className="flex flex-col md:flex-row md:flex-nowrap gap-6 md:gap-8 px-0 md:px-12 w-full md:w-max"
          >
            {/* Step 1 */}
            <div className="horizontal-panel w-full md:w-[380px] shrink-0 p-8 rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] shadow-lg hover:border-orange-500/30 transition-all flex flex-col justify-between h-[280px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Eye className="text-orange-500" size={26} />
                  </div>
                  <span className="text-4xl font-black text-slate-200 dark:text-slate-850 select-none">01</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Computer Vision</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Advanced segmentation models locate and outline every individual food item on your plate, capturing shapes and texture boundaries to separate overlapping foods.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="horizontal-panel w-full md:w-[380px] shrink-0 p-8 rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] shadow-lg hover:border-orange-500/30 transition-all flex flex-col justify-between h-[280px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Cpu className="text-orange-500" size={26} />
                  </div>
                  <span className="text-4xl font-black text-slate-200 dark:text-slate-850 select-none">02</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Processing Pipeline</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The segmented slices feed into our processing architecture, validating depth calibrations, camera angles, and scaling factors for accurate pixel-to-volume mapping.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="horizontal-panel w-full md:w-[380px] shrink-0 p-8 rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] shadow-lg hover:border-orange-500/30 transition-all flex flex-col justify-between h-[280px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Ruler className="text-orange-500" size={26} />
                  </div>
                  <span className="text-4xl font-black text-slate-200 dark:text-slate-850 select-none">03</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Volume Estimation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Generates an estimated three-dimensional mesh of each portion, calculating spatial volume in milliliters (ml) by estimating dish thickness and depth.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="horizontal-panel w-full md:w-[380px] shrink-0 p-8 rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] shadow-lg hover:border-orange-500/30 transition-all flex flex-col justify-between h-[280px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Scale className="text-orange-500" size={26} />
                  </div>
                  <span className="text-4xl font-black text-slate-200 dark:text-slate-850 select-none">04</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Density Modeling</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Converts volumetric estimations into weight outputs (grams) by applying food Serving Density profiles, mapped across our extensive database of ingredient properties.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="horizontal-panel w-full md:w-[380px] shrink-0 p-8 rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] shadow-lg hover:border-orange-500/30 transition-all flex flex-col justify-between h-[280px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <BarChart3 className="text-orange-500" size={26} />
                  </div>
                  <span className="text-4xl font-black text-slate-200 dark:text-slate-850 select-none">05</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Nutrition Calculation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Calculates calorie counts and exact macronutrient (proteins, carbs, fats) metrics by multiplying portion weight against validated nutritional index catalogs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/95 text-white px-6 md:px-20 pt-20 pb-36 border-t border-slate-800 relative z-20">
        <div className="max-w-7xl mx-auto">
          {/* Footer Top */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="FoodCaliper Logo" className="h-10 w-10" />
                <h3 className="text-2xl font-black">FoodCaliper</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                AI-powered food analysis platform that transforms images into measurable nutritional insights through advanced computer vision and deep learning.
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors cursor-pointer" title="Twitter / X">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors cursor-pointer" title="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors cursor-pointer" title="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

            {/* Links Columns Grid: 3 columns on mobile, spanning 3 slots on desktop */}
            <div className="md:col-span-3 grid grid-cols-3 gap-6">
              {/* Product */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Platform</h4>
                <nav className="flex flex-col gap-3 text-sm">
                  <a href="#features" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Features</a>
                  <a href="#solutions" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Solutions</a>
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Technology</a>
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Pricing</a>
                </nav>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Company</h4>
                <nav className="flex flex-col gap-3 text-sm">
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">About</a>
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Careers</a>
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Blog</a>
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Contact</a>
                </nav>
              </div>

              {/* Resources */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Resources</h4>
                <nav className="flex flex-col gap-3 text-sm">
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Docs</a>
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">API</a>
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Support</a>
                  <a href="#" className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Status</a>
                </nav>
              </div>
            </div>
          </div>

          {/* Footer Divider */}
          <div className="border-t border-slate-800 pt-8">
            {/* Footer Bottom */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-500 text-xs">
                © 2026 FoodCaliper. All rights reserved.
              </p>
              <nav className="flex gap-6 text-xs text-slate-500">
                <a href="#" className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</a>
                <a href="#" className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</a>
                <a href="#" className="hover:text-slate-300 transition-colors cursor-pointer">Cookie Policy</a>
              </nav>
            </div>
          </div>
        </div>
      </footer>

      {/* Navigation Dock */}
      {!loading && (
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
      )}
    </div>
    </>
  );
};

export default Index;
