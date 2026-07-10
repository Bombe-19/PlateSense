import React, { useEffect, useState } from 'react';
import { ClipboardSignature, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FEEDBACK_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSf_ASUakna27D9PG_AAXAfrvgUZnukg55IWfYtDUsWlJtoypA/viewform?usp=header";

export const FeedbackButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has already completed the feedback
    const isCompleted = localStorage.getItem('foodCaliperFeedbackCompleted') === 'true';
    
    if (!isCompleted) {
      // Show pulsing helper tooltip after 4 seconds delay to invite feedback (non-intrusive)
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true);
      }, 4000);

      return () => {
        clearTimeout(tooltipTimer);
      };
    }
  }, []);

  const handleOpenFeedback = () => {
    window.open(FEEDBACK_LINK, '_blank', 'noopener,noreferrer');
    // Save completion flag in browser
    localStorage.setItem('foodCaliperFeedbackCompleted', 'true');
    setShowModal(false);
    setShowTooltip(false);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Action Button */}
      <div className="no-print fixed bottom-24 right-24 z-[9999] pointer-events-auto flex items-center gap-3">
        {/* Pulsing Helper Notification Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-indigo-500 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>📝 Share Your Feedback!</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }} 
                className="hover:opacity-85 text-white/80 p-0.5 rounded focus:outline-none"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Action Button */}
        <motion.button
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative group focus:outline-none"
          aria-label="Submit Feedback"
        >
          {/* Pulse Ripple Effect */}
          <span className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping" />
          
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg border border-indigo-400/40 flex items-center justify-center hover:shadow-indigo-500/50 transition-all duration-300">
            <ClipboardSignature size={24} className="text-white" />
            
            {/* Small red exclamation alert indicator if pending */}
            {localStorage.getItem('foodCaliperFeedbackCompleted') !== 'true' && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-black text-white items-center justify-center">!</span>
              </span>
            )}
          </div>
        </motion.button>
      </div>

      {/* Screen-Locking Mandatory Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Dark blur backdrop (clicking outside closes the modal since it is optional) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm cursor-pointer"
            />

            {/* Prompt Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-card max-w-md w-full p-8 text-center border border-white/20 shadow-2xl relative overflow-hidden bg-slate-900/95 dark:bg-slate-950/98"
            >
              {/* Close button at top right */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors focus:outline-none"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Background gradient blur glow decoration */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Pulsing Clipboard Icon */}
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 text-indigo-400 animate-pulse">
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
                  className="cursor-target w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center gap-2 group transition-all"
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
                  onClick={() => setShowModal(false)}
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
};

export default FeedbackButton;
