/**
 * components/ProjectSection.tsx
 *
 * A single 100vh snap section.
 *
 * NEW LAYOUT (PROMPT v2):
 * ─────────────────────────────────────────────────────────────────
 * The full-bleed 16:9 landscape image now fills the ENTIRE section
 * as a fixed background layer. The editorial content (left-side
 * typography, tilt card, floor plan SVG) floats above a gradient
 * overlay that keeps the dark luxury aesthetic.
 *
 * PARALLAX:
 * The background image is scaled to scale-[1.15] giving it breathing
 * room, then driven by useParallax via translate3d → pure GPU path.
 *
 * INTERACTIVITY:
 * - useIntersectionObserver: text entrance fade-up animations
 * - useParallax: scroll-linked image Y translation (rAF, passive)
 * - Mouse tilt: vanilla 3D card tilt on the stats card (no WebGL)
 */

"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useParallax } from "@/hooks/useParallax";
import FloorPlanSVG from "@/components/FloorPlanSVG";

/* ── Prop Types ─────────────────────────────────────────────── */

interface ProjectStat {
  label: string;
  value: string;
  suffix?: string;
}

export interface ProjectData {
  /** Sequential index shown as "01", "02" etc. */
  index: number;
  /** Overline category label */
  category: string;
  /** Large editorial headline */
  headline: string;
  /** Secondary display headline (line 2) */
  headlineAlt?: string;
  /** Short descriptive paragraph */
  description: string;
  /** A single key metric displayed in the tilt card */
  stat: ProjectStat;
  /** Location tag */
  location: string;
  /** Year of project */
  year: string;
  /** Path to the full-bleed background image (relative to /public) */
  imageSrc: string;
  /** Accessible alt text for the image */
  imageAlt: string;
  /** Unique HTML id for the section (for anchor links / nav) */
  id: string;
}

interface ProjectSectionProps {
  project: ProjectData;
  /** Index in the projects array — used for stagger timing etc. */
  sectionIndex: number;
}

/* ── Tilt Utility ────────────────────────────────────────────
   Calculates the 3D rotation values from mouse position
   relative to the card element's bounding box.
   Max tilt: ±8 degrees.
   ─────────────────────────────────────────────────────────── */
function getTiltTransform(
  e: React.MouseEvent<HTMLDivElement>,
  el: HTMLDivElement
): string {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateY = ((x - centerX) / centerX) * 8;
  const rotateX = ((centerY - y) / centerY) * 8;
  return `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}

/* ── Component ───────────────────────────────────────────────── */

export default function ProjectSection({
  project,
  sectionIndex,
}: ProjectSectionProps) {
  /* Ref for the section — drives both IntersectionObserver and useParallax */
  const sectionRef = useRef<HTMLElement>(null);

  /* Observe the whole section — triggers text fade-up animations */
  const { ref: intersectRef, isVisible } = useIntersectionObserver<HTMLElement>(
    {
      threshold: 0.25,
      keepObserving: false,
    }
  );

  /**
   * Merge both refs onto the <section> element.
   * intersectRef is a callback ref from useIntersectionObserver;
   * sectionRef is a plain useRef for useParallax's DOM measurements.
   */
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      // Apply the IntersectionObserver callback ref
      if (typeof intersectRef === "function") {
        intersectRef(node);
      } else if (intersectRef) {
        (intersectRef as React.MutableRefObject<HTMLElement | null>).current =
          node;
      }
      // Apply the plain ref for parallax
      (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [intersectRef]
  );

  /* Parallax offset — drives GPU translateY on the background image.
     Speed 0.15 → subtle luxury drift. Increase for more drama. */
  const yOffset = useParallax(sectionRef, 0.15);

  /* Ref for the tilt card DOM element */
  const tiltRef = useRef<HTMLDivElement>(null);

  /* Mouse move: apply 3D tilt */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltRef.current) return;
      tiltRef.current.style.transform = getTiltTransform(e, tiltRef.current);
    },
    []
  );

  /* Mouse leave: reset tilt */
  const handleMouseLeave = useCallback(() => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);

  /* Build the zero-padded index string "01", "02", ... */
  const indexStr = String(project.index).padStart(2, "0");

  return (
    <section
      ref={setRefs}
      id={project.id}
      className="snap-section"
      aria-label={`Project ${indexStr}: ${project.headline}`}
    >
      {/* ═══════════════════════════════════════════════════════
          LAYER 0 — Full-bleed Background Image (GPU Parallax)
          ══════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {/*
          scale-[1.15]: gives the image 15% extra physical space so
          translate3d can move it up/down without ever revealing a
          transparent edge. transform-gpu forces compositor-only paint.
        */}
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          fill
          sizes="100vw"
          quality={85}
          loading={sectionIndex === 0 ? "eager" : "lazy"}
          preload={sectionIndex === 0}
          className="object-cover object-center scale-[1.15] origin-center transform-gpu"
          style={{
            /* translate3d keeps the transform on the GPU compositor thread.
               No layout recalculation, no repaints — pure 60fps. */
            transform: `translate3d(0, ${yOffset}px, 0) scale(1.15)`,
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════
          LAYER 1 — Gradient Overlays
          Left-to-right dark gradient keeps editorial text legible.
          Bottom vignette grounds the composition.
          ══════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            linear-gradient(
              to right,
              rgba(10,10,10,0.96) 0%,
              rgba(10,10,10,0.85) 30%,
              rgba(10,10,10,0.45) 55%,
              rgba(10,10,10,0.10) 75%,
              transparent 100%
            ),
            linear-gradient(
              to top,
              rgba(10,10,10,0.6) 0%,
              transparent 40%
            )
          `,
        }}
      />

      {/* ═══════════════════════════════════════════════════════
          LAYER 2 — Editorial Content (Left Side, 50% wide)
          ══════════════════════════════════════════════════════ */}
      <div className="panel-left">

        {/* Project index + category overline */}
        <div
          className={`animate-hidden animate-delay-1 ${
            isVisible ? "animate-visible" : ""
          }`}
        >
          <span className="project-index">{indexStr} /</span>
          <span
            className="editorial-overline"
            style={{ marginLeft: "0.75rem" }}
          >
            {project.category}
          </span>
        </div>

        {/* Main editorial headline */}
        <h2
          className={`editorial-headline animate-hidden animate-delay-2 ${
            isVisible ? "animate-visible" : ""
          }`}
          style={{ marginTop: "1.25rem" }}
        >
          {project.headline}
          {project.headlineAlt && (
            <>
              <br />
              <span style={{ color: "var(--color-accent)", fontWeight: 300 }}>
                {project.headlineAlt}
              </span>
            </>
          )}
        </h2>

        {/* Amber rule divider */}
        <div
          className={`amber-rule animate-hidden animate-delay-3 ${
            isVisible ? "animate-visible" : ""
          }`}
        />

        {/* Description paragraph */}
        <p
          className={`editorial-subhead animate-hidden animate-delay-3 ${
            isVisible ? "animate-visible" : ""
          }`}
        >
          {project.description}
        </p>

        {/* Meta — location / year */}
        <p
          className={`editorial-body animate-hidden animate-delay-4 ${
            isVisible ? "animate-visible" : ""
          }`}
          style={{ marginTop: "1.2rem" }}
        >
          {project.location}&nbsp;·&nbsp; {project.year}
        </p>

        {/* ── Tilt Stats Card ──────────────────────────────── */}
        <div
          ref={tiltRef}
          className={`tilt-card animate-hidden animate-delay-5 ${
            isVisible ? "animate-visible" : ""
          }`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          aria-label={`${project.stat.label}: ${project.stat.value}`}
        >
          <div className="tilt-card-content">
            <p className="tilt-stat-label">{project.stat.label}</p>
            <p className="tilt-stat-value">
              {project.stat.value}
              {project.stat.suffix && (
                <span
                  style={{
                    fontSize: "1.1rem",
                    marginLeft: "0.25rem",
                    color: "var(--color-accent-dim)",
                  }}
                >
                  {project.stat.suffix}
                </span>
              )}
            </p>
            <p className="tilt-stat-sub">
              Hover to experience the depth
            </p>
          </div>
        </div>

        {/* ── Animated SVG Floor Plan ───────────────────────
            The FloorPlanSVG component handles its own
            IntersectionObserver internally.
            ─────────────────────────────────────────────── */}
        <FloorPlanSVG />
      </div>
    </section>
  );
}
