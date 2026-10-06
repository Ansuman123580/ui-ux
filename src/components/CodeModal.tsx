import React, { useState, useEffect } from 'react';
import { UIComponent } from '../types';
import { X, Copy, Check, Terminal, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MagneticLiquidButton } from './live/MagneticLiquidButton';
import { HologramTiltCard } from './live/HologramTiltCard';
import { BorderBeamBento } from './live/BorderBeamBento';
import { TextScrambleEffect } from './live/TextScrambleEffect';
import { SpotlightHoverGrid } from './live/SpotlightHoverGrid';
import { FloatingDockNav } from './live/FloatingDockNav';
import { AudioVisualizerWave } from './live/AudioVisualizerWave';
import { NeonRadarScan } from './live/NeonRadarScan';

interface CodeModalProps {
  component: UIComponent | null;
  onClose: () => void;
}

type TabType = 'react' | 'tailwind' | 'vanilla';

export const CodeModal: React.FC<CodeModalProps> = ({ component, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('react');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedNpx, setCopiedNpx] = useState(false);
  const [glowColor, setGlowColor] = useState('#00f2fe');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!component) return null;

  const currentCode = component.code[activeTab] || component.code.react;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#8a2be2', '#10b981']
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyNpx = () => {
    navigator.clipboard.writeText(`npx obsidian-motion add ${component.id}`);
    setCopiedNpx(true);
    setTimeout(() => setCopiedNpx(false), 2000);
  };

  const renderComponentPreview = () => {
    switch (component.id) {
      case 'magnetic-liquid-button':
        return <MagneticLiquidButton glowColor={glowColor} />;
      case 'hologram-tilt-card':
        return <HologramTiltCard glowColor={glowColor} />;
      case 'border-beam-bento':
        return <BorderBeamBento glowColor={glowColor} />;
      case 'text-scramble-effect':
        return <TextScrambleEffect glowColor={glowColor} />;
      case 'spotlight-hover-grid':
        return <SpotlightHoverGrid glowColor={glowColor} />;
      case 'floating-dock-nav':
        return <FloatingDockNav glowColor={glowColor} />;
      case 'audio-visualizer-wave':
        return <AudioVisualizerWave glowColor={glowColor} />;
      case 'neon-radar-scan':
        return <NeonRadarScan glowColor={glowColor} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0b0d14] border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-bold text-lg">{component.title}</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {component.badge}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow overflow-y-auto">
          <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-white/[0.08] flex flex-col justify-between bg-zinc-950/40">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Live Interactive Sandbox
                </span>
                
                <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1.5 rounded-full border border-white/10">
                  {['#00f2fe', '#8a2be2', '#10b981', '#f59e0b'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setGlowColor(c)}
                      style={{ backgroundColor: c }}
                      aria-label={`Select glow color ${c}`}
                      className={`w-3.5 h-3.5 rounded-full transition-transform ${glowColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-50 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="min-h-[220px] rounded-2xl bg-zinc-950/80 border border-white/5 flex items-center justify-center p-4 shadow-inner">
                {renderComponentPreview()}
              </div>

              <p className="text-zinc-400 text-xs mt-4 leading-relaxed">
                {component.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08]">
              <div className="text-[11px] text-zinc-400 font-mono mb-2">CLI Auto-install:</div>
              <div 
                onClick={handleCopyNpx}
                className="cursor-pointer p-3 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-cyan-500/40 flex items-center justify-between text-xs font-mono text-zinc-300 transition-all"
              >
                <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">npx obsidian-motion add {component.id}</span>
                </div>
                {copiedNpx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col bg-[#07080c]">
            <div className="p-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 bg-zinc-950/60">
              <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setActiveTab('react')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'react' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  React (Framer Motion)
                </button>
                <button
                  onClick={() => setActiveTab('tailwind')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'tailwind' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Tailwind CSS
                </button>
                <button
                  onClick={() => setActiveTab('vanilla')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'vanilla' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  HTML/CSS
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-400/20 transition-all active:scale-95"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-zinc-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="p-5 flex-grow overflow-auto max-h-[480px] font-mono text-xs text-zinc-300 bg-[#07080c] leading-relaxed select-all">
              <pre>
                <code>{currentCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
