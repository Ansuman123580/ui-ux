import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

interface Props {
  glowColor?: string;
}

export const AudioVisualizerWave: React.FC<Props> = ({ glowColor = '#00f2fe' }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const bars = 18;

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full h-full gap-4">
      <div className="flex items-center gap-1.5 h-16 px-6 py-3 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl">
        {Array.from({ length: bars }).map((_, i) => {
          const delay = (i % 6) * 0.12;
          const duration = 0.5 + Math.random() * 0.5;

          return (
            <motion.div
              key={i}
              className="w-1.5 rounded-full"
              style={{
                backgroundColor: glowColor,
                boxShadow: `0 0 10px ${glowColor}60`
              }}
              animate={isPlaying ? {
                height: [
                  '8px',
                  `${12 + Math.random() * 38}px`,
                  `${6 + Math.random() * 20}px`,
                  `${20 + Math.random() * 30}px`,
                  '8px'
                ]
              } : { height: '6px' }}
              transition={isPlaying ? {
                duration: duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay
              } : { duration: 0.3 }}
            />
          );
        })}
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 font-mono transition-colors"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-zinc-400" />}
        <span>{isPlaying ? 'PAUSE WAVE' : 'RESUME WAVE'}</span>
      </button>
    </div>
  );
};
