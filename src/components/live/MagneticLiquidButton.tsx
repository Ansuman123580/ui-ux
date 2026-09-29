import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
  glowColor?: string;
  label?: string;
}

export const MagneticLiquidButton: React.FC<Props> = ({ 
  glowColor = '#00f2fe',
  label = "Hover & Drag Me" 
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex items-center justify-center p-8 w-full h-full">
      <motion.button
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        style={{
          boxShadow: `0 0 35px -5px ${glowColor}60`
        }}
        className="relative group overflow-hidden px-8 py-4 rounded-2xl bg-zinc-950/80 border border-white/20 text-white font-medium text-sm tracking-wide flex items-center gap-3 backdrop-blur-xl transition-colors duration-300"
      >
        <span 
          style={{ backgroundColor: glowColor }}
          className="absolute inset-0 opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 scale-150"
        />
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform ease-out" />
        <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" style={{ color: glowColor }} />
        <span className="relative z-10 font-semibold tracking-wider">{label}</span>
      </motion.button>
    </div>
  );
};
