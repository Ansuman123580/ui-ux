import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

interface Props {
  glowColor?: string;
}

export const HologramTiltCard: React.FC<Props> = ({ glowColor = '#8a2be2' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div className="flex items-center justify-center p-6 w-full h-full perspective-[1000px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-[280px] h-[190px] rounded-2xl bg-zinc-950/90 border border-white/10 p-6 flex flex-col justify-between overflow-hidden cursor-pointer group shadow-2xl backdrop-blur-2xl transition-all duration-300"
      >
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor}40 0%, transparent 60%)`
          }}
        />

        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        <div style={{ transform: "translateZ(40px)" }} className="relative z-10 flex items-center justify-between">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-violet-400 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
            HOLOGRAM
          </span>
        </div>

        <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
          <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-1.5">
            Cyber Matrix Card
          </h4>
          <p className="text-zinc-400 text-xs mt-1">60FPS spring-physics 3D perspective</p>
        </div>

        <div style={{ transform: "translateZ(25px)" }} className="relative z-10 flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-zinc-500 font-mono">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-400" /> WebGL Tier
          </span>
          <span className="text-cyan-400 font-semibold">TILT ME</span>
        </div>
      </motion.div>
    </div>
  );
};
