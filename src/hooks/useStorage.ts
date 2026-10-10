import { useCallback, useEffect, useState } from 'react';

const FAVORITES_KEY = 'petziq:favorites';
const RECENT_KEY = 'petziq:recent';

function readArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeArray(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => readArray(FAVORITES_KEY));

  useEffect(() => {
    writeArray(FAVORITES_KEY, favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev],
    );
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  return { favorites, isFavorite, toggleFavorite, clearFavorites };
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<string[]>(() => readArray(RECENT_KEY));

  useEffect(() => {
    writeArray(RECENT_KEY, recent);
  }, [recent]);

  const addRecent = useCallback((id: string) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)];
      return next.slice(0, 12);
    });
  }, []);

  const clearRecent = useCallback(() => setRecent([]), []);

  return { recent, addRecent, clearRecent };
}
