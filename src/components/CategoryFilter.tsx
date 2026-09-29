import React from 'react';
import { CategoryType } from '../types';
import { 
  Sparkles, 
  Layers, 
  Type, 
  MousePointer, 
  Compass, 
  Radio, 
  Heart,
  Search
} from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  totalComponents: number;
}

const CATEGORIES: { id: CategoryType; label: string; icon: any }[] = [
  { id: 'all', label: 'All Components', icon: Sparkles },
  { id: 'buttons', label: 'Buttons', icon: Sparkles },
  { id: 'cards', label: 'Cards & Bento', icon: Layers },
  { id: 'text', label: 'Text Animations', icon: Type },
  { id: 'cursor', label: 'Cursor & Spotlight', icon: MousePointer },
  { id: 'navs', label: 'Navbars & Docks', icon: Compass },
  { id: 'shaders', label: 'Audio & Shaders', icon: Radio },
  { id: '3d', label: '3D & Radar', icon: Radio },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  showFavoritesOnly,
  onToggleFavorites,
  totalComponents,
}) => {
  return (
    <div className="w-full space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by name, tag, or tech..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={onToggleFavorites}
            className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
              showFavoritesOnly 
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300' 
                : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>Saved Favorites</span>
          </button>

          <span className="text-xs text-zinc-500 font-mono">
            Showing <strong className="text-cyan-400">{totalComponents}</strong> items
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id && !showFavoritesOnly;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10'
                  : 'bg-zinc-950/60 border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
