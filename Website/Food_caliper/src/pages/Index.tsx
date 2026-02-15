import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ruler, Scale, Brain, BarChart3, Zap, Target, Upload, ArrowRight, Home, Microscope, BarChart4, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScanAnimation from "@/components/ScanAnimation";
import AnimatedCounter from "@/components/AnimatedCounter";
import Dock from "@/components/Dock";
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
  const [showMetrics, setShowMetrics] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDemoAnalyze = () => {
    setPreviewImage(heroFood);
    setIsScanning(true);
    setShowMetrics(false);
    setTimeout(() => {
      setIsScanning(false);
      setShowMetrics(true);
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
  ];

  return (
    <div className="page-gradient">
      <Navbar />

      {/* Hero */}
      <section className="container py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
              Measure Your Meals{" "}
              <span className="text-primary">with Precision.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Food Caliper uses AI-powered volumetric analysis to estimate food volume and weight instantly from a single image.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: Ruler, text: "Accurate volume estimation (ml)" },
                { icon: Scale, text: "Intelligent weight prediction (grams)" },
                { icon: Brain, text: "Smart food & component detection" },
                { icon: BarChart3, text: "Nutrition-ready insights" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Link
                to="/login"
                className="cursor-target px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Start Analyzing <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="cursor-target px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
              >
                See How It Works
              </a>
            </div>
          </motion.div>

          {/* Right – Upload Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card p-6">
              <div className="relative rounded-xl overflow-hidden bg-muted aspect-[4/3] flex items-center justify-center">
                {previewImage ? (
                  <img src={previewImage} alt="Food preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-8">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">Drag & drop a food image</p>
                    <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                  </div>
                )}
                <ScanAnimation isScanning={isScanning} />
              </div>

              <button
                onClick={handleDemoAnalyze}
                className="cursor-target mt-4 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                {isScanning ? "Analyzing..." : "Analyze Now"}
              </button>

              {showMetrics && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 grid grid-cols-3 gap-3"
                >
                  <div className="glass-card p-3 text-center">
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="text-lg font-bold text-primary">
                      <AnimatedCounter value={mockMetrics.volume} suffix=" ml" />
                    </p>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-lg font-bold text-accent">
                      <AnimatedCounter value={mockMetrics.weight} suffix=" g" />
                    </p>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <p className="text-xs text-muted-foreground">Items</p>
                    <p className="text-lg font-bold text-metric-blue">
                      <AnimatedCounter value={mockMetrics.items} />
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Food Caliper?</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Precision food analysis for health-conscious individuals, researchers, and smart kitchens.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <f.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-cta">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container text-center glass-card p-12 mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Calibrate Your Nutrition?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of users measuring their meals with AI precision.
          </p>
          <Link
            to="/login"
            className="cursor-target mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Let's Caliper Now <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container py-8 text-center text-sm text-muted-foreground">
        © 2026 Food Caliper. All rights reserved.
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
