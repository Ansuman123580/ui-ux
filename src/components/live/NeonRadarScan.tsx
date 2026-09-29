import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  glowColor?: string;
}

export const NeonRadarScan: React.FC<Props> = ({ glowColor = '#00f2fe' }) => {
  return (
    <div className="flex items-center justify-center p-6 w-full h-full">
      <div className="relative w-44 h-44 rounded-full border border-white/10 bg-zinc-950/80 flex items-center justify-center overflow-hidden backdrop-blur-xl">
        <div className="absolute w-32 h-32 rounded-full border border-white/10 border-dashed" />
        <div className="absolute w-20 h-20 rounded-full border border-white/10" />
        <div className="absolute w-8 h-8 rounded-full border border-cyan-500/30" />

        <div className="absolute inset-x-0 h-px bg-white/10" />
        <div className="absolute inset-y-0 w-px bg-white/10" />

        <motion.div
          className="absolute inset-0 origin-center"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
        >
          <div 
            className="w-1/2 h-1/2 origin-bottom-right"
            style={{
              background: `conic-gradient(from 0deg at 100% 100%, ${glowColor}60 0deg, transparent 65deg)`,
            }}
          />
        </motion.div>

        <motion.div
          className="absolute top-10 right-12 w-2 h-2 rounded-full"
          style={{ backgroundColor: glowColor, boxShadow: `0 0 10px ${glowColor}` }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
        />

        <motion.div
          className="absolute bottom-12 left-10 w-2 h-2 rounded-full bg-emerald-400"
          style={{ boxShadow: '0 0 10px #10b981' }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 2.2 }}
        />

        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 z-10 shadow-lg shadow-cyan-400/50" />
      </div>
    </div>
  );
};
