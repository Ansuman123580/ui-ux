import React, { useMemo, useState, useRef, useEffect } from 'react';
import { AWWWARDS_VIDEOS } from '../data/awwwardsVideos';
import { Sparkles, Film, Image as ImageIcon, Maximize2, X } from 'lucide-react';

const assetModules = import.meta.glob('../assets/animaster/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All animations',
  hero: 'Hero',
  menu: 'Menu / Nav',
  scroll: 'Scroll',
  hover: 'Hover',
  mouse: 'Mouse',
  '3d': '3D',
  webgl: 'WebGL',
  physic: 'Physics',
  grid: 'Grid',
  sliders: 'Sliders',
  text: 'Text',
  svg: 'SVG',
  bg: 'Backgrounds',
  pegetr: 'Page transitions',
};

const getAssetName = (path: string) => path.split('/').pop() ?? path;

const cleanDisplayName = (name: string) => {
  const cleaned = name
    .replace(/^Awwwards_Pack-[^_]+_Awwwards_Pack_/i, '')
    .replace(/^Awwwards_Pack-[^_]+_/i, '')
    .replace(/\.mp4$/i, '')
    .replace(/-500\.webp$/i, '')
    .replace(/_/g, ' ')
    .trim();
  return cleaned || name;
};

const getCategory = (name: string) => {
  const match = name.match(/(hero|menu|scroll|hover|mouse|3d|webgl|physic|grid|sliders|text|svg|bg|pegetr|pagetr)-/i);
  return match?.[1].toLowerCase() ?? name.match(/^[a-z0-9]+/)?.[0] ?? 'other';
};

const getMotionClass = (category: string) => {
  if (category === '3d' || category === 'webgl') return 'preview-drift';
  if (category === 'scroll' || category === 'mouse' || category === 'hover') return 'preview-pan';
  if (category === 'physic' || category === 'bg' || category === 'svg') return 'preview-breathe';
  return 'preview-kenburns';
};

const imageAssets = Object.entries(assetModules)
  .map(([path, url]) => {
    const name = getAssetName(path);
    return { name, displayName: name, url, category: getCategory(name), type: 'preview' as const };
  })
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

const videoAssets = AWWWARDS_VIDEOS
  .map((url) => {
    const name = getAssetName(url);
    const displayName = name.split('__').pop() ?? name;
    return { name, displayName, url, category: getCategory(name), type: 'video' as const };
  })
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

interface AnimationLibraryProps {
  onPreview?: (url: string) => void;
}

const LiveVideoCard: React.FC<{ src: string; className: string }> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay when visible on screen, pause when out of viewport for max 120 FPS performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    />
  );
};

export const AnimationLibrary: React.FC<AnimationLibraryProps> = ({ onPreview }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [assetType, setAssetType] = useState<'video' | 'preview'>('video');
  const [itemsToShow, setItemsToShow] = useState(24);
  const [activeModalVideo, setActiveModalVideo] = useState<string | null>(null);

  const currentAssets = assetType === 'video' ? videoAssets : imageAssets;

  const filteredAssets = useMemo(
    () => activeCategory === 'all'
      ? currentAssets
      : currentAssets.filter((asset) => asset.category === activeCategory),
    [activeCategory, currentAssets]
  );
  const visibleAssets = filteredAssets.slice(0, itemsToShow);

  const categories = Object.keys(CATEGORY_LABELS).filter(
    (category) => category === 'all' || currentAssets.some((asset) => asset.category === category)
  );

  return (
    <section id="animation-library" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Awwwards Motion Archive</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Production-Grade Motion Patterns
            </h2>
            <p className="mt-2.5 max-w-2xl text-sm text-zinc-400 leading-relaxed">
              {videoAssets.length} live interactive motion references. All videos loop smoothly with intelligent viewport optimization.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-zinc-950/80 p-1.5 backdrop-blur-xl">
            <button
              onClick={() => { setAssetType('video'); setActiveCategory('all'); setItemsToShow(24); }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono transition-all ${
                assetType === 'video'
                  ? 'bg-cyan-400 text-zinc-950 font-bold shadow-lg shadow-cyan-400/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Live Videos ({videoAssets.length})</span>
            </button>
            <button
              onClick={() => { setAssetType('preview'); setActiveCategory('all'); setItemsToShow(24); }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono transition-all ${
                assetType === 'preview'
                  ? 'bg-cyan-400 text-zinc-950 font-bold shadow-lg shadow-cyan-400/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>WebP Previews ({imageAssets.length})</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((category) => {
            const count = category === 'all'
              ? currentAssets.length
              : currentAssets.filter((a) => a.category === category).length;
            return (
              <button
                key={category}
                onClick={() => { setActiveCategory(category); setItemsToShow(24); }}
                className={`whitespace-nowrap rounded-xl border px-3.5 py-1.5 text-xs font-mono transition-all ${
                  activeCategory === category
                    ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-300 shadow-md shadow-cyan-500/10 font-bold'
                    : 'border-white/5 bg-zinc-900/60 text-zinc-400 hover:border-white/15 hover:text-zinc-200'
                }`}
              >
                {CATEGORY_LABELS[category] || category} <span className="opacity-60 text-[11px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {visibleAssets.map((asset) => {
          const formattedTitle = cleanDisplayName(asset.displayName);
          return (
            <div
              key={asset.name}
              onClick={() => {
                if (asset.type === 'video') {
                  setActiveModalVideo(asset.url);
                }
                onPreview?.(asset.url);
              }}
              className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/80 text-left transition-all hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden bg-zinc-950 relative">
                {asset.type === 'video' ? (
                  <LiveVideoCard
                    src={asset.url}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={asset.url}
                    alt={`${CATEGORY_LABELS[asset.category] ?? asset.category} animation ${asset.displayName}`}
                    loading="lazy"
                    className={`animation-preview h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${getMotionClass(asset.category)}`}
                  />
                )}

                {/* Subtle hover overlay with expand icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                    <Maximize2 className="w-4 h-4 text-cyan-300" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-1.5 px-3 py-2.5 border-t border-white/[0.04] bg-zinc-950/90">
                <span className="truncate text-[11px] font-mono text-zinc-300 group-hover:text-white transition-colors" title={formattedTitle}>
                  {formattedTitle}
                </span>
                <span className="shrink-0 text-[9px] uppercase tracking-wider text-cyan-400/90 font-mono bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">
                  {asset.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {visibleAssets.length < filteredAssets.length && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setItemsToShow((count) => count + 24)}
            className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-xs font-mono font-semibold text-cyan-300 transition-all hover:bg-cyan-400/20 active:scale-95 shadow-lg shadow-cyan-400/10"
          >
            Load 24 more ({filteredAssets.length - visibleAssets.length} remaining)
          </button>
        </div>
      )}

      {/* Video Modal Preview on Click */}
      {activeModalVideo && (
        <div 
          onClick={() => setActiveModalVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl overflow-hidden border border-white/20 bg-zinc-950 shadow-2xl shadow-cyan-500/20"
          >
            <video
              src={activeModalVideo}
              controls
              autoPlay
              loop
              playsInline
              className="w-full h-auto max-h-[75vh] object-contain bg-black"
            />
            <div className="p-4 bg-zinc-900/95 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-200 truncate">{cleanDisplayName(getAssetName(activeModalVideo))}</span>
              <button
                onClick={() => setActiveModalVideo(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
