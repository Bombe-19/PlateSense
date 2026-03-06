import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ruler, Scale, Brain, BarChart3, Zap, Target, Upload, ArrowRight, Home, Microscope, BarChart4, Settings, User, Eye, Utensils, TrendingUp, Database, Hospital, Activity, Users, FlaskConical } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScanAnimation from "@/components/ScanAnimation";
import AnimatedCounter from "@/components/AnimatedCounter";
import Dock from "@/components/Dock";
import Carousel from "@/components/Carousel";
import ScrollReveal from "@/components/ScrollReveal";
import LogoLoop from "@/components/LogoLoop";
import heroFood from "@/assets/hero-food.jpg";

const mockMetrics = { volume: 342, weight: 285, items: 4 };

const features = [
  { icon: Target, title: "Accurate AI Estimation", desc: "State-of-the-art volumetric analysis powered by deep learning models." },
  { icon: Zap, title: "Instant Results", desc: "Get volume and weight estimations in seconds from a single image." },
  { icon: BarChart3, title: "Structured Analytics", desc: "Beautiful dashboards to track trends and food analysis history." },
  { icon: Brain, title: "Smart Detection", desc: "Ideal for health tracking, research labs, and smart kitchens." },
];

const Index = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

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
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) 
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
  ];

  const stats = [
    { value: "1.2M+", label: "MEALS SCANNED", detail: "+12.4% MoM", icon: "📈" },
    { value: "98.2%", label: "ACCURACY RATE", detail: "Medical Grade", icon: "✓" },
    { value: "<0.5s", label: "ANALYSIS SPEED", detail: "Real-time AI", icon: "⚡" },
    { value: "500+", label: "ENTERPRISE CLIENTS", detail: "Global Support", icon: "🤝" },
  ];

  return (
    <div className="relative min-h-screen bg-background-light dark:bg-background-dark">
      {/* Background Texture Layer */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAyH-QeO3uQ7GDZPILAvrD79bT8p5RO3DpJgdgxE8GHvAd9Ot0b5I7HGtNGYihXSPOQErJrT_JWOY_VYcAsQ1rI3YaMMnVIbB_gQNTK8HQLyP6IMDaNWQ5rrct9BloFXctFUu9IFy9g2V9Mwi6hQIL0Qc6z2HeE2R8IOrfKRXTSmfwbuZ0GTPCSpwwOER8knokw-kTzD5wUgwspbaFuSkk9LwjWQ_oVXJ0Gxgw7ieRcv6Dvgl-IglwJ4XSyoGb6O5gFyiaBJHKemzQ")',
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
      <Navbar />

      {/* Hero Section - Centered */}
      <section className="relative px-6 py-12 md:py-24 flex flex-col items-center min-h-[60vh] justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 text-foreground">
            Precision meets <span className="text-orange-500">Appetite</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium">
            High-definition volume and depth estimation for medical-grade nutritional accuracy through advanced computer vision.
          </p>
        </motion.div>

        {/* Hero Image with Overlays */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white/20 dark:border-slate-800"
        >
          {/* Hero Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/sample.png')`,
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
            className="absolute top-8 left-8 glass-card p-5 rounded-2xl flex items-center gap-4 shadow-xl"
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
            className="absolute bottom-8 right-8 glass-card p-5 rounded-2xl flex items-center gap-4 shadow-xl"
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

      {/* Product Section */}
      <section id="product" className="px-6 py-32 bg-white/40 dark:bg-background-dark/40 backdrop-blur-sm border-y border-border relative z-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <ScrollReveal
              enableBlur
              baseOpacity={0.15}
              baseRotation={2}
              blurStrength={3}
              containerClassName="mb-6"
              textClassName="text-5xl md:text-6xl font-black text-foreground"
            >
              What is FoodCaliper?
            </ScrollReveal>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto" />
          </motion.div>

          {/* Carousel + Video Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Description + Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-8"
            >
              {/* Description Text */}
              <ScrollReveal
                enableBlur={false}
                blurStrength={4}
                baseOpacity={0.1}
                baseRotation={3}
                textClassName="text-lg text-muted-foreground leading-relaxed"
              >
                FoodCaliper is an AI-powered food analysis platform that estimates the volume and weight of food using image-based analysis. By combining computer vision techniques with calibrated food density data, the system converts a simple food image into measurable information such as portion size, estimated weight, calorie estimation, and basic nutritional insights. The platform is designed to simplify food measurement and provide a faster, more consistent way to analyze meals across different environments.
              </ScrollReveal>
              
              {/* Carousel */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Carousel
                  baseWidth={350}
                  autoplay={false}
                  autoplayDelay={3000}
                  pauseOnHover={false}
                  loop={false}
                  round={false}
                />
              </div>
            </motion.div>

            {/* Right - Video Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-2 border-orange-200 dark:border-orange-900/40 bg-gradient-to-br from-slate-900 to-slate-800">
                {/* Video Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-cyan-500/5 to-transparent" />
                
                {/* Mesh Pattern */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Centered Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
                    <button className="relative w-20 h-20 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center shadow-lg hover:shadow-2xl hover:shadow-orange-500/50">
                      <div className="w-0 h-0 border-l-8 border-l-white border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1" />
                    </button>
                  </div>
                </div>

                {/* Video Placeholder Text */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                  <p className="font-semibold text-lg">Watch FoodCaliper in Action</p>
                  <p className="text-sm text-gray-300 mt-1">See how our AI analyzes food in real-time</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="px-6 py-32 bg-gradient-to-br from-white via-gray-50 to-white dark:from-background-dark dark:via-slate-900/50 dark:to-background-dark">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <ScrollReveal
              enableBlur
              baseOpacity={0.15}
              baseRotation={2}
              blurStrength={3}
              containerClassName="mb-6"
              textClassName="text-5xl md:text-6xl font-black text-foreground"
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
      <section className="px-6 py-20 bg-white/40 dark:bg-background-dark/40 backdrop-blur-sm border-y border-border">
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

      {/* Features Section */}
      <section id="features" className="px-6 py-32 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <ScrollReveal
            enableBlur
            baseOpacity={0.15}
            baseRotation={2}
            blurStrength={3}
            containerClassName="mb-6"
            textClassName="text-5xl md:text-6xl font-black text-foreground"
          >
            How It Works
          </ScrollReveal>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Mass Estimation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-stretch justify-between gap-6 rounded-3xl bg-white dark:bg-slate-900/50 p-10 shadow-sm border border-border"
          >
            <div className="flex flex-col justify-between flex-1 gap-6">
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Microscope className="text-primary" size={28} />
                </div>
                <h3 className="text-foreground text-2xl font-bold">Mass Estimation</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Proprietary depth-mapping algorithms calculate food weight with +/- 0.5g precision using only a single image.
                </p>
              </div>
              <Link
                to="/#"
                className="cursor-target flex items-center gap-2 text-primary font-bold text-sm group"
              >
                Learn about methodology
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div 
              className="w-2/5 rounded-2xl hidden sm:block border border-primary/10 bg-cover bg-center"
              style={{
                backgroundImage: `url('/mass.png')`,
              }}
            />
          </motion.div>

          {/* Volume Mapping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-stretch justify-between gap-6 rounded-3xl bg-white dark:bg-slate-900/50 p-10 shadow-sm border border-border"
          >
            <div className="flex flex-col justify-between flex-1 gap-6">
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-2">
                  <BarChart3 className="text-cyan-500" size={28} />
                </div>
                <h3 className="text-foreground text-2xl font-bold">Volume Mapping</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Real-time contouring creates a digital twin of any dish, allowing for exact portion control and calorie counting.
                </p>
              </div>
              <Link
                to="/#"
                className="cursor-target flex items-center gap-2 text-cyan-500 font-bold text-sm group"
              >
                Explore the API
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="w-2/5 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-2xl hidden sm:block border border-cyan-500/10" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-6 md:px-20 py-16 dark:bg-background-dark">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-2">
              <Microscope className="text-primary" size={32} />
              <h2 className="text-xl font-black">FoodCaliper</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Redefining nutritional monitoring through the lens of precision technology and deep learning.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold">Product</h4>
              <nav className="flex flex-col gap-2 text-slate-400 text-sm">
                <a className="hover:text-primary transition-colors" href="#features">Features</a>
                <a className="hover:text-primary transition-colors" href="#solutions">Solutions</a>
                <a className="hover:text-primary transition-colors" href="/login">Enterprise</a>
                <a className="hover:text-primary transition-colors" href="#features">API Docs</a>
                <a className="hover:text-primary transition-colors" href="#features">Privacy</a>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold">Company</h4>
              <nav className="flex flex-col gap-2 text-slate-400 text-sm">
                <a className="hover:text-primary transition-colors" href="#features">About Us</a>
                <a className="hover:text-primary transition-colors" href="#features">Careers</a>
                <a className="hover:text-primary transition-colors" href="#features">Press Kit</a>
                <a className="hover:text-primary transition-colors" href="#features">Contact</a>
              </nav>
            </div>
            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <h4 className="font-bold">Subscribe</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="bg-slate-800 border-none rounded-l-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary"
                />
                <button className="bg-orange-500 px-4 py-2 rounded-r-lg hover:opacity-90 transition-opacity cursor-target">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-slate-800 pt-8 text-center text-slate-500 text-xs">
          © 2024 FoodCaliper Technology Corp. All rights reserved.
        </div>
      </footer>

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
    </div>
  );
};

export default Index;
