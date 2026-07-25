import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Scale, Brain, BarChart3, Zap, Target, Upload, Home, BarChart4, Settings, User, Eye, Utensils, TrendingUp, Database, Hospital, Activity, Users, FlaskConical, Play, Cpu, FileText, ChevronRight, Droplet, ArrowUpRight, ClipboardList, HeartPulse, Dumbbell, Package, Microscope, LineChart, Apple, ChefHat, Scan } from "lucide-react";
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
ScrollTrigger.config({ limitCallbacks: true });

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
  const [expandedStrip, setExpandedStrip] = useState<number | null>(0);
  const [activeHowStep, setActiveHowStep] = useState(0);

  const howItWorksSteps = [
    {
      num: "01",
      title: "Computer Vision & Segmentation",
      subtitle: "Multi-Food Polygon Tracing",
      desc: "Deep convolutional models locate and outline every food item on your plate, capturing precise edge boundaries to separate overlapping ingredients.",
      icon: Eye,
      badge: "Segmentation AI"
    },
    {
      num: "02",
      title: "Spatial Depth & 3D Volumetric Mesh",
      subtitle: "Voxel Elevation Mapping",
      desc: "Generates an estimated 3D spatial mesh for each portion, calculating 3D volume in cubic centimeters (cm³) by measuring food dish depth.",
      icon: Cpu,
      badge: "3D Volumetrics"
    },
    {
      num: "03",
      title: "Physical Plate Scale Calibration",
      subtitle: "Focal Distance Ratio",
      desc: "Calibrates portion mass against reference physical scale dimensions (cm) to eliminate camera distortion and focal distance variance.",
      icon: Ruler,
      badge: "Scale Matrix"
    },
    {
      num: "04",
      title: "Calorie & Macronutrient Synthesis",
      subtitle: "Medical Grade Data",
      desc: "Cross-references estimated food mass with validated nutrition databases to output instant calories, protein, carbs, fat, and exportable PDF audits.",
      icon: Scale,
      badge: "Nutrition Audit"
    }
  ];

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
  const platformSectionRef = useRef<HTMLElement>(null);

  // Solutions section refs for center-big -> left expansion layout
  const solutionsSectionRef = useRef<HTMLElement>(null);
  const solutionCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Solutions data with compact & detailed descriptions + 3 photo circles per solution
  const solutionsData = [
    {
      num: "01",
      label: "Healthcare",
      sub: "Clinical Nutrition",
      icon: Hospital,
      accent: "rose",
      rgb: "244,63,94",
      smallDesc: "Precision dietary tracking for patient-centered care and clinical nutrition compliance.",
      detailedDesc: "Enable hospitals, clinics, and dietitians to monitor patient dietary intake with computer-vision precision. Automated portion analysis eliminates manual guesswork in clinical meal planning while maintaining 99% regulatory compliance.",
      pills: ["Dietary Compliance", "Portion Tracking", "Clinical Accuracy"],
      photos: [
        { icon: Hospital, label: "Patient Care" },
        { icon: ClipboardList, label: "Nutrient Logs" },
        { icon: HeartPulse, label: "Health Metrics" }
      ]
    },
    {
      num: "02",
      label: "Nutrition Platforms",
      sub: "Fitness & Wellness",
      icon: Activity,
      accent: "emerald",
      rgb: "16,185,129",
      smallDesc: "Automated portion & calorie data for fitness apps, diet trackers, and wellness tools.",
      detailedDesc: "Empower your mobile health or fitness app with instant meal photo recognition. Users log calories, macronutrients, and volumetric food mass seamlessly through API endpoints optimized for scale.",
      pills: ["Auto Calorie Logging", "Meal Insights", "API Integration"],
      photos: [
        { icon: Activity, label: "Live Tracking" },
        { icon: Dumbbell, label: "Fitness Sync" },
        { icon: Apple, label: "Macro Split" }
      ]
    },
    {
      num: "03",
      label: "Food Service",
      sub: "Operations & Scale",
      icon: Utensils,
      accent: "sky",
      rgb: "14,165,233",
      smallDesc: "Consistent portion control across restaurants, cloud kitchens & institutional services.",
      detailedDesc: "Standardize serving sizes across multi-location restaurant chains and central kitchens. Real-time scanning ensures recipe consistency, reduces food waste by up to 30%, and streamlines kitchen inventory.",
      pills: ["Portion Consistency", "Waste Reduction", "Multi-location"],
      photos: [
        { icon: Utensils, label: "Kitchen Ops" },
        { icon: ChefHat, label: "Recipe Standard" },
        { icon: Package, label: "Waste Audit" }
      ]
    },
    {
      num: "04",
      label: "Research & Analytics",
      sub: "Academia & Science",
      icon: FlaskConical,
      accent: "violet",
      rgb: "139,92,246",
      smallDesc: "Structured dietary data collection for academic studies and large-scale nutritional research.",
      detailedDesc: "Accelerate nutritional research with high-fidelity, standardized food volume and mass datasets. Designed for clinical trials, epidemiology studies, and AI model benchmarking with exportable structured metrics.",
      pills: ["Structured Datasets", "Scalable Studies", "High Accuracy"],
      photos: [
        { icon: FlaskConical, label: "Lab Datasets" },
        { icon: Microscope, label: "Mass Analysis" },
        { icon: LineChart, label: "Study Reports" }
      ]
    },
  ];

  const accentHex: Record<string, string> = {
    rose: "#f43f5e", emerald: "#10b981", sky: "#0ea5e9", violet: "#8b5cf6",
  };

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

  // Master GSAP ScrollTrigger Setup — Registered in exact DOM order to eliminate pin-spacing calculation conflicts
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;

    const ctx = gsap.context(() => {
      // 1. Clip-Path Expansion Reveal on hero showcase image
      if (heroImageRef.current) {
        gsap.fromTo(
          heroImageRef.current,
          { clipPath: "inset(12% 16% round 40px)" },
          {
            clipPath: "inset(0% 0% round 24px)",
            ease: "none",
            scrollTrigger: {
              trigger: heroImageRef.current,
              start: "top 95%",
              end: "top 30%",
              scrub: true,
            },
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
          scrub: true,
        },
      });

      gsap.to(".parallax-orb-2", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 3. Product scan beam & plate zoom (#product)
      if (productScanBeamRef.current) {
        gsap.fromTo(
          productScanBeamRef.current,
          { top: "0%" },
          {
            top: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: "#product",
              start: "top 75%",
              end: "bottom 75%",
              scrub: true,
            },
          }
        );
      }

      if (productPlateImageRef.current) {
        gsap.fromTo(
          productPlateImageRef.current,
          { scale: 1.05 },
          {
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: "#product",
              start: "top 95%",
              end: "bottom 35%",
              scrub: true,
            },
          }
        );
      }

      // 4. Solutions Section Pinned Animation (#solutions — DOM Position 4)
      const solSection = solutionsSectionRef.current;
      if (solSection) {
        const cards = solutionCardRefs.current.filter(Boolean);
        if (cards.length) {
          const solTl = gsap.timeline();

          cards.forEach((card, index) => {
            if (!card) return;
            const mainCard = card.querySelector<HTMLElement>(".sol-main-card");
            const detailPanel = card.querySelector<HTMLElement>(".sol-detail-panel");
            const photosPanel = card.querySelector<HTMLElement>(".sol-photos-panel");
            const photoCircles = card.querySelectorAll<HTMLElement>(".sol-photo-circle");

            if (index === 0) {
              gsap.set(card, { autoAlpha: 1, scale: 1 });
              if (mainCard) gsap.set(mainCard, { autoAlpha: 1, x: 0 });
              if (detailPanel) gsap.set(detailPanel, { autoAlpha: 0, x: 50, scale: 0.95 });
              if (photosPanel) gsap.set(photosPanel, { autoAlpha: 0, x: 50, scale: 0.95 });
            } else {
              gsap.set(card, { autoAlpha: 0, scale: 0.95 });
              if (mainCard) gsap.set(mainCard, { autoAlpha: 1, x: 0 });
              if (detailPanel) gsap.set(detailPanel, { autoAlpha: 0, x: 50, scale: 0.95 });
              if (photosPanel) gsap.set(photosPanel, { autoAlpha: 0, x: 50, scale: 0.95 });
            }

            const seg = index * 10;

            if (index > 0) {
              solTl.to(card, {
                autoAlpha: 1,
                scale: 1,
                duration: 1.2,
                ease: "power2.out",
              }, seg);
            }

            if (detailPanel && photosPanel) {
              solTl.to(detailPanel, {
                autoAlpha: 1,
                x: 0,
                scale: 1,
                duration: 2.2,
                ease: "power2.out",
              }, seg + 1.2);

              solTl.to(photosPanel, {
                autoAlpha: 1,
                x: 0,
                scale: 1,
                duration: 2.2,
                ease: "power2.out",
              }, seg + 1.4);

              if (photoCircles.length) {
                solTl.fromTo(
                  photoCircles,
                  { scale: 0.5, autoAlpha: 0 },
                  { scale: 1, autoAlpha: 1, stagger: 0.2, duration: 1.5, ease: "back.out(1.7)" },
                  seg + 1.8
                );
              }
            }

            solTl.to({}, { duration: 3.5 }, seg + 3.8);

            if (index < cards.length - 1) {
              solTl.to(card, {
                autoAlpha: 0,
                scale: 0.95,
                y: -25,
                duration: 1.5,
                ease: "power2.in",
              }, seg + 7.3);
            }
          });

          ScrollTrigger.create({
            trigger: solSection,
            pin: true,
            start: "top top",
            end: "+=3600",
            scrub: 1,
            animation: solTl,
            invalidateOnRefresh: true,
          });
        }
      }

      // Refresh ScrollTrigger after initializing all DOM order pinned sections
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
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
      icon: <Scan size={20} />, 
      label: 'Analyze', 
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
              <div 
                onMouseLeave={() => setExpandedStrip(null)}
                className="flex flex-col flex-1 justify-center divide-y divide-slate-200 dark:divide-slate-800/55 mt-4"
              >
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
                      onMouseEnter={() => setExpandedStrip(idx)}
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

      {/* Solutions Section — Pinned Card Expansion */}
      <section
        id="solutions"
        ref={solutionsSectionRef}
        className="h-screen w-full bg-background-light dark:bg-background-dark transition-colors duration-300 flex flex-col justify-start pt-20 pb-4 sm:pb-6 px-4 sm:px-6 relative overflow-hidden"
      >
        {/* Plain Clean Hero-matching Background Texture & Ambient Orbs (No dots) */}
        <div
          className="absolute inset-0 z-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `url(${bgTexture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute top-[20%] left-[8vw] w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[20%] right-[8vw] w-[450px] h-[450px] bg-orange-500/10 rounded-full blur-[130px] pointer-events-none z-0" />

        {/* Section Heading */}
        <div className="text-center mb-3 sm:mb-4 z-10">
          <ScrollReveal
            enableBlur
            containerClassName="mb-1 sm:mb-2"
            textClassName="text-3xl sm:text-4xl font-black text-foreground"
          >
            Solutions
          </ScrollReveal>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-2" />
          <p className="text-muted-foreground text-xs sm:text-sm font-medium tracking-wide max-w-md mx-auto">
            Scroll to explore how FoodCaliper expands for every industry.
          </p>
        </div>

        {/* Stage Container */}
        <div className="w-full max-w-6xl mx-auto flex-1 min-h-[440px] sm:min-h-[480px] relative flex items-center justify-center my-auto z-10">
          {solutionsData.map((sol, index) => {
            const IconCmp = sol.icon;
            const colorHex = accentHex[sol.accent];
            return (
              <div
                key={sol.num}
                ref={(el) => { solutionCardRefs.current[index] = el; }}
                className="absolute inset-0 m-auto w-full max-w-6xl h-fit flex items-center justify-center pointer-events-auto"
              >
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[440px]">
                  
                  {/* 1. Main Card (Translucent backdrop-blur glass styling matching What is FoodCaliper) */}
                  <div
                    className="sol-main-card lg:col-span-4 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-2xl relative overflow-hidden transition-all duration-300"
                    style={{
                      boxShadow: `0 20px 50px -10px rgba(${sol.rgb}, 0.2)`
                    }}
                  >
                    {/* Top Accent Line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ background: `linear-gradient(90deg, ${colorHex}, transparent)` }}
                    />

                    {/* Header Row: Icon & Number */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                        style={{
                          background: `rgba(${sol.rgb}, 0.12)`,
                          border: `1px solid rgba(${sol.rgb}, 0.25)`,
                        }}
                      >
                        <IconCmp size={26} color={colorHex} strokeWidth={2} />
                      </div>
                      <span
                        className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full border"
                        style={{
                          color: colorHex,
                          borderColor: `rgba(${sol.rgb}, 0.3)`,
                          background: `rgba(${sol.rgb}, 0.08)`,
                        }}
                      >
                        {sol.num}
                      </span>
                    </div>

                    {/* Title & Sub */}
                    <div className="mb-4">
                      <h3 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-1">
                        {sol.label}
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {sol.sub}
                      </p>
                    </div>

                    {/* Small Description Box */}
                    <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40 border border-border/50 shadow-sm mt-auto backdrop-blur-sm">
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {sol.smallDesc}
                      </p>
                    </div>
                  </div>

                  {/* 2. Detailed Description Panel (Translucent backdrop-blur glass styling) */}
                  <div className="sol-detail-panel hidden lg:flex lg:col-span-5 flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-xl relative overflow-hidden">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: colorHex }} />
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Detailed Solution Breakdown
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-foreground mb-3 leading-snug">
                        Enterprise AI {sol.label} Suite
                      </h4>

                      {/* Detailed Paragraph */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-normal">
                        {sol.detailedDesc}
                      </p>
                    </div>

                    {/* Feature Benefit Pills */}
                    <div>
                      <div className="h-px w-full bg-border/50 mb-4" />
                      <div className="flex flex-wrap gap-2">
                        {sol.pills.map((pill) => (
                          <span
                            key={pill}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide border"
                            style={{
                              background: `rgba(${sol.rgb}, 0.08)`,
                              borderColor: `rgba(${sol.rgb}, 0.25)`,
                              color: colorHex,
                            }}
                          >
                            {pill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. Photos / Visuals Column (Translucent backdrop-blur glass styling) */}
                  <div className="sol-photos-panel hidden lg:flex lg:col-span-3 flex-col justify-between items-center p-5 sm:p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-lg">
                    <div className="text-center w-full mb-1">
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Photos &amp; Visuals
                      </span>
                    </div>

                    {/* 3 Photo Circles */}
                    <div className="flex flex-col items-center justify-around gap-3 w-full my-auto py-1">
                      {sol.photos.map((photo, pIdx) => {
                        const PhotoIcon = photo.icon;
                        return (
                          <div
                            key={pIdx}
                            className="sol-photo-circle flex items-center gap-3 w-full p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-border/70 shadow-sm transition-transform duration-300 hover:scale-105"
                          >
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner"
                              style={{
                                background: `radial-gradient(circle at 30% 30%, rgba(${sol.rgb}, 0.25), rgba(${sol.rgb}, 0.08))`,
                                border: `1.5px solid rgba(${sol.rgb}, 0.35)`,
                                boxShadow: `0 4px 12px rgba(${sol.rgb}, 0.15)`,
                              }}
                            >
                              <PhotoIcon size={19} color={colorHex} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-foreground truncate">{photo.label}</p>
                              <p className="text-[10px] text-muted-foreground font-medium">Visual preview</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>


                </div>
              </div>
            );
          })}
        </div>
      </section>


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

      {/* Platform Section — tall section, header scrolls away, card carousel is CSS sticky */}
      <section
        id="platform"
        ref={platformSectionRef as React.RefObject<HTMLElement>}
        className="relative z-20 overflow-x-clip w-full max-w-full"
        style={{ minHeight: "320vh" }}
      >
        {/* Full-section background (not sticky — just fills the tall section) */}
        <div className="absolute inset-0 bg-white/40 dark:bg-background-dark/40 backdrop-blur-sm border-y border-border pointer-events-none" />

        {/* Section Header — scrolls with the page, disappears as you scroll down */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 text-center">
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
            volume, weight, and nutritional data.
          </p>
        </div>

        {/* Card Carousel — ONLY this is sticky. Sticks below the navbar as section scrolls. */}
        <div className="sticky top-20 z-10 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <PlatformSection sectionRef={platformSectionRef as React.RefObject<HTMLElement>} />
          </div>
        </div>
      </section>


      {/* How It Works Section — Redesigned 4-Stage Interactive AI Telemetry Pipeline */}
      <section
        id="features"
        className="px-6 py-24 md:py-32 bg-background-light dark:bg-background-dark transition-colors duration-300 relative overflow-hidden z-20"
      >
        {/* Background Ambient Glow & Texture */}
        <div
          className="absolute inset-0 z-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `url(${bgTexture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute top-1/3 left-[-5vw] w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-1/3 right-[-5vw] w-96 h-96 bg-orange-500/10 rounded-full blur-[130px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <ScrollReveal
              enableBlur
              containerClassName="mb-4"
              textClassName="text-5xl md:text-6xl font-black text-foreground"
            >
              How It Works
            </ScrollReveal>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto" />
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-base font-medium leading-relaxed">
              Our multi-stage pipeline turns simple meal photos into precise volume, weight, and nutritional breakdowns in seconds.
            </p>
          </div>

          {/* Interactive Pipeline Stage Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (lg:col-span-5) — 4 Step Interactive Timeline Cards */}
            <div className="lg:col-span-5 space-y-4">
              {howItWorksSteps.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = activeHowStep === idx;

                return (
                  <motion.div
                    key={step.num}
                    onClick={() => setActiveHowStep(idx)}
                    whileHover={{ scale: 1.01 }}
                    className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border relative overflow-hidden ${
                      isActive
                        ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-orange-500/50 shadow-xl shadow-orange-500/10"
                        : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-slate-200 dark:border-slate-800/80 hover:bg-white/60 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    {/* Active Accent Left Stripe */}
                    {isActive && (
                      <motion.div
                        layoutId="active-step-bar"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-orange-600"
                      />
                    )}

                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isActive
                          ? "bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-muted-foreground"
                      }`}>
                        <StepIcon size={24} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {step.badge}
                          </span>
                          <span className={`text-sm font-black ${isActive ? "text-orange-500" : "text-muted-foreground/60"}`}>
                            {step.num}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-foreground leading-snug mb-1">
                          {step.title}
                        </h3>

                        <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column (lg:col-span-7) — Live AI Telemetry Stage Showcase */}
            <div className="lg:col-span-7 lg:sticky lg:top-32">
              <div className="p-8 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-2xl relative overflow-hidden min-h-[540px] flex flex-col justify-between">
                
                {/* Top Telemetry Header Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Pipeline Stage 0{activeHowStep + 1} Telemetry
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    {howItWorksSteps[activeHowStep].badge}
                  </span>
                </div>

                {/* Stage Dynamic Visual Panels */}
                <div className="flex-1 flex items-center justify-center my-auto w-full">
                  <AnimatePresence mode="wait">
                    {/* Stage 01: Computer Vision & Segmentation */}
                    {activeHowStep === 0 && (
                      <motion.div
                        key="stage-01"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35 }}
                        className="w-full space-y-6"
                      >
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950/80 aspect-video flex items-center justify-center p-4">
                          <img
                            src={heroFood}
                            alt="Computer Vision Segmentation"
                            className="w-full h-full object-cover rounded-xl opacity-75"
                          />
                          {/* Animated AI Scanning Line */}
                          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-pulse top-1/2" />
                          
                          {/* Segmentation Hotspot Badges */}
                          <div className="absolute top-6 left-6 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            Sirloin Steak (99.2% match)
                          </div>
                          <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Green Salad (98.4% match)
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-border">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Object Bounding</p>
                            <p className="text-sm font-black text-foreground mt-1">Multi-Polygon</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-border">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Classification</p>
                            <p className="text-sm font-black text-cyan-500 mt-1">99.2% Accuracy</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-border">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Detection Latency</p>
                            <p className="text-sm font-black text-emerald-500 mt-1">&lt;120 ms</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Stage 02: 3D Volumetric Mesh */}
                    {activeHowStep === 1 && (
                      <motion.div
                        key="stage-02"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35 }}
                        className="w-full space-y-6"
                      >
                        <div className="relative rounded-2xl overflow-hidden border border-orange-500/30 bg-slate-950/90 p-6 flex flex-col justify-between min-h-[260px]">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <p className="text-xs font-mono text-orange-400 uppercase font-bold">Voxel Depth Topography</p>
                              <p className="text-xl font-black text-white mt-1">342 cm³ Total Volume</p>
                            </div>
                            <span className="text-xs font-mono bg-orange-500/20 text-orange-400 px-3 py-1 rounded-md border border-orange-500/30">
                              Elevation Mesh Active
                            </span>
                          </div>

                          {/* Animated Wireframe Bars */}
                          <div className="grid grid-cols-8 gap-2 items-end h-32 py-2">
                            {[40, 65, 90, 100, 85, 60, 45, 30].map((h, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                className="w-full bg-gradient-to-t from-orange-600 via-orange-500 to-amber-300 rounded-t-md shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                              />
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs font-mono text-white/60">
                            <span>Voxel Resolution: 0.5mm³</span>
                            <span>Peak Height: 4.8 cm</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-border">
                            <p className="text-xs text-muted-foreground font-bold">Volume Error Margin</p>
                            <p className="text-lg font-black text-foreground mt-1">±1.8%</p>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-border">
                            <p className="text-xs text-muted-foreground font-bold">Depth Point-Cloud</p>
                            <p className="text-lg font-black text-orange-500 mt-1">45,000 Points</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Stage 03: Scale Calibration */}
                    {activeHowStep === 2 && (
                      <motion.div
                        key="stage-03"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35 }}
                        className="w-full space-y-6"
                      >
                        <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 bg-slate-950/90 p-6 flex flex-col justify-between min-h-[260px]">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <p className="text-xs font-mono text-blue-400 uppercase font-bold">Plate Diameter Reference</p>
                              <p className="text-xl font-black text-white mt-1">26.5 cm Scale Standard</p>
                            </div>
                            <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-3 py-1 rounded-md border border-blue-500/30">
                              Calibrated
                            </span>
                          </div>

                          {/* Visual Ruler Scale Bar */}
                          <div className="py-6 my-auto">
                            <div className="relative h-12 w-full bg-slate-900 border border-blue-500/40 rounded-xl flex items-center justify-between px-4 overflow-hidden">
                              <div className="absolute inset-x-0 top-0 bottom-0 flex justify-between px-2 items-center opacity-40">
                                {Array.from({ length: 20 }).map((_, i) => (
                                  <div key={i} className={`w-0.5 ${i % 5 === 0 ? "h-6 bg-blue-400" : "h-3 bg-blue-400/50"}`} />
                                ))}
                              </div>
                              <span className="text-xs font-mono font-bold text-blue-400 z-10">0 cm</span>
                              <span className="text-xs font-mono font-bold text-white z-10 bg-blue-600 px-2 py-0.5 rounded shadow">Scale Ratio: 1.18 px/mm</span>
                              <span className="text-xs font-mono font-bold text-blue-400 z-10">26.5 cm</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs font-mono text-white/60">
                            <span>Camera Pitch: 45°</span>
                            <span>Focal Distance: 35 cm</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-border">
                            <p className="text-xs text-muted-foreground font-bold">Perspective Correction</p>
                            <p className="text-lg font-black text-foreground mt-1">Affine Adjusted</p>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-border">
                            <p className="text-xs text-muted-foreground font-bold">Calculated Weight</p>
                            <p className="text-lg font-black text-blue-500 mt-1">285 g Total Mass</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Stage 04: Calorie & Macro Synthesis */}
                    {activeHowStep === 3 && (
                      <motion.div
                        key="stage-04"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35 }}
                        className="w-full space-y-6"
                      >
                        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950/90 p-6 flex flex-col justify-between min-h-[260px]">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <p className="text-xs font-mono text-emerald-400 uppercase font-bold">Nutritional Breakdown</p>
                              <p className="text-2xl font-black text-white mt-1">675 <span className="text-sm font-normal text-white/60">kcal total</span></p>
                            </div>
                            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-md border border-emerald-500/30">
                              Audit Ready
                            </span>
                          </div>

                          {/* Macro Progress Bars */}
                          <div className="space-y-3 my-auto">
                            <div>
                              <div className="flex justify-between text-xs font-mono text-white mb-1">
                                <span>🥩 Protein</span>
                                <span className="font-bold text-emerald-400">44 g (42%)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[42%]" />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-mono text-white mb-1">
                                <span>🥔 Carbohydrates</span>
                                <span className="font-bold text-amber-400">40 g (38%)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-[38%]" />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-mono text-white mb-1">
                                <span>🥗 Healthy Fats</span>
                                <span className="font-bold text-cyan-400">26 g (20%)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 w-[20%]" />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <span className="text-xs font-mono text-white/60">FoodCaliper Nutrition Catalog</span>
                            <button
                              onClick={() => navigate('/reports')}
                              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                            >
                              <span>Export PDF Report</span>
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Step Indicator Navigation */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">
                    Step {activeHowStep + 1} of 4
                  </span>
                  <div className="flex items-center gap-2">
                    {howItWorksSteps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveHowStep(i)}
                        className={`h-2 rounded-full transition-all ${
                          activeHowStep === i
                            ? "w-8 bg-orange-500"
                            : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>

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
