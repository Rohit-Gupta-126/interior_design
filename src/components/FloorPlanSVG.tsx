/**
 * components/FloorPlanSVG.tsx
 *
 * An abstract architectural floor plan outline rendered as an SVG.
 * The path uses stroke-dasharray / stroke-dashoffset so it can be
 * "drawn" via a CSS animation. The IntersectionObserver hook triggers
 * the .draw-active class, which fires the keyframe animation.
 */

"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface FloorPlanSVGProps {
  /** Extra CSS class names for positioning overrides */
  className?: string;
}

export default function FloorPlanSVG({ className = "" }: FloorPlanSVGProps) {
  // Observe the SVG itself — when 30% visible, trigger the draw animation
  const { ref, isVisible } = useIntersectionObserver<SVGSVGElement>({
    threshold: 0.3,
    keepObserving: false,
  });

  return (
    <svg
      ref={ref}
      /* Apply draw-active class when intersecting to fire CSS animation */
      className={`floor-plan-svg ${isVisible ? "draw-active" : ""} ${className}`}
      viewBox="0 0 220 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/*
        Abstract floor plan: main room rectangle with interior walls,
        a doorway cut, window indicators, and a small detail room.
        All paths share the .floor-path class for the stroke animation.
      */}

      {/* Outer perimeter */}
      <path
        className="floor-path"
        d="M 10 10 L 210 10 L 210 150 L 10 150 Z"
      />

      {/* Interior dividing wall (horizontal) */}
      <path
        className="floor-path"
        d="M 10 85 L 130 85"
      />

      {/* Interior dividing wall (vertical) */}
      <path
        className="floor-path"
        d="M 130 10 L 130 85"
      />

      {/* Doorway arc in main room (bottom-left space) */}
      <path
        className="floor-path"
        d="M 55 85 L 55 105"
      />
      <path
        className="floor-path"
        d="M 55 105 Q 75 105 75 85"
        style={{ strokeDasharray: 800, strokeDashoffset: 800 }}
      />

      {/* Doorway in vertical wall */}
      <path
        className="floor-path"
        d="M 130 45 L 130 65"
      />

      {/* Window indicators on outer walls (short double lines) */}
      {/* Top wall window */}
      <path className="floor-path" d="M 60 10 L 60 4" />
      <path className="floor-path" d="M 100 10 L 100 4" />
      <path className="floor-path" d="M 60 4 L 100 4" />

      {/* Right wall window */}
      <path className="floor-path" d="M 210 40 L 216 40" />
      <path className="floor-path" d="M 210 70 L 216 70" />
      <path className="floor-path" d="M 216 40 L 216 70" />

      {/* Bottom wall window */}
      <path className="floor-path" d="M 145 150 L 145 156" />
      <path className="floor-path" d="M 185 150 L 185 156" />
      <path className="floor-path" d="M 145 156 L 185 156" />

      {/* Small bathroom / utility room in top-right quadrant */}
      <path
        className="floor-path"
        d="M 160 10 L 160 55 L 210 55"
      />

      {/* Bathtub symbol */}
      <rect
        className="floor-path"
        x="165"
        y="15"
        width="38"
        height="22"
        rx="8"
      />

      {/* Compass rose — tiny decorative marker */}
      <line className="floor-path" x1="15" y1="140" x2="15" y2="130" />
      <line className="floor-path" x1="11" y1="134" x2="19" y2="134" />
      <text
        x="16"
        y="129"
        fontSize="5"
        fill="#d4af37"
        fontFamily="system-ui"
        opacity="0.5"
      >
        N
      </text>

      {/* Scale bar */}
      <line className="floor-path" x1="155" y1="143" x2="205" y2="143" />
      <line className="floor-path" x1="155" y1="141" x2="155" y2="145" />
      <line className="floor-path" x1="205" y1="141" x2="205" y2="145" />
    </svg>
  );
}
