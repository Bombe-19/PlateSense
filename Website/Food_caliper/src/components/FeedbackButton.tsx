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
      // Show mandatory modal after 4 seconds delay
      const modalTimer = setTimeout(() => {
        setShowModal(true);
      }, 4000);

      // Show pulsing helper tooltip after 2 seconds delay
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true);
      }, 2000);

      return () => {
        clearTimeout(modalTimer);
        clearTimeout(tooltipTimer);
      };
    }
  }, []);

  const handleOpenFeedback = () => {
    window.open(FEEDBACK_LINK, '_blank', 'noopener,noreferrer');
    // Save completion flag in browser to unlock user session
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
              className="bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-orange-400 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>📝 Feedback Required!</span>
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
            
            {/* Small red exclamation alert indicator */}
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
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Prompt Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-card max-w-md w-full p-8 text-center border border-white/20 shadow-2xl relative overflow-hidden bg-slate-900/90 dark:bg-slate-950/95"
            >
              {/* Background gradient blur glow decoration */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Pulsing Clipboard Icon */}
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 text-indigo-400 animate-pulse">
                  <ClipboardSignature size={32} />
                </div>

                <h3 className="text-2xl font-black text-white mb-3">
                  We Need Your Feedback! 🌟
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Thank you for reviewing the <strong>FoodCaliper</strong> platform. To complete the review process, filling out our quick 1-minute feedback questionnaire is <strong>mandatory</strong>.
                </p>

                {/* Pulsing Form Link CTA */}
                <motion.button
                  onClick={handleOpenFeedback}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-target w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-2 group transition-all"
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
                
                <p className="text-[10px] text-slate-500 mt-4">
                  * Opens in a new tab. Completing the form will instantly unlock the platform.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackButton;
