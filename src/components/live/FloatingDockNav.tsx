import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, Compass, MessageSquare, Bell, Settings, Flame } from 'lucide-react';

interface Props {
  glowColor?: string;
}

const icons = [
  { icon: Home, label: 'Home' },
  { icon: Compass, label: 'Explore' },
  { icon: Flame, label: 'Trending' },
  { icon: Bell, label: 'Alerts' },
  { icon: MessageSquare, label: 'Feedback' },
  { icon: Settings, label: 'Config' },
];

function DockItem({ icon: Icon, mouseX, glowColor }: { icon: any, mouseX: any, glowColor: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-120, 0, 120], [36, 56, 36]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      className="rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center cursor-pointer hover:border-cyan-500/50 transition-colors shadow-lg relative group"
    >
      <Icon className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
      <span 
        style={{ backgroundColor: glowColor }}
        className="absolute -bottom-1 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
      />
    </motion.div>
  );
}

export const FloatingDockNav: React.FC<Props> = ({ glowColor = '#00f2fe' }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="flex items-center justify-center p-6 w-full h-full">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-2.5 px-4 py-3 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl"
      >
        {icons.map((item, i) => (
          <DockItem key={i} icon={item.icon} mouseX={mouseX} glowColor={glowColor} />
        ))}
      </motion.div>
    </div>
  );
};
