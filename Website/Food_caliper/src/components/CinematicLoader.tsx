import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroFood from "@/assets/hero-food.jpg";

interface CinematicLoaderProps {
  onComplete: () => void;
}

export default function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [coordinates, setCoordinates] = useState({ x: 142.4, y: 89.1, z: 12.0 });
  const [phase, setPhase] = useState<"scanning" | "collapsing" | "done">("scanning");

  const stableOnComplete = useCallback(onComplete, [onComplete]);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1500; // Crisp 1.5s high-speed calibration
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const nextProgress = Math.min(Math.round((elapsed / duration) * 100), 100);

      setProgress(nextProgress);

      if (nextProgress % 15 === 0) {
        setCoordinates({
          x: Number((Math.random() * 180 + 20).toFixed(1)),
          y: Number((Math.random() * 180 + 20).toFixed(1)),
          z: Number((Math.random() * 45 + 5).toFixed(1))
        });
      }

      if (nextProgress < 100) {
        rafId = requestAnimationFrame(animate);
      } else {
        setPhase("collapsing");
        setTimeout(() => {
          setPhase("done");
          stableOnComplete();
        }, 400);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [stableOnComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={phase === "done" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-[#060608] flex flex-col items-center justify-center p-4 select-none"
    >
      {/* Background Cyber Mesh */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <div className="absolute top-6 left-0 right-0 px-8 flex justify-between items-center z-10 w-full font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-white text-[11px] font-extrabold tracking-[0.25em] uppercase">FoodCaliper AI</span>
        </div>
        <div className="text-[9px] text-white/40 tracking-widest uppercase font-semibold">
          {phase === "scanning" ? "Spatial Mesh Calibration" : "Calibration Complete"}
        </div>
      </div>

      {/* Main 3D Calibrator Hub */}
      <div className="relative flex flex-col items-center gap-8 w-full max-w-lg z-10">
        
        {/* Floating Scan Target Container */}
        <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
          
          {/* Main Ring */}
          <div className="absolute inset-0 rounded-full border border-white/10 bg-slate-950/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />
          <div className="absolute inset-2 rounded-full border border-dashed border-orange-500/20 animate-spin" style={{ animationDuration: '40s' }} />

          {/* Real Food Image masked inside circle */}
          <motion.div 
            animate={phase === "collapsing" ? { scale: 1.05, opacity: 0.9, filter: "brightness(1.4)" } : {}}
            transition={{ duration: 0.4 }}
            className="absolute inset-6 rounded-full overflow-hidden border border-white/15"
          >
            <div 
              className="w-full h-full bg-cover bg-center opacity-90"
              style={{ backgroundImage: `url(${heroFood})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </motion.div>

          {/* Sweeping Laser Scan Line */}
          {phase === "scanning" && (
            <motion.div
              animate={{ top: ["12%", "88%", "12%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)] z-20"
            />
          )}

          {/* Progress Percentage Display */}
          {phase === "scanning" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none font-mono">
              <span className="text-white font-black text-4xl tracking-tight" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{progress}%</span>
              <span className="text-[9px] text-orange-400 font-bold uppercase tracking-[0.2em] mt-1">VOXEL MESH</span>
            </div>
          )}
        </div>

        {/* Console Telemetry */}
        <div className="w-full max-w-sm flex flex-col gap-4 font-mono text-[10px] text-white/50">
          
          {/* Active coordinate feed */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <div>
              <span className="text-white/40 text-[8px] uppercase font-bold tracking-wider">LATITUDE X</span>
              <p className="text-white font-extrabold text-xs mt-0.5 tabular-nums">{phase === "scanning" ? coordinates.x : "142.4"}</p>
            </div>
            <div>
              <span className="text-white/40 text-[8px] uppercase font-bold tracking-wider">LONGITUDE Y</span>
              <p className="text-white font-extrabold text-xs mt-0.5 tabular-nums">{phase === "scanning" ? coordinates.y : "89.1"}</p>
            </div>
            <div>
              <span className="text-white/40 text-[8px] uppercase font-bold tracking-wider">HEIGHT Z</span>
              <p className="text-orange-400 font-extrabold text-xs mt-0.5 tabular-nums">{phase === "scanning" ? coordinates.z : "12.0"}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-white/10 h-[3px] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] tracking-widest uppercase font-bold text-white/40">
              <span>FoodCaliper Spatial Calibration</span>
              <span className="text-orange-400 font-black tabular-nums">{progress}%</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
