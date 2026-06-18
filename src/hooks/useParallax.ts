/**
 * hooks/useParallax.ts
 *
 * Tracks a section element's position relative to the viewport during
 * scroll events on the .snap-container. Uses requestAnimationFrame to
 * avoid layout thrashing and keep updates off the main thread budget.
 *
 * Returns a `yOffset` (pixels) that should be applied as a translateY
 * on the background image. The image must be scaled up (e.g. scale-[1.15])
 * to prevent edge exposure at the extremes of the offset range.
 *
 * GPU path:
 *   translate3d(0, ${yOffset}px, 0)  →  compositor thread only, 0 reflows.
 */

import { useEffect, useState, RefObject } from "react";

/**
 * @param ref   - Ref attached to the <section> element being observed.
 * @param speed - Parallax intensity. 0.15–0.25 is the luxury sweet spot.
 *                Higher values = more dramatic movement.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  speed: number = 0.2
): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Scope the scroll listener to the snap container — NOT window —
    // because window never fires scroll events on an overflow:hidden body.
    const container = document.querySelector<HTMLElement>(".snap-container");
    if (!container) return;

    let animationFrameId: number;

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      // Distance from the vertical centre of the viewport.
      // When rect.top === 0 the section is at the very top of the vp.
      // When rect.top === vh / 2 the section is centred.
      const centerOffset = (rect.top - window.innerHeight / 2) * speed;

      // Batch the state update inside rAF so React never schedules
      // more work than the screen can paint.
      animationFrameId = requestAnimationFrame(() => {
        setOffset(centerOffset);
      });
    };

    // Passive listener — never blocks compositor thread.
    container.addEventListener("scroll", handleScroll, { passive: true });

    // Seed the initial value before the user has scrolled at all.
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [ref, speed]);

  return offset;
}
