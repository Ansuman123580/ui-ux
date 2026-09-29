import React, { useState, useEffect } from 'react';
import { CategoryType, UIComponent } from './types';
import { COMPONENTS_DATA } from './data/componentsData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ComponentCard } from './components/ComponentCard';
import { CodeModal } from './components/CodeModal';
import { CommandMenu } from './components/CommandMenu';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AnimationLibrary } from './components/AnimationLibrary';

export const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedComponent, setSelectedComponent] = useState<UIComponent | null>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kinetic_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredComponents = COMPONENTS_DATA.filter((item) => {
    if (showFavoritesOnly && !favorites.includes(item.id)) {
      return false;
    }
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 relative selection:bg-cyan-500/20 selection:text-cyan-300">
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.08] pointer-events-none" />

      <Navbar
        onOpenCommand={() => setIsCommandOpen(true)}
        onScrollTo={scrollToSection}
        favoritesCount={favorites.length}
      />

      <Hero onExplore={() => scrollToSection('components')} />

      <AnimationLibrary />

      <main id="components" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setShowFavoritesOnly(false);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
          totalComponents={filteredComponents.length}
        />

        {filteredComponents.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-zinc-950/40 border border-white/5 my-8">
            <p className="text-zinc-400 text-sm font-mono">No interactive components match your filters.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setShowFavoritesOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono hover:bg-cyan-500/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                isFavorite={favorites.includes(component.id)}
                onToggleFavorite={toggleFavorite}
                onSelectComponent={(c) => setSelectedComponent(c)}
              />
            ))}
          </div>
        )}
      </main>

      <PricingSection />
      <FaqSection />
      <Footer />

      <CommandMenu
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        components={COMPONENTS_DATA}
        onSelectComponent={(c) => setSelectedComponent(c)}
      />

      <CodeModal
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />
    </div>
  );
};

export default App;
