import { useEffect, useRef } from 'react';

export function useAutoSave<T>(
  data: T,
  key: string,
  delay: number = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log('Auto-saved to localStorage');
      } catch (error) {
        console.error('Failed to auto-save:', error);
      }
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, delay]);
}
