import React, { useState } from 'react';
import { UIComponent } from '../types';
import { Code, Heart, ExternalLink } from 'lucide-react';
import { MagneticLiquidButton } from './live/MagneticLiquidButton';
import { HologramTiltCard } from './live/HologramTiltCard';
import { BorderBeamBento } from './live/BorderBeamBento';
import { TextScrambleEffect } from './live/TextScrambleEffect';
import { SpotlightHoverGrid } from './live/SpotlightHoverGrid';
import { FloatingDockNav } from './live/FloatingDockNav';
import { AudioVisualizerWave } from './live/AudioVisualizerWave';
import { NeonRadarScan } from './live/NeonRadarScan';

interface ComponentCardProps {
  component: UIComponent;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectComponent: (component: UIComponent) => void;
}

const COLOR_OPTIONS = ['#00f2fe', '#8a2be2', '#10b981', '#f59e0b', '#f43f5e'];

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  isFavorite,
  onToggleFavorite,
  onSelectComponent,
}) => {
  const [selectedGlow, setSelectedGlow] = useState('#00f2fe');

  const renderLivePreview = () => {
    switch (component.id) {
      case 'magnetic-liquid-button':
        return <MagneticLiquidButton glowColor={selectedGlow} />;
      case 'hologram-tilt-card':
        return <HologramTiltCard glowColor={selectedGlow} />;
      case 'border-beam-bento':
        return <BorderBeamBento glowColor={selectedGlow} />;
      case 'text-scramble-effect':
        return <TextScrambleEffect glowColor={selectedGlow} />;
      case 'spotlight-hover-grid':
        return <SpotlightHoverGrid glowColor={selectedGlow} />;
      case 'floating-dock-nav':
        return <FloatingDockNav glowColor={selectedGlow} />;
      case 'audio-visualizer-wave':
        return <AudioVisualizerWave glowColor={selectedGlow} />;
      case 'neon-radar-scan':
        return <NeonRadarScan glowColor={selectedGlow} />;
      default:
        return (
          <div className="flex items-center justify-center p-8 text-zinc-500 font-mono text-xs">
            Interactive Sandbox Active
          </div>
        );
    }
  };

  return (
    <article className="group relative rounded-3xl bg-zinc-950/70 border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 flex flex-col overflow-hidden shadow-xl backdrop-blur-xl">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          {component.badge && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              component.badge === 'TRENDING'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : component.badge === 'NEW'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : component.badge === 'PRO'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              {component.badge}
            </span>
          )}
          <span className="text-[11px] text-zinc-400 font-mono">
            {component.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/5">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedGlow(c)}
                style={{ backgroundColor: c }}
                aria-label={`Select accent color ${c}`}
                className={`w-2.5 h-2.5 rounded-full transition-transform ${selectedGlow === c ? 'scale-125 ring-1 ring-white' : 'opacity-40 hover:opacity-80'}`}
              />
            ))}
          </div>

          <button
            onClick={() => onToggleFavorite(component.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-rose-400 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      <div className="relative min-h-[220px] flex items-center justify-center bg-gradient-to-b from-white/[0.01] to-black/40 border-y border-white/[0.04] overflow-hidden">
        {renderLivePreview()}
      </div>

      <div className="p-5 flex flex-col justify-between flex-grow gap-4">
        <div>
          <h3 className="text-white font-bold text-base group-hover:text-cyan-300 transition-colors">
            {component.title}
          </h3>
          <p className="text-zinc-400 text-xs mt-1 leading-relaxed line-clamp-2">
            {component.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {component.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.04] text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
          <span className="text-[11px] text-zinc-500 font-mono">
            {component.dependencies.join(' + ')}
          </span>

          <button
            onClick={() => onSelectComponent(component)}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-cyan-500 hover:text-zinc-950 text-xs font-semibold text-zinc-300 transition-all flex items-center gap-1.5 group/btn"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Get Code</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
