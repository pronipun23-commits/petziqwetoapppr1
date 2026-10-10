import { useEffect, useRef } from 'react';
import { Search, X, ArrowRight, PawPrint, Sprout, BookOpen, Layers } from 'lucide-react';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';

export function SearchBar({
  onNavigate,
  autoFocus,
}: {
  onNavigate: (path: string) => void;
  autoFocus?: boolean;
}) {
  const { query, setQuery, results, open, setOpen } = useGlobalSearch();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [setOpen]);

  const go = (path: string) => {
    onNavigate(path);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) go(results[0].path);
            if (e.key === 'Escape') {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder="Search pets, plants, guides..."
          className="input-field pl-11 pr-10"
          aria-label="Search"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-400 hover:text-ink-50 hover:bg-white/[0.06] transition"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && query && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-850/95 shadow-soft backdrop-blur-xl animate-scale-in">
          {results.length === 0 ? (
            <div className="px-4 py-7 text-center">
              <p className="text-sm font-medium text-ink-200">No results found</p>
              <p className="mt-1 text-xs text-ink-400">
                Try searching by pet breed, plant name, or care guide.
              </p>
            </div>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-2">
              {results.map((r) => {
                const typeIcon =
                  r.type === 'plant' ? Sprout :
                  r.type === 'guide' ? BookOpen :
                  r.type === 'category' ? Layers : PawPrint;
                const TypeIcon = typeIcon;
                return (
                <li key={`${r.type}-${r.id}`}>
                  <button
                    onClick={() => go(r.path)}
                    className="group flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.06]"
                  >
                    {r.image ? (
                      <img
                        src={r.image}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover ring-1 ring-ink-700/10"
                        loading="lazy"
                      />
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.05] text-ink-400 ring-1 ring-ink-700/10">
                        <TypeIcon className="h-5 w-5" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-50">
                        {r.title}
                      </div>
                      <div className="truncate text-xs text-ink-400">
                        {r.subtitle}
                      </div>
                    </div>
                    <span className="chip border-brand-400/20 bg-brand-500/10 text-brand-500 capitalize">
                      {r.type}
                    </span>
                    <ArrowRight className="h-4 w-4 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-brand-300" />
                  </button>
                </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
