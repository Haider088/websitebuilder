import { useEffect, useRef, useState } from 'react';
import { AnimationType } from '../types';

interface UseScrollAnimationOptions {
  enabled?: boolean;
  threshold?: number; // 0 to 1, percentage of element visibility
  rootMargin?: string;
  once?: boolean; // Only animate once
}

export function useScrollAnimation(
  animationType: AnimationType = 'none',
  options: UseScrollAnimationOptions = {}
) {
  const {
    enabled = true,
    threshold = 0.1,
    rootMargin = '0px',
    once = true,
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!enabled || animationType === 'none' || !elementRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              setHasAnimated(true);
            }
          } else if (!once && !hasAnimated) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [enabled, animationType, threshold, rootMargin, once, hasAnimated]);

  return {
    ref: elementRef,
    isVisible: isVisible || hasAnimated,
  };
}
