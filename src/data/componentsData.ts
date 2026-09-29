import { UIComponent } from '../types';

export const COMPONENTS_DATA: UIComponent[] = [
  {
    id: 'magnetic-liquid-button',
    title: 'Magnetic Liquid Button',
    description: 'Smooth magnetic mouse tracking with dynamic liquid spring physics and neon shimmer ripple.',
    category: 'buttons',
    badge: 'TRENDING',
    tags: ['Interactive', 'Spring Physics', 'Framer Motion', 'Hover Effect'],
    dependencies: ['framer-motion', 'lucide-react'],
    customizable: {
      supportsGlowColor: true,
      supportsSpeed: true,
    },
    code: {
      react: `import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const MagneticLiquidButton = ({ 
  glowColor = "#00f2fe", 
  label = "Explore Universe" 
}) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.35;
    const y = (e.clientY - (top + height / 2)) * 0.35;
    setPos({ x, y });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ boxShadow: \`0 0 35px -5px \${glowColor}60\` }}
      className="relative group overflow-hidden px-8 py-4 rounded-2xl bg-zinc-950/80 border border-white/20 text-white font-medium flex items-center gap-3 backdrop-blur-xl"
    >
      <span 
        style={{ backgroundColor: glowColor }}
        className="absolute inset-0 opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 scale-150" 
      />
      <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
      <span className="relative z-10 font-semibold tracking-wider">{label}</span>
    </motion.button>
  );
};`,
      tailwind: `<button class="relative group overflow-hidden px-8 py-4 rounded-2xl bg-zinc-950 border border-white/20 text-white font-medium flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_35px_-5px_rgba(0,242,254,0.4)]">
  <span class="absolute inset-0 bg-cyan-400 opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 scale-150"></span>
  <span class="relative z-10 font-semibold tracking-wider">Explore Universe</span>
</button>`,
      vanilla: `<!-- Magnetic Button HTML -->
<button class="magnetic-btn">
  <span class="glow"></span>
  <span class="text">Explore Universe</span>
</button>`
    }
  },
  {
    id: 'hologram-tilt-card',
    title: '3D Hologram Tilt Card',
    description: 'Ultra-smooth 3D parallax tilt card responding to mouse coordinates with realistic specular glare.',
    category: 'cards',
    badge: 'NEW',
    tags: ['3D Perspective', 'Spring Physics', 'Framer Motion', 'Card'],
    dependencies: ['framer-motion', 'lucide-react'],
    customizable: {
      supportsGlowColor: true,
      supportsIntensity: true,
    },
    code: {
      react: `import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const HologramTiltCard = ({ glowColor = "#8a2be2" }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-72 h-48 rounded-2xl bg-zinc-950/90 border border-white/10 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group cursor-pointer"
      >
        <div style={{ transform: "translateZ(40px)" }} className="relative z-10">
          <span className="text-xs font-mono text-zinc-400">3D HOLOGRAM</span>
          <h3 className="text-white text-lg font-bold mt-1">Matrix Perspective</h3>
        </div>
      </motion.div>
    </div>
  );
};`,
      tailwind: `<div class="perspective-[1000px]">
  <div class="w-72 h-48 rounded-2xl bg-zinc-950 border border-white/10 p-6 shadow-2xl transition-transform duration-300 hover:rotate-x-12 hover:-rotate-y-12">
    <span class="text-xs font-mono text-zinc-400">3D HOLOGRAM</span>
    <h3 class="text-white text-lg font-bold mt-1">Matrix Perspective</h3>
  </div>
</div>`,
      vanilla: `<!-- 3D Card HTML -->
<div class="card-3d">
  <h3>Cyber Matrix</h3>
</div>`
    }
  },
  {
    id: 'border-beam-bento',
    title: 'Laser Border-Beam Bento',
    description: 'Continuous laser beam tracing around the border perimeter of bento grid cards.',
    category: 'cards',
    badge: 'POPULAR',
    tags: ['Bento Grid', 'Border Beam', 'Animation', 'Dashboard'],
    dependencies: ['framer-motion', 'lucide-react'],
    customizable: {
      supportsGlowColor: true,
      supportsSpeed: true,
    },
    code: {
      react: `import React from 'react';
import { motion } from 'framer-motion';

export const BorderBeamBento = ({ glowColor = "#00f2fe" }) => {
  return (
    <div className="relative w-72 rounded-2xl bg-zinc-950/80 border border-white/10 p-5 overflow-hidden backdrop-blur-xl">
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
          className="w-28 h-28 absolute -top-14 -left-14 rounded-full blur-[2px]"
          style={{ background: \`radial-gradient(circle, \${glowColor} 0%, transparent 70%)\` }}
          animate={{ x: [0, 260, 260, 0, 0], y: [0, 0, 160, 160, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <h4 className="text-white text-sm font-semibold">Engine Core v3</h4>
      <p className="text-zinc-400 text-xs mt-1">Neural Pipeline 99.8% Active</p>
    </div>
  );
};`,
      tailwind: `<div class="relative w-72 rounded-2xl bg-zinc-950 border border-white/10 p-5 overflow-hidden">
  <div class="text-white font-semibold text-sm">Engine Core</div>
</div>`,
      vanilla: `<!-- Border Beam HTML & CSS -->`
    }
  },
  {
    id: 'text-scramble-effect',
    title: 'Cyberpunk Text Decrypter',
    description: 'Hacker matrix decrypting scramble animation with random alphanumeric character morphing.',
    category: 'text',
    badge: 'NEW',
    tags: ['Text FX', 'Cyberpunk', 'Hacker', 'Morph'],
    dependencies: ['lucide-react'],
    customizable: {
      supportsGlowColor: true,
    },
    code: {
      react: `import React, { useState, useEffect } from 'react';

const CHARS = '!<>-_\\\\/[]{}—=+*^?#________ABCDEF0123456789';

export const TextScrambleEffect = ({ text = "DECRYPT MATRIX CODE" }) => {
  const [displayText, setDisplayText] = useState(text);

  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <div onClick={scramble} className="cursor-pointer font-mono text-cyan-400 font-bold">
      {displayText}
    </div>
  );
};`,
      tailwind: `<div class="font-mono text-cyan-400 font-bold cursor-pointer">DECRYPT CODE</div>`,
      vanilla: `<!-- Scramble Function in Vanilla JS -->`
    }
  },
  {
    id: 'spotlight-hover-grid',
    title: 'Radial Spotlight Hover Grid',
    description: 'Dynamic cursor spotlight illuminating adjacent cards with an ambient glow cone.',
    category: 'cursor',
    badge: 'TRENDING',
    tags: ['Spotlight', 'Mouse Tracking', 'Framer Motion', 'Grid'],
    dependencies: ['framer-motion', 'lucide-react'],
    customizable: {
      supportsGlowColor: true,
    },
    code: {
      react: `import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export const SpotlightHoverGrid = ({ glowColor = "#00f2fe" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div onMouseMove={handleMouseMove} className="relative p-6 group overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: useMotionTemplate\`
            radial-gradient(220px circle at \${mouseX}px \${mouseY}px, \${glowColor}25, transparent 80%)
          \`
        }}
      />
      <div className="grid grid-cols-2 gap-3 relative z-10">
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-xs">Card 1</div>
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-xs">Card 2</div>
      </div>
    </div>
  );
};`,
      tailwind: `<div class="relative group p-6">...</div>`,
      vanilla: `<!-- Spotlight CSS Grid -->`
    }
  },
  {
    id: 'floating-dock-nav',
    title: 'macOS Dynamic Floating Dock',
    description: 'Smooth magnetic dock menu with distance-based exponential scaling and spring animations.',
    category: 'navs',
    badge: 'PRO',
    tags: ['Navigation', 'Dock', 'Magnification', 'Framer Motion'],
    dependencies: ['framer-motion', 'lucide-react'],
    customizable: {
      supportsGlowColor: true,
    },
    code: {
      react: `import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, Compass, Bell, Settings } from 'lucide-react';

export const FloatingDock = () => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex items-end gap-3 px-4 py-3 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl"
    >
      {[Home, Compass, Bell, Settings].map((Icon, idx) => (
        <div key={idx} className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
      ))}
    </motion.div>
  );
};`,
      tailwind: `<nav class="flex items-center gap-3 p-3 bg-zinc-950/80 rounded-2xl border border-white/10">...</nav>`,
      vanilla: `<!-- Floating Dock -->`
    }
  },
  {
    id: 'audio-visualizer-wave',
    title: 'Reactive Audio Waveform',
    description: 'Dynamic frequency equalizer audio bars with rhythmic pulse and spring response.',
    category: 'shaders',
    badge: 'NEW',
    tags: ['Audio', 'Equalizer', 'Music', 'Visualizer'],
    dependencies: ['framer-motion', 'lucide-react'],
    customizable: {
      supportsGlowColor: true,
    },
    code: {
      react: `import React from 'react';
import { motion } from 'framer-motion';

export const AudioWaveform = ({ glowColor = "#00f2fe" }) => {
  return (
    <div className="flex items-center gap-1.5 h-16 px-6 py-3 rounded-2xl bg-zinc-950/80 border border-white/10">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full"
          style={{ backgroundColor: glowColor }}
          animate={{ height: ['8px', '32px', '12px', '40px', '8px'] }}
          transition={{ duration: 0.6 + (i % 3) * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};`,
      tailwind: `<div class="flex items-center gap-1">...</div>`,
      vanilla: `<!-- Audio Visualizer -->`
    }
  },
  {
    id: 'neon-radar-scan',
    title: 'Sci-Fi Quantum Radar Scan',
    description: 'Sweeping radar beam with blip signals, concentric orbit rings, and crosshairs.',
    category: '3d',
    badge: 'POPULAR',
    tags: ['Radar', 'Sci-Fi', 'HUD', 'Animation'],
    dependencies: ['framer-motion'],
    customizable: {
      supportsGlowColor: true,
    },
    code: {
      react: `import React from 'react';
import { motion } from 'framer-motion';

export const NeonRadarScan = ({ glowColor = "#00f2fe" }) => {
  return (
    <div className="relative w-44 h-44 rounded-full border border-white/10 bg-zinc-950 flex items-center justify-center overflow-hidden">
      <div className="absolute w-32 h-32 rounded-full border border-white/10 border-dashed" />
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
      >
        <div 
          className="w-1/2 h-1/2"
          style={{ background: \`conic-gradient(from 0deg at 100% 100%, \${glowColor}60 0deg, transparent 65deg)\` }}
        />
      </motion.div>
    </div>
  );
};`,
      tailwind: `<div class="w-44 h-44 rounded-full border border-white/10">...</div>`,
      vanilla: `<!-- Neon Radar -->`
    }
  }
];
