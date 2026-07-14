import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroFood from "@/assets/hero-food.jpg";

interface CinematicLoaderProps {
  onComplete: () => void;
}

export default function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [phase, setPhase] = useState<"scanning" | "collapsing" | "done">("scanning");

  const stableOnComplete = useCallback(onComplete, []);

  useEffect(() => {
    const duration = 3400; // 3.4s calibration sequence
    const intervalTime = 25;
    const totalSteps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const nextProgress = Math.min(Math.round((step / totalSteps) * 100), 100);
      setProgress(nextProgress);

      // Randomize coordinates to simulate real-time 3D scanning calibration
      setCoordinates({
        x: Number((Math.random() * 180 + 20).toFixed(1)),
        y: Number((Math.random() * 180 + 20).toFixed(1)),
        z: Number((Math.random() * 45 + 5).toFixed(1))
      });

      if (nextProgress >= 100) {
        clearInterval(timer);
        setPhase("collapsing");

        // Wait for particle collapse transition before passing
        setTimeout(() => {
          setPhase("done");
          stableOnComplete();
        }, 1200);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [stableOnComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={phase === "done" ? { opacity: 0 } : { opacity: 1 }}
      className="fixed inset-0 z-50 bg-[#060608] flex flex-col items-center justify-center p-4 select-none"
    >
      {/* Background Cyber Mesh */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <div className="absolute top-6 left-0 right-0 px-8 flex justify-between items-center z-10 w-full font-mono">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-white text-[10px] font-bold tracking-[0.25em] uppercase">FoodCaliper AI</span>
        </div>
        <div className="text-[9px] text-white/30 tracking-widest uppercase">
          {phase === "scanning" ? "Mesh Reconstruction active" : "Reconstruction Complete"}
        </div>
      </div>

      {/* Main 3D Calibrator Hub */}
      <div className="relative flex flex-col items-center gap-8 w-full max-w-lg z-10">
        
        {/* Floating Scan Target Container */}
        <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
          
          {/* Main Ring */}
          <div className="absolute inset-0 rounded-full border border-white/5 bg-slate-950/20 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />
          <div className="absolute inset-2 rounded-full border border-dashed border-orange-500/10 animate-spin" style={{ animationDuration: '60s' }} />

          {/* Real Food Image masked inside the circle */}
          <motion.div 
            animate={phase === "collapsing" ? { scale: 1.05, opacity: 0.8, filter: "brightness(1.5) blur(2px)" } : {}}
            transition={{ duration: 1 }}
            className="absolute inset-6 rounded-full overflow-hidden border border-white/10"
          >
            <div 
              className="w-full h-full bg-cover bg-center opacity-85"
              style={{ backgroundImage: `url(${heroFood})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </motion.div>

          {/* Animated 3D wireframe mesh contour overlay */}
          <AnimatePresence>
            {phase === "scanning" && (
              <svg 
                className="absolute inset-6 w-[calc(100%-48px)] h-[calc(100%-48px)] text-cyan-500/40 fill-none stroke-current stroke-[0.5] z-20 pointer-events-none"
                viewBox="0 0 100 100"
              >
                {/* Horizontal Mesh Lines */}
                {[15, 25, 35, 45, 55, 65, 75, 85].map((y, idx) => (
                  <motion.path
                    key={`h-${y}`}
                    d={`M 10,${y} Q 25,${y - (idx % 2 === 0 ? 3 : -3)} 50,${y} T 90,${y}`}
                    animate={{
                      d: [
                        `M 10,${y} Q 25,${y - (idx % 2 === 0 ? 3 : -3)} 50,${y} T 90,${y}`,
                        `M 10,${y} Q 25,${y - (idx % 2 === 0 ? -3 : 3)} 50,${y} T 90,${y}`,
                        `M 10,${y} Q 25,${y - (idx % 2 === 0 ? 3 : -3)} 50,${y} T 90,${y}`
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.1
                    }}
                  />
                ))}

                {/* Vertical Mesh Lines */}
                {[15, 25, 35, 45, 55, 65, 75, 85].map((x, idx) => (
                  <motion.path
                    key={`v-${x}`}
                    d={`M ${x},10 Q ${x - (idx % 2 === 0 ? 3 : -3)},25 ${x},50 T ${x},90`}
                    animate={{
                      d: [
                        `M ${x},10 Q ${x - (idx % 2 === 0 ? 3 : -3)},25 ${x},50 T ${x},90`,
                        `M ${x},10 Q ${x - (idx % 2 === 0 ? -3 : 3)},25 ${x},50 T ${x},90`,
                        `M ${x},10 Q ${x - (idx % 2 === 0 ? 3 : -3)},25 ${x},50 T ${x},90`
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.1
                    }}
                  />
                ))}

                {/* Bounding shape highlights */}
                {progress > 30 && (
                  <circle cx="48" cy="45" r="14" stroke="rgba(249, 115, 22, 0.6)" strokeWidth="1" strokeDasharray="3 3" />
                )}
                {progress > 60 && (
                  <circle cx="65" cy="58" r="10" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1" strokeDasharray="3 3" />
                )}
              </svg>
            )}
          </AnimatePresence>

          {/* Sweeping Laser Scan Line */}
          {phase === "scanning" && (
            <motion.div
              animate={{ top: ["12%", "88%", "12%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute left-[8%] right-[8%] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)] z-20"
            />
          )}

          {/* Collapsing Particles Burst Effect */}
          <AnimatePresence>
            {phase === "collapsing" && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                {[...Array(30)].map((_, i) => {
                  const angle = Math.random() * Math.PI * 2;
                  const distance = Math.random() * 120 + 40;
                  const xTarget = Math.cos(angle) * distance;
                  const yTarget = Math.sin(angle) * distance;

                  return (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                      animate={{
                        x: xTarget,
                        y: yTarget,
                        scale: 0,
                        opacity: 0
                      }}
                      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] 
                        ${i % 2 === 0 ? "bg-orange-500 text-orange-500" : "bg-cyan-400 text-cyan-400"}`}
                    />
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {/* Progress Percentage Display */}
          {phase === "scanning" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none font-mono">
              <span className="text-white font-black text-3xl tracking-tight" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{progress}%</span>
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mt-0.5">MESH CALIB</span>
            </div>
          )}
        </div>

        {/* Console Logs & Coordinate Telemetry */}
        <div className="w-full max-w-sm flex flex-col gap-4 font-mono text-[10px] text-white/50">
          
          {/* Active coordinate feed */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div>
              <span className="text-white/30 text-[8px] uppercase font-bold tracking-wider">LATITUDE X</span>
              <p className="text-white font-extrabold text-xs mt-0.5 tabular-nums">{phase === "scanning" ? coordinates.x : "142.4"}</p>
            </div>
            <div>
              <span className="text-white/30 text-[8px] uppercase font-bold tracking-wider">LONGITUDE Y</span>
              <p className="text-white font-extrabold text-xs mt-0.5 tabular-nums">{phase === "scanning" ? coordinates.y : "89.1"}</p>
            </div>
            <div>
              <span className="text-white/30 text-[8px] uppercase font-bold tracking-wider">HEIGHT Z</span>
              <p className="text-orange-500 font-extrabold text-xs mt-0.5 tabular-nums">{phase === "scanning" ? coordinates.z : "12.0"}</p>
            </div>
          </div>

          {/* Load Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] tracking-widest uppercase font-bold text-white/30">
              <span>USDA mass calibration</span>
              <span className="text-orange-500 font-black tabular-nums">{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
