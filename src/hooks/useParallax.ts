import { useEffect, useRef, useState } from 'react';

export function useParallax(speed: number = 0.5, enabled: boolean = false) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!enabled || !elementRef.current) {
      return;
    }

    const handleScroll = () => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;

      // Calculate parallax offset
      if (rect.top < windowHeight && rect.bottom > 0) {
        const distance = scrolled - elementTop + windowHeight;
        const parallaxOffset = distance * speed;
        setOffset(parallaxOffset);
      }
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, enabled]);

  return {
    ref: elementRef,
    offset,
  };
}
