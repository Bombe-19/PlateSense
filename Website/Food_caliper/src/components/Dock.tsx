import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Home, 
  Scan, 
  LayoutDashboard, 
  Receipt, 
  User, 
  ClipboardSignature, 
  Sun, 
  Moon, 
  X,
  Star
} from "lucide-react";

interface DockItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface DockProps {
  items: DockItem[];
}

const FEEDBACK_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSf_ASUakna27D9PG_AAXAfrvgUZnukg55IWfYtDUsWlJtoypA/viewform?usp=header";

// Helper to get matching professional outline icons based on labels (mimicking the screenshot design)
const getOverrideIcon = (label: string, isActive: boolean) => {
  const cleanLabel = label.toLowerCase();
  const strokeWidth = 1.5;
  const size = 20;
  const colorClass = isActive ? "text-black" : "text-white/60 group-hover:text-white";

  if (cleanLabel.includes('home')) {
    return <Home strokeWidth={strokeWidth} size={size} className={colorClass} />;
  }
  if (cleanLabel.includes('analyze') || cleanLabel.includes('analysis') || cleanLabel.includes('search')) {
    return <Scan strokeWidth={strokeWidth} size={size} className={colorClass} />;
  }
  if (cleanLabel.includes('dashboard') || cleanLabel.includes('stats') || cleanLabel.includes('analytics')) {
    return <LayoutDashboard strokeWidth={strokeWidth} size={size} className={colorClass} />;
  }
  if (cleanLabel.includes('report') || cleanLabel.includes('bill') || cleanLabel.includes('receipt') || cleanLabel.includes('tech')) {
    return <Receipt strokeWidth={strokeWidth} size={size} className={colorClass} />;
  }
  if (cleanLabel.includes('profile') || cleanLabel.includes('user') || cleanLabel.includes('account')) {
    return <User strokeWidth={strokeWidth} size={size} className={colorClass} />;
  }
  return null;
};

export default function Dock({ items }: DockProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isFeedbackCompleted, setIsFeedbackCompleted] = useState(false);
  
  // Initialize state based on the current URL
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const path = location.pathname.toLowerCase();
    const exactMatch = items.findIndex(item => {
      const label = item.label.toLowerCase();
      if (path === '/' && label === 'home') return true;
      if (path.includes('analysis') && label === 'analyze') return true;
      if (path.length > 1 && path.includes(label)) return true;
      return false;
    });
    return exactMatch !== -1 ? exactMatch : 0;
  });

  // Sync activeIndex with URL pathname changes (crucial if Dock is persistent or transitions are delayed)
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const exactMatch = items.findIndex(item => {
      const label = item.label.toLowerCase();
      if (path === '/' && label === 'home') return true;
      if (path.includes('analysis') && label === 'analyze') return true;
      if (path.length > 1 && path.includes(label)) return true;
      return false;
    });

    if (exactMatch !== -1) {
      setActiveIndex(exactMatch);
    }
  }, [location.pathname, items]);

  useEffect(() => {
    const completed = localStorage.getItem('foodCaliperFeedbackCompleted') === 'true';
    setIsFeedbackCompleted(completed);
  }, [isFeedbackOpen]);

  if (!items || items.length === 0) return null;

  const handleOpenFeedback = () => {
    window.open(FEEDBACK_LINK, '_blank', 'noopener,noreferrer');
    localStorage.setItem('foodCaliperFeedbackCompleted', 'true');
    setIsFeedbackCompleted(true);
    setIsFeedbackOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center">
        {/* The main pill container */}
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex items-center gap-2 p-2 premium-glass rounded-full bg-black/60 shadow-2xl border border-white/10"
        >
          {/* Navigation Items */}
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            const customIcon = getOverrideIcon(item.label, isActive);
            
            return (
              <button
                type="button"
                key={item.label}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIndex(index);
                  if (item.onClick) item.onClick();
                }}
                className="relative flex items-center justify-center h-12 rounded-full outline-none group px-3"
                aria-label={item.label}
              >
                {/* Active Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill-bg"
                    className="absolute inset-0 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                    transition={{ type: "spring", stiffness: 250, damping: 22, mass: 1 }}
                  />
                )}

                {/* Content Container (Icon + Text) */}
                <div className="relative z-10 flex items-center gap-2">
                  <motion.span layout>
                    {customIcon || item.icon}
                  </motion.span>

                  <AnimatePresence mode="popLayout">
                    {isActive && (
                      <motion.span
                        layout
                        initial={{ opacity: 0, width: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, width: "auto", filter: "blur(0px)" }}
                        exit={{ opacity: 0, width: 0, filter: "blur(4px)" }}
                        transition={{ type: "spring", stiffness: 250, damping: 22 }}
                        className="text-black font-bold text-sm whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            );
          })}

          {/* Separator Line */}
          <div className="w-[1px] h-6 bg-white/20 self-center mx-1" />

          {/* Feedback Trigger Button */}
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="relative flex items-center justify-center w-12 h-12 rounded-full outline-none group text-white/60 hover:text-white"
            aria-label="Submit Feedback"
          >
            <ClipboardSignature strokeWidth={1.5} size={20} />
            
            {/* Exclamation indicator if feedback pending */}
            {!isFeedbackCompleted && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
            
            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none shadow-xl">
              Feedback
            </div>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-12 h-12 rounded-full outline-none group text-white/60 hover:text-white"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun strokeWidth={1.5} size={20} /> : <Moon strokeWidth={1.5} size={20} />}
            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none shadow-xl">
              Toggle Theme
            </div>
          </button>
        </motion.div>
      </div>

      {/* Screen-Locking Feedback Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-8 text-center rounded-2xl border border-white/20 shadow-2xl overflow-hidden bg-slate-900/95 dark:bg-slate-950/98 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors focus:outline-none"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Glowing decorative blur blobs */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Pulsing Clipboard Icon */}
                <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6 text-orange-500 animate-pulse">
                  <ClipboardSignature size={32} />
                </div>

                <h3 className="text-2xl font-black text-white mb-3">
                  We Value Your Feedback! 🌟
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Thank you for using the <strong>FoodCaliper</strong> platform. Please take 1 minute to fill out our quick questionnaire to help us improve the experience.
                </p>

                {/* Form Link CTA */}
                <motion.button
                  onClick={handleOpenFeedback}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-target w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 flex items-center justify-center gap-2 group transition-all"
                >
                  Complete Feedback Form
                  <motion.span 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="inline-block"
                  >
                    🚀
                  </motion.span>
                </motion.button>
                
                {/* Cancel/Later Button */}
                <button
                  onClick={() => setIsFeedbackOpen(false)}
                  className="mt-4 text-xs font-semibold text-slate-400 hover:text-white transition-colors focus:outline-none"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
