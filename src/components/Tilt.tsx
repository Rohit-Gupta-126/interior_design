"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface TiltProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  max?: number;
  speed?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  maxGlare?: number;
  as?: React.ElementType;
}

export default function Tilt({
  children,
  max = 10,
  speed = 500,
  perspective = 1000,
  scale = 1,
  glare = false,
  maxGlare = 0.15,
  as: Component = "div",
  style,
  ...props
}: TiltProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [canUseHoverPointer, setCanUseHoverPointer] = useState(false);

  useEffect(() => {
    const match = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const frameId = requestAnimationFrame(() => {
      setCanUseHoverPointer(match);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!canUseHoverPointer) return;

      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalize mouse coordinates (-0.5 to 0.5)
      const normX = x / rect.width - 0.5;
      const normY = y / rect.height - 0.5;

      // Calculate rotation angles
      const rotateX = -normY * max;
      const rotateY = normX * max;

      // Set CSS custom properties for glare tracking
      el.style.setProperty("--mouse-x", `${x}px`);
      el.style.setProperty("--mouse-y", `${y}px`);

      // Set transform inline
      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
      el.style.transition = "transform 0.1s ease";
    },
    [canUseHoverPointer, max, perspective, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (!canUseHoverPointer) return;

    const el = elementRef.current;
    if (!el) return;

    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    el.style.transition = `transform ${speed}ms ease`;
  }, [canUseHoverPointer, perspective, speed]);

  return (
    <Component
      ref={elementRef}
      onMouseMove={canUseHoverPointer ? handleMouseMove : undefined}
      onMouseLeave={canUseHoverPointer ? handleMouseLeave : undefined}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
      {...props}
    >
      {children}
      {canUseHoverPointer && glare && (
        <div
          className="glare-overlay"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 5,
            borderRadius: "inherit",
            background: `radial-gradient(circle 200px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 255, 255, ${maxGlare}) 0%, transparent 80%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </Component>
  );
}
