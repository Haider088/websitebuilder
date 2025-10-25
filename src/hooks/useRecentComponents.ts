import { useState, useEffect } from 'react';

const RECENT_COMPONENTS_KEY = 'restaurant-builder-recent-components';
const MAX_RECENT = 6;

export function useRecentComponents() {
  const [recentComponentIds, setRecentComponentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_COMPONENTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_COMPONENTS_KEY, JSON.stringify(recentComponentIds));
    } catch (error) {
      console.error('Failed to save recent components:', error);
    }
  }, [recentComponentIds]);

  const addRecentComponent = (componentId: string) => {
    setRecentComponentIds((prev) => {
      const filtered = prev.filter((id) => id !== componentId);
      const updated = [componentId, ...filtered].slice(0, MAX_RECENT);
      return updated;
    });
  };

  const clearRecent = () => {
    setRecentComponentIds([]);
  };

  return {
    recentComponentIds,
    addRecentComponent,
    clearRecent,
  };
}
