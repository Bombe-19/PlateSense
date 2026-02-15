import { motion } from "framer-motion";

const ScanAnimation = ({ isScanning }: { isScanning: boolean }) => {
  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl">
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-primary/5 animate-pulse-soft" />
    </div>
  );
};

export default ScanAnimation;
