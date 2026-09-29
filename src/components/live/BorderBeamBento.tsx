import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu } from 'lucide-react';

interface Props {
  glowColor?: string;
}

export const BorderBeamBento: React.FC<Props> = ({ glowColor = '#00f2fe' }) => {
  return (
    <div className="flex items-center justify-center p-6 w-full h-full">
      <div className="relative w-full max-w-[300px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 overflow-hidden backdrop-blur-xl group">
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1.5px',
          }}
        >
          <motion.div
            className="w-[120px] h-[120px] absolute -top-[60px] -left-[60px] rounded-full blur-[2px]"
            style={{
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
            }}
            animate={{
              x: [0, 260, 260, 0, 0],
              y: [0, 0, 160, 160, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white text-xs font-semibold">Engine Core v3</div>
              <div className="text-[10px] text-zinc-400 font-mono">Neural Pipeline</div>
            </div>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Processing Rate</span>
            <span className="font-mono text-cyan-300 font-medium">99.84%</span>
          </div>
          <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ backgroundColor: glowColor }}
              initial={{ width: '40%' }}
              animate={{ width: ['40%', '85%', '65%', '92%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-zinc-400" /> Real-time Beam
          </span>
          <span className="font-mono text-[10px] text-zinc-500">BENTO-FX</span>
        </div>
      </div>
    </div>
  );
};
