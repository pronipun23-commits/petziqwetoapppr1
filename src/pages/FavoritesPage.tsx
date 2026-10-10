import { useState, useMemo } from 'react';
import { Heart, PawPrint, Sprout, BookOpen, Trash2, Search } from 'lucide-react';
import { useUserFavorites, type FavoriteType } from '@/hooks/useUserFavorites';
import { usePlantFavorites } from '@/hooks/usePlantFavorites';
import { useAuth } from '@/hooks/useAuth';
import { BREEDS } from '@/data/breeds';
import { CARE_GUIDES } from '@/data/care';
import { PLANT_MAP } from '@/data/plants';
import { EmptyState } from '@/components/ui';

interface FavoritesPageProps {
  onNavigate: (path: string) => void;
}

type Tab = 'all' | 'breed' | 'plant' | 'guide';

export function FavoritesPage({ onNavigate }: FavoritesPageProps) {
  const { session } = useAuth();
  const petFavs = useUserFavorites();
  const plantFavs = usePlantFavorites();
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');

  const allFavorites = useMemo(() => {
    const items: { type: FavoriteType; id: string; title: string; subtitle: string; image?: string; path: string }[] = [];
    petFavs.favorites
      .filter((f) => f.type === 'breed')
      .forEach((f) => {
        const breed = BREEDS.find((b) => b.id === f.id);
        if (breed) items.push({ type: 'breed', id: f.id, title: breed.name, subtitle: breed.tagline, image: breed.image, path: `/breed/${breed.id}` });
      });
    petFavs.favorites
      .filter((f) => f.type === 'guide')
      .forEach((f) => {
        const guide = CARE_GUIDES.find((g) => g.id === f.id);
        if (guide) items.push({ type: 'guide', id: f.id, title: guide.title, subtitle: guide.excerpt, path: `/care/${guide.id}` });
      });
    plantFavs.favorites.forEach((id) => {
      const plant = PLANT_MAP[id];
      if (plant) items.push({ type: 'plant', id, title: plant.name, subtitle: plant.scientificName, image: plant.image, path: `/plants/${id}` });
    });
    return items;
  }, [petFavs.favorites, plantFavs.favorites]);

  const filtered = useMemo(() => {
    let items = allFavorites;
    if (tab !== 'all') items = items.filter((i) => i.type === tab);
    if (query) {
      const q = query.toLowerCase();
      items = items.filter((i) => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));
    }
    return items;
  }, [allFavorites, tab, query]);

  if (!session) {
    return (
      <div className="container-px pt-10 pb-24 lg:pb-16">
        <EmptyState icon={<Heart className="h-7 w-7" />} title="Sign in to view favorites" description="Log in to see your saved pets, plants, and care guides in one place." />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: allFavorites.length },
    { id: 'breed', label: 'Pets', count: allFavorites.filter((i) => i.type === 'breed').length },
    { id: 'plant', label: 'Plants', count: allFavorites.filter((i) => i.type === 'plant').length },
    { id: 'guide', label: 'Guides', count: allFavorites.filter((i) => i.type === 'guide').length },
  ];

  const handleRemove = (type: FavoriteType, id: string) => {
    if (type === 'plant') plantFavs.toggleFavorite(id);
    else petFavs.toggleFavorite(type, id);
  };

  const typeIcon = (type: FavoriteType) => {
    if (type === 'breed') return PawPrint;
    if (type === 'plant') return Sprout;
    return BookOpen;
  };

  return (
    <div className="container-px pt-10 pb-24 lg:pb-16">
      <p className="eyebrow">Favorites</p>
      <h1 className="mt-2 section-title">Your saved collection</h1>
      <p className="mt-2 text-ink-300">All your favorite pets, plants, and care guides in one place.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t.id ? 'bg-brand-500 text-white' : 'border border-white/[0.08] text-ink-300 hover:text-ink-50'}`}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="mt-4 relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search favorites..." className="input-field pl-11" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Heart className="h-7 w-7" />} title="No favorites yet" description="Tap the heart icon on any pet, plant, or guide to save it here." />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const Icon = typeIcon(item.type);
            return (
              <div key={`${item.type}-${item.id}`} className="card-surface group overflow-hidden">
                <button onClick={() => onNavigate(item.path)} className="block w-full text-left">
                  {item.image ? (
                    <div className="aspect-[4/3] overflow-hidden bg-ink-900">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-ink-900 text-ink-400">
                      <Icon className="h-10 w-10" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-brand-400" />
                      <span className="text-xs uppercase tracking-wide text-ink-400">{item.type}</span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-semibold text-ink-50">{item.title}</h3>
                    <p className="mt-0.5 line-clamp-1 text-sm text-ink-400">{item.subtitle}</p>
                  </div>
                </button>
                <div className="border-t border-white/[0.10] px-4 py-2.5">
                  <button onClick={() => handleRemove(item.type, item.id)} className="flex items-center gap-1.5 text-xs text-ink-400 transition hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
