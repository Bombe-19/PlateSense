import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ruler, Scale, Brain, BarChart3, Zap, Target, Upload, Home, BarChart4, Settings, User, Eye, Utensils, TrendingUp, Database, Hospital, Activity, Users, FlaskConical, Play, Cpu, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScanAnimation from "@/components/ScanAnimation";
import AnimatedCounter from "@/components/AnimatedCounter";
import Dock from "@/components/Dock";
import Carousel from "@/components/Carousel";
import ScrollReveal from "@/components/ScrollReveal";
import LogoLoop from "@/components/LogoLoop";
import PlatformSection from "@/components/PlatformSection";
import heroFood from "@/assets/hero-food.jpg";
import logo from "@/assets/logo.png";
import bgTexture from "@/assets/bg-texture.jpg";

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
  const [activeTab, setActiveTab] = useState("overview");

  const tabContents = {
    overview: "FoodCaliper is an AI-powered food analysis platform that estimates the volume and weight of food using image-based analysis. By combining computer vision techniques with calibrated food density data, the system converts a simple food image into measurable information such as portion size, estimated weight, calorie estimation, and basic nutritional insights.",
    specs: "Advanced deep learning models trained on 10,000+ food items. Real-time processing with sub-second analysis. Medical-grade accuracy (±12-18% error margin). Support for 116 distinct food types. Cloud-based infrastructure with 99.9% uptime.",
    usecases: "Perfect for health tracking, nutrition research, hospital dietary management, smart kitchen applications, and fitness enthusiasts. Integrates with nutrition apps and health platforms for comprehensive dietary monitoring and analysis.",
  };

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
      icon: <Eye size={20} />, 
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

  const stats = [
    { value: "1.2M+", label: "MEALS SCANNED", detail: "+12.4% MoM", icon: "📈" },
    { value: "98.2%", label: "ACCURACY RATE", detail: "Medical Grade", icon: "✓" },
    { value: "<0.5s", label: "ANALYSIS SPEED", detail: "Real-time AI", icon: "⚡" },
    { value: "500+", label: "ENTERPRISE CLIENTS", detail: "Global Support", icon: "🤝" },
  ];

  return (
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
              textClassName="text-5xl md:text-6xl font-black text-foreground"
            >
              What is FoodCaliper?
            </ScrollReveal>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto" />
          </motion.div>

          {/* Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-lg text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed"
          >
            FoodCaliper is an AI-powered food analysis platform that estimates the volume and weight of food in image analysis. By combining computer vision techniques with calibrated food density data, the system converts a simple food image into measurable such as portion weight, calorie estimation, and basic nutritional insights. This platform is designed to simplify food measurement and provide a faster, more consistent way to analyze meals across different environments.
          </motion.p>

          {/* Two Card Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Card - Carousel Full Width */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 shadow-2xl border border-slate-800 hover:border-slate-700 transition-all group min-h-96 flex items-center justify-center p-0"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Mesh Pattern */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.15) 1px, transparent 1px)',
                  backgroundSize: '25px 25px',
                }}
              />

              {/* Carousel Section - Full Width */}
              <div className="relative z-10 w-full flex justify-center">
                <Carousel
                  baseWidth={400}
                  autoplay={false}
                  autoplayDelay={3000}
                  pauseOnHover={false}
                  loop={true}
                  round={false}
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all" />
            </motion.div>

            {/* Right Card - Watch in Action */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 shadow-2xl border border-slate-800 hover:border-slate-700 transition-all group min-h-96"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* Video Element */}
              <video
                className="w-full h-full object-cover relative z-10"
                controls
                controlsList="nodownload"
                autoPlay={false}
              >
                <source src="/videos/food_caliper.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />
            </motion.div>
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
      <section id="features" className="px-6 py-32 bg-background-light dark:bg-background-dark transition-colors duration-300 ease-out">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <ScrollReveal
              enableBlur
              containerClassName="mb-6"
              textClassName="text-5xl md:text-6xl font-black text-foreground"
            >
              How It Works
            </ScrollReveal>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto" />
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Computer Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 hover:border-orange-500/50 transition-all hover:bg-white/15 dark:hover:bg-slate-800/70 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-orange-500" size={28} />
                <h3 className="text-xl font-bold text-foreground">Computer Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The process begins with advanced computer vision models that detect and identify food items within an image. The system analyzes visual features such as shape, texture, and boundaries to accurately segment each food component. This step ensures that individual items on a plate are correctly recognized, forming a reliable foundation for further measurement and analysis.
              </p>
            </motion.div>

            {/* Processing Pipeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 hover:border-orange-500/50 transition-all hover:bg-white/15 dark:hover:bg-slate-800/70 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="text-orange-500" size={28} />
                <h3 className="text-xl font-bold text-foreground">Processing Pipeline</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                All stages are integrated into a structured AI processing pipeline that manages detection, estimation, validation, and result generation. The pipeline ensures that each step is executed efficiently and consistently, minimizing errors while maintaining performance. This architecture enables FoodCaliper to deliver reliable results in real time, even for complex or mixed dishes.
              </p>
            </motion.div>

            {/* Volume Estimation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 hover:border-orange-500/50 transition-all hover:bg-white/15 dark:hover:bg-slate-800/70 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Ruler className="text-orange-500" size={28} />
                <h3 className="text-xl font-bold text-foreground">Volume Estimation</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                After detecting the food, the system estimates its physical dimensions and portion size using spatial analysis techniques. By interpreting depth cues and surface area, FoodCaliper approximates the three-dimensional structure of the food. This allows the platform to determine how much space the food occupies, which is essential for accurate portion measurement.
              </p>
            </motion.div>
          </div>

          {/* Centered Last Two Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
            {/* Density Modeling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 hover:border-orange-500/50 transition-all hover:bg-white/15 dark:hover:bg-slate-800/70 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Scale className="text-orange-500" size={28} />
                <h3 className="text-xl font-bold text-foreground">Density Modeling</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The estimated volume is then converted into weight using calibrated food density models. Each food category is associated with specific density values, allowing the system to translate volume into realistic weight measurements. This step ensures that the results reflect real-world serving sizes rather than generic approximations.
              </p>
            </motion.div>

            {/* Nutrition Calculation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 hover:border-orange-500/50 transition-all hover:bg-white/15 dark:hover:bg-slate-800/70 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-orange-500" size={28} />
                <h3 className="text-xl font-bold text-foreground">Nutrition Calculation</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Finally, the calculated weight is mapped to structured nutritional datasets to estimate calories and key macronutrients such as protein, carbohydrates, and fats. The system scales nutritional values based on portion size, providing meaningful dietary insights. This allows users to understand not just how much they are eating, but also the nutritional impact of their meals.
              </p>
            </motion.div>
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
