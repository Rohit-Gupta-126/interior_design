"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseCoords = useRef({ mx: 0, my: 0 });
  const ringCoords = useRef({ rx: 0, ry: 0 });

  useEffect(() => {
    const canUseHoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canUseHoverPointer) {
      return;
    }

    const cur = curRef.current;
    const ring = ringRef.current;
    if (!cur || !ring) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseCoords.current.mx = e.clientX;
      mouseCoords.current.my = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const updateCursor = () => {
      const { mx, my } = mouseCoords.current;
      const { rx, ry } = ringCoords.current;

      // Position the main cursor wrapper directly on mouse coordinates using transform
      cur.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

      // Smooth interpolation for the trailing ring
      const newRx = rx + (mx - rx) * 0.1;
      const newRy = ry + (my - ry) * 0.1;
      ringCoords.current.rx = newRx;
      ringCoords.current.ry = newRy;

      // Position the ring relative to the mouse wrapper using transform
      ring.style.transform = `translate3d(${newRx - mx}px, ${newRy - my}px, 0) translate(-50%, -50%)`;

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isHoverable = target.closest("a, button, .hotspot, .sv-card, .stat-card, .a-text-card, input, textarea");
      if (isHoverable) {
        document.body.classList.add("hovering");
      } else {
        document.body.classList.remove("hovering");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("hovering");
    };
  }, []);

  return (
    <div id="cur" ref={curRef}>
      <div id="cur-dot" />
      <div id="cur-ring" ref={ringRef} />
    </div>
  );
}
