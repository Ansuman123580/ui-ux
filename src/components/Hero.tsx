import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MagneticLiquidButton } from './live/MagneticLiquidButton';
import heroVisual from '../assets/animaster/hero-18-500.webp';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const [copiedCli, setCopiedCli] = useState(false);
  const [heroGlow, setHeroGlow] = useState('#00f2fe');

  const handleCopyCli = () => {
    navigator.clipboard.writeText('npx obsidian-motion init');
    setCopiedCli(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00f2fe', '#8a2be2', '#10b981']
    });
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      <div 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[160px] opacity-12"
        style={{
          background: `radial-gradient(circle, ${heroGlow} 0%, #8a2be2 50%, transparent 80%)`
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[560px] max-w-6xl overflow-hidden rounded-[3rem] opacity-10 [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <img src={heroVisual} alt="" className="h-full w-full object-cover mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md shadow-inner text-xs text-zinc-300"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-semibold text-white">296 motion references</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">8 live components</span>
          </motion.div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
          >
            Motion-led interfaces <br />
            <span className="text-cyan-300">with a point of view.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            A focused library of interaction patterns for product teams who care about the small things: a button that responds, a card that holds attention, and motion that has a reason to exist.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={onExplore}
              className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 transition-all flex items-center gap-2 group"
            >
              <span>Browse the library</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div 
              onClick={handleCopyCli}
              className="cursor-pointer px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all flex items-center gap-3 font-mono text-xs backdrop-blur-md shadow-lg"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>npx obsidian-motion init</span>
              <button 
                type="button" 
                aria-label="Copy CLI command"
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400"
              >
                {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 max-w-3xl mx-auto rounded-3xl bg-zinc-950/60 border border-white/[0.08] p-4 sm:p-6 backdrop-blur-2xl shadow-2xl relative"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="font-mono text-zinc-400 ml-2">magnetic-button.tsx</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 font-mono">Accent</span>
                {['#00f2fe', '#8a2be2', '#10b981', '#f59e0b'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setHeroGlow(color)}
                    style={{ backgroundColor: color }}
                    aria-label={`Select glow color ${color}`}
                    className={`w-3.5 h-3.5 rounded-full transition-transform ${heroGlow === color ? 'scale-125 ring-2 ring-white' : 'opacity-60'}`}
                  />
                ))}
              </div>
            </div>

            <div className="h-44 sm:h-52 flex items-center justify-center">
              <MagneticLiquidButton glowColor={heroGlow} label="Hover & Drag Me — Live Spring Physics" />
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Real-time interactive canvas
              </span>
                <span className="text-cyan-400">React / Tailwind / Framer Motion</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
