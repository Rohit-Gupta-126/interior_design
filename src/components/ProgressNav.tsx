/**
 * components/ProgressNav.tsx
 *
 * Fixed vertical navigation dots on the right edge of the screen.
 * Each dot corresponds to a snap section. The active dot grows
 * into a vertical line to indicate current position.
 *
 * Tracks scroll position by listening to the snap container's
 * scroll event and computing which section is most visible.
 */

"use client";

import { useState, useEffect, useCallback } from "react";

interface ProgressNavProps {
  sectionIds: string[];
}

export default function ProgressNav({ sectionIds }: ProgressNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const container = document.getElementById("snap-container");
    if (!container) return;

    /* Determine which section is currently most centered in view */
    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;
    const sectionIndex = Math.round(scrollTop / viewportHeight);
    setActiveIndex(Math.min(sectionIndex, sectionIds.length - 1));
  }, [sectionIds.length]);

  useEffect(() => {
    const container = document.getElementById("snap-container");
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = useCallback((index: number) => {
    const container = document.getElementById("snap-container");
    if (!container) return;
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: "smooth",
    });
  }, []);

  return (
    <nav
      className="progress-nav"
      aria-label="Section navigation"
    >
      {sectionIds.map((id, i) => (
        <button
          key={id}
          className={`progress-dot ${activeIndex === i ? "active" : ""}`}
          onClick={() => scrollToSection(i)}
          aria-label={`Navigate to section ${i + 1}`}
          aria-current={activeIndex === i ? "true" : undefined}
        />
      ))}
    </nav>
  );
}
