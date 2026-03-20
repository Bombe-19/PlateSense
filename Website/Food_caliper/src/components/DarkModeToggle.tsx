import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

type Theme = 'light' | 'dark';

export const DarkModeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggleTheme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-6 z-[9999] pointer-events-auto"
      aria-label="Toggle theme"
    >
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg border border-orange-400/50 flex items-center justify-center hover:shadow-orange-500/50 transition-all duration-300">
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'dark' ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'dark' ? (
            <Moon size={24} className="text-white" />
          ) : (
            <Sun size={24} className="text-white" />
          )}
        </motion.div>
      </div>
    </motion.button>
  );
};

export default DarkModeToggle;
