import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';

interface Props {
  text?: string;
  glowColor?: string;
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________ABCDEF0123456789';

export const TextScrambleEffect: React.FC<Props> = ({ 
  text = "DECRYPT MATRIX CODE",
  glowColor = '#00f2fe'
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }
      iteration += 1 / 2.5;
    }, 30);
  };

  useEffect(() => {
    scramble();
  }, [text]);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full h-full gap-4">
      <div 
        onClick={scramble}
        className="group relative cursor-pointer px-6 py-4 rounded-xl bg-zinc-950/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex items-center gap-3 backdrop-blur-md"
        style={{
          boxShadow: isScrambling ? `0 0 30px -5px ${glowColor}50` : 'none'
        }}
      >
        <Terminal className="w-4 h-4 text-cyan-400" />
        <span className="font-mono text-sm tracking-wider font-semibold text-white selection:bg-cyan-500">
          {displayText}
        </span>
        <button 
          type="button" 
          aria-label="Re-scramble text"
          className="p-1 rounded bg-white/5 group-hover:bg-white/10 text-zinc-400 group-hover:text-cyan-300 transition-colors ml-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScrambling ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <span className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">Click box to trigger decrypt</span>
    </div>
  );
};
