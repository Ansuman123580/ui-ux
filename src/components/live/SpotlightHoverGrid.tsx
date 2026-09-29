import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Layers, MousePointer, Sparkles } from 'lucide-react';

interface Props {
  glowColor?: string;
}

export const SpotlightHoverGrid: React.FC<Props> = ({ glowColor = '#00f2fe' }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative p-6 w-full h-full flex items-center justify-center overflow-hidden rounded-2xl group"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              220px circle at ${mouseX}px ${mouseY}px,
              ${glowColor}25,
              transparent 80%
            )
          `
        }}
      />

      <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
        {[
          { icon: Layers, label: 'Adaptive Depth', sub: 'Layered glass' },
          { icon: Sparkles, label: 'Quantum Glow', sub: 'Luminescent' },
          { icon: MousePointer, label: 'Tracking', sub: 'Radial trace' },
          { icon: Layers, label: 'Sub-pixel', sub: 'Shader grid' },
        ].map((item, idx) => (
          <div 
            key={idx}
            className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col justify-between h-20"
          >
            <item.icon className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-white text-xs font-semibold">{item.label}</div>
              <div className="text-[10px] text-zinc-500">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
