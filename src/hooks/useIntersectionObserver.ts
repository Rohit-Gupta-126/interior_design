/**
 * hooks/useIntersectionObserver.ts
 *
 * Custom hook that observes a DOM element's intersection with the viewport.
 * Returns a ref to attach to the target element and a boolean `isVisible`.
 *
 * Once visible, the observer disconnects (one-shot) so the animation
 * triggers only once — ideal for entrance animations.
 */

"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  /** Fraction of element that must be visible to trigger (0–1). Default 0.2 */
  threshold?: number;
  /** Root margin passed to IntersectionObserver. Default '0px' */
  rootMargin?: string;
  /** If true, keep observing after first intersection. Default false. */
  keepObserving?: boolean;
}

interface UseIntersectionObserverReturn<T extends Element> {
  /** Attach this ref to the element you want to observe */
  ref: React.RefObject<T | null>;
  /** True once the element has intersected the viewport */
  isVisible: boolean;
}

export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> {
  const { threshold = 0.2, rootMargin = "0px", keepObserving = false } = options;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after first intersection unless keepObserving is set
          if (!keepObserving) {
            observer.disconnect();
          }
        } else if (keepObserving) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Cleanup: unobserve when component unmounts
    return () => observer.disconnect();
  }, [threshold, rootMargin, keepObserving]);

  return { ref, isVisible };
}
