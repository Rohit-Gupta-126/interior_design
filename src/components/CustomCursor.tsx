"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseCoords = useRef({ mx: 0, my: 0 });
  const ringCoords = useRef({ rx: 0, ry: 0 });

  useEffect(() => {
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

      // Position the main cursor wrapper directly on mouse
      cur.style.left = `${mx}px`;
      cur.style.top = `${my}px`;

      // Smooth interpolation for the trailing ring
      const newRx = rx + (mx - rx) * 0.1;
      const newRy = ry + (my - ry) * 0.1;
      ringCoords.current.rx = newRx;
      ringCoords.current.ry = newRy;

      // Position the ring relative to the mouse wrapper
      ring.style.left = `${newRx - mx}px`;
      ring.style.top = `${newRy - my}px`;

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    // Listen for hoverable elements to apply active class
    const addHoverClass = () => document.body.classList.add("hovering");
    const removeHoverClass = () => document.body.classList.remove("hovering");

    const setupHoverListeners = () => {
      const hoverables = document.querySelectorAll(
        "a, button, .hotspot, .sv-card, .stat-card, .a-text-card, input, textarea"
      );
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", addHoverClass);
        el.addEventListener("mouseleave", removeHoverClass);
      });
    };

    // Run setup initially
    setupHoverListeners();

    // Create an observer to re-apply hover events on dynamically rendered DOM elements
    const observer = new MutationObserver(() => {
      setupHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("hovering");
      observer.disconnect();
    };
  }, []);

  return (
    <div id="cur" ref={curRef}>
      <div id="cur-dot" />
      <div id="cur-ring" ref={ringRef} />
    </div>
  );
}
