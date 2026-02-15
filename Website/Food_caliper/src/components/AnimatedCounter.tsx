import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

const AnimatedCounter = ({ value, suffix = "", duration = 2, className = "" }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const stepTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += Math.ceil(end / 60);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
