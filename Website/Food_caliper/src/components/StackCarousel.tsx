import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Rotate3d, Compass, TrendingUp, ChevronRight } from "lucide-react";

interface CardData {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
  visual: React.ReactNode;
}

const CARDS: CardData[] = [
  {
    id: "seg",
    title: "Visual Segmentation",
    desc: "Extracts fine contours and bounding hulls for overlapping ingredients on the plate.",
    icon: <Brain className="text-cyan-400" size={20} />,
    accent: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 shadow-cyan-500/5",
    visual: (
      <div className="relative w-full h-28 bg-slate-950 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-cyan-500/30 animate-spin" style={{ animationDuration: "12s" }} />
        <div className="absolute w-16 h-16 rounded-full border border-orange-500/30 animate-pulse" />
        <div className="absolute top-4 left-6 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono text-cyan-400">
          HULL: 98.4%
        </div>
        <div className="absolute bottom-4 right-6 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] font-mono text-orange-400">
          MESH: OK
        </div>
      </div>
    )
  },
  {
    id: "rect",
    title: "3D Perspective Rectification",
    desc: "Corrects for camera tilt angles and maps raw image pixels to coordinate spaces.",
    icon: <Rotate3d className="text-orange-400" size={20} />,
    accent: "from-orange-500/20 to-amber-500/20 border-orange-500/30 shadow-orange-500/5",
    visual: (
      <div className="relative w-full h-28 bg-slate-950 rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-center px-6">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono text-white/50">
            <span>Tilt angle:</span>
            <span className="text-orange-400 font-bold">14.5°</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full w-[70%] animate-pulse" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/50">
            <span>Rectification matrix:</span>
            <span className="text-white/80">0.982x</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "density",
    title: "Mass & Density Conversion",
    desc: "Looks up volumetric regions in our USDA-derived mass profile databases.",
    icon: <Compass className="text-emerald-400" size={20} />,
    accent: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 shadow-emerald-500/5",
    visual: (
      <div className="relative w-full h-28 bg-slate-950 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-between px-8">
        <div className="space-y-1">
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Calibrated Constant</p>
          <p className="text-xl font-extrabold text-emerald-400">1.042 <span className="text-xs text-white/60">g/cm³</span></p>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 flex items-center justify-center relative">
          <span className="absolute w-10 h-10 rounded-full border-2 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <span className="text-[10px] font-bold text-emerald-400">USDA</span>
        </div>
      </div>
    )
  },
  {
    id: "trends",
    title: "Synchronized Calorie Logger",
    desc: "Pushes calculated portion logs straight to your historical dashboard trends.",
    icon: <TrendingUp className="text-purple-400" size={20} />,
    accent: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 shadow-purple-500/5",
    visual: (
      <div className="relative w-full h-28 bg-slate-950 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
        <div className="w-[80%] h-14 flex items-end gap-1.5">
          {[40, 60, 45, 90, 75, 110, 85].map((val, idx) => (
            <div key={idx} className="flex-1 bg-gradient-to-t from-purple-500 to-indigo-500 rounded-t" style={{ height: `${val}%` }} />
          ))}
        </div>
        <div className="absolute top-2 right-4 text-[9px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
          WEEKLY TRENDS
        </div>
      </div>
    )
  }
];

export default function StackCarousel() {
  const [stack, setStack] = useState<number[]>([0, 1, 2, 3]);

  const handleNext = () => {
    setStack((prev) => {
      const nextStack = [...prev];
      const first = nextStack.shift();
      if (first !== undefined) {
        nextStack.push(first);
      }
      return nextStack;
    });
  };

  const handleSwipeEnd = (event: any, info: any) => {
    // If dragged more than 100px left or right, trigger shift
    if (Math.abs(info.offset.x) > 100) {
      handleNext();
    }
  };

  return (
    <div className="relative w-full h-[380px] flex items-center justify-center">
      {/* 3D Stack container */}
      <div className="relative w-full max-w-[340px] h-[340px] flex items-center justify-center">
        <AnimatePresence>
          {stack.map((cardIndex, positionInStack) => {
            const card = CARDS[cardIndex];
            const isFrontCard = positionInStack === 0;

            // Compute positions/scales for stack layer effects
            const scale = 1 - positionInStack * 0.05;
            const yOffset = positionInStack * 16;
            const zIndex = 10 - positionInStack;
            const opacity = 1 - positionInStack * 0.25;

            return (
              <motion.div
                key={card.id}
                drag={isFrontCard ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleSwipeEnd}
                style={{
                  zIndex,
                  cursor: isFrontCard ? "grab" : "default"
                }}
                animate={{
                  scale,
                  y: yOffset,
                  opacity,
                  rotate: isFrontCard ? 0 : (positionInStack % 2 === 0 ? 2 : -2)
                }}
                whileActive={isFrontCard ? { cursor: "grabbing" } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`absolute w-full p-6 rounded-3xl premium-glass bg-gradient-to-br ${card.accent} border shadow-2xl flex flex-col justify-between h-[300px] pointer-events-auto`}
              >
                {/* Card Header */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                    {card.icon}
                  </div>
                  <h4 className="text-white font-extrabold text-base tracking-tight">{card.title}</h4>
                </div>

                {/* Card Visual Representation */}
                <div className="my-4">
                  {card.visual}
                </div>

                {/* Card Footer description */}
                <div className="flex justify-between items-end gap-4 mt-auto">
                  <p className="text-[11px] text-white/60 leading-relaxed max-w-[80%]">
                    {card.desc}
                  </p>
                  
                  {isFrontCard && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all shrink-0 hover:scale-105"
                    >
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
