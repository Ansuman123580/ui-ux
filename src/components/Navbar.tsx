import React from 'react';
import { Sparkles, Command, Zap } from 'lucide-react';

interface NavbarProps {
  onOpenCommand: () => void;
  onScrollTo: (id: string) => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenCommand, 
  onScrollTo, 
  favoritesCount 
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090d]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full rounded-[11px] bg-zinc-950 flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/30 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">
                KINETIC<span className="text-cyan-400">UI</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                v2.0
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 tracking-wider -mt-1 font-mono">LIVE COMPONENT LAB</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full p-1 px-3">
          <button 
            onClick={() => onScrollTo('components')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            Components
          </button>
          <button 
            onClick={() => onScrollTo('animation-library')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            Animations
          </button>
          <button 
            onClick={() => onScrollTo('pricing')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            Pro Access
          </button>
          <button 
            onClick={() => onScrollTo('faq')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            FAQ
          </button>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCommand}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-zinc-400 hover:text-zinc-200 transition-all font-mono shadow-inner"
          >
            <Command className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search components...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">⌘K</kbd>
          </button>

          {favoritesCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              <span>❤️</span> {favoritesCount}
            </div>
          )}

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <button
            onClick={() => onScrollTo('pricing')}
            className="relative group overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Unlock PRO</span>
          </button>
        </div>
      </div>
    </header>
  );
};
