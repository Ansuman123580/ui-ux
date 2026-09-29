import React, { useState, useEffect, useRef } from 'react';
import { UIComponent } from '../types';
import { Search, X, Code, ExternalLink } from 'lucide-react';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  components: UIComponent[];
  onSelectComponent: (component: UIComponent) => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  components,
  onSelectComponent,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = components.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-black/80 backdrop-blur-md"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] gap-3">
          <Search className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a component name, category or tag..."
            className="w-full bg-transparent text-white text-sm placeholder:text-zinc-500 focus:outline-none"
          />
          <button 
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 font-mono">
              No matching components found for "{query}"
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectComponent(item);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.06] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-cyan-400 group-hover:border-cyan-500/30">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold group-hover:text-cyan-300">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {item.category} • {item.dependencies.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                    {item.badge}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 bg-zinc-900/60 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Search 50+ animated components</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
