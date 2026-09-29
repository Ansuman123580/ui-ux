import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AWWWARDS_VIDEOS } from '../data/awwwardsVideos';

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

const LazyVideo: React.FC<{ src: string; className: string }> = ({ src, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: '240px 0px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full bg-zinc-900">
      {isNearViewport && (
        <video
          src={src}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          className={className}
        />
      )}
    </div>
  );
};

export const AnimationLibrary: React.FC<AnimationLibraryProps> = ({ onPreview }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [assetType, setAssetType] = useState<'video' | 'preview'>('video');
  const [itemsToShow, setItemsToShow] = useState(20);
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
    <section id="animation-library" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">Awwwards animation pack</p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Real videos for every section</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            {videoAssets.length} autoplaying MP4/WebM videos grouped by their intended use: hero, navigation, scroll, hover, 3D, WebGL and more.
          </p>
        </div>

        <div className="flex w-fit gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => { setAssetType('video'); setActiveCategory('all'); setItemsToShow(20); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-mono ${assetType === 'video' ? 'bg-cyan-400 text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
          >
            Videos ({videoAssets.length})
          </button>
          <button
            onClick={() => { setAssetType('preview'); setActiveCategory('all'); setItemsToShow(20); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-mono ${assetType === 'preview' ? 'bg-cyan-400 text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
          >
            WebP previews ({imageAssets.length})
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => { setActiveCategory(category); setItemsToShow(20); }}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-mono transition-colors ${
                activeCategory === category
                  ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-300'
                  : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {CATEGORY_LABELS[category]} {category === 'all' ? `(${currentAssets.length})` : `(${currentAssets.filter((asset) => asset.category === category).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visibleAssets.map((asset) => (
          <button
            key={asset.name}
            onClick={() => onPreview?.(asset.url)}
            className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 text-left transition-all hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-950/30"
          >
            <div className="aspect-[4/3] overflow-hidden bg-zinc-900">
              {asset.type === 'video' ? (
                <LazyVideo src={asset.url} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <img
                  src={asset.url}
                  alt={`${CATEGORY_LABELS[asset.category] ?? asset.category} animation ${asset.displayName}`}
                  loading="lazy"
                  className={`animation-preview h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${getMotionClass(asset.category)}`}
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2.5">
              <span className="truncate text-[11px] font-mono text-zinc-300">{asset.displayName.replace('-500.webp', '')}</span>
              <span className="shrink-0 text-[9px] uppercase tracking-wider text-zinc-500">{asset.category}</span>
            </div>
          </button>
        ))}
      </div>

      {visibleAssets.length < filteredAssets.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setItemsToShow((count) => count + 20)}
            className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-400/20"
          >
            Load 20 more ({filteredAssets.length - visibleAssets.length} remaining)
          </button>
        </div>
      )}
    </section>
  );
};
