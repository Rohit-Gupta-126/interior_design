/**
 * components/ProjectSection.tsx
 *
 * A single 100vh cinematic snap section.
 *
 * LAYERING HIERARCHY (per PROMPT v3):
 * ─────────────────────────────────────────────────────────────────
 * Parent:  className="relative w-full h-screen overflow-hidden snap-section"
 * Layer 1: Image   — absolute inset-0 w-full h-full -z-20   (back)
 * Layer 2: Gradient — absolute inset-0 bg-gradient-to-r … -z-10
 * Layer 3: Content — relative z-10 flex flex-col justify-center h-full w-[50vw] px-12
 *
 * PARALLAX:
 * Image is scale-[1.15] and driven by useParallax via translate3d — pure GPU.
 *
 * INTERACTIVITY:
 * - IntersectionObserver (inline useEffect): text entrance fade-up
 * - useParallax: rAF-based scroll-linked image Y offset
 * - Mouse tilt: vanilla 3D card tilt on the stats card (no WebGL)
 */

"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
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
  /** Path to the full-bleed background image (relative to /public, e.g. "/hero_living_room.png") */
  imageSrc: string;
  /** Accessible alt text for the image */
  imageAlt: string;
  /** Unique HTML id for the section (for anchor links / nav) */
  id: string;
}

interface ProjectSectionProps {
  project: ProjectData;
  /** Index in the projects array — used for stagger timing and eager-load logic */
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
  /* Single ref — drives both useParallax and the IntersectionObserver */
  const sectionRef = useRef<HTMLElement>(null);

  /* Visibility state drives the entrance fade-up stagger animations.
     Inlined via useEffect (not from a hook) so React Compiler never
     sees a cross-hook ref mutation. */
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // one-shot: fire once, never re-run
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Parallax offset applied to the background image via translate3d.
     Speed 0.15 is the luxury sweet spot — subtle, not jarring. */
  const yOffset = useParallax(sectionRef, 0.15);

  /* Ref for the tilt card DOM element */
  const tiltRef = useRef<HTMLDivElement>(null);

  /* Mouse move: calculate and apply 3D tilt to stats card */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltRef.current) return;
      tiltRef.current.style.transform = getTiltTransform(e, tiltRef.current);
    },
    []
  );

  /* Mouse leave: reset tilt smoothly */
  const handleMouseLeave = useCallback(() => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);

  const indexStr = String(project.index).padStart(2, "0");

  return (
    /* ── PARENT CONTAINER ────────────────────────────────────────
       Exactly as specified: relative, full viewport, overflow hidden,
       plus snap-section for the CSS scroll-snap alignment.
       ────────────────────────────────────────────────────────── */
    <section
      ref={sectionRef}
      id={project.id}
      className="relative w-full h-screen overflow-hidden snap-section"
      aria-label={`Project ${indexStr}: ${project.headline}`}
    >
      {/* ── LAYER 1: Full-bleed Background Image ─────────────────
          Pinned to the very back with -z-20.
          scale-[1.15] gives parallax room to translate without edge bleed.
          transform-gpu promotes to compositor — no layout/paint cost.
          ──────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden">
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          fill
          sizes="100vw"
          quality={85}
          /*
           * Next.js 16: use `loading` + `preload` (not `priority`).
           * First section gets eager load + preload for LCP optimisation.
           */
          loading={sectionIndex === 0 ? "eager" : "lazy"}
          preload={sectionIndex === 0}
          className="object-cover object-center transform-gpu"
          style={{
            /* translate3d: stays on the GPU compositor thread entirely.
               scale(1.15) is duplicated here so it composes with the
               translateY without the className scale being overridden. */
            transform: `translate3d(0, ${yOffset}px, 0) scale(1.15)`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* ── LAYER 2: Gradient Overlay ─────────────────────────────
          Left-heavy dark gradient keeps editorial text legible
          against any image content. -z-10 sits above the image.
          ──────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent -z-10" />

      {/* ── LAYER 3: Editorial Content ────────────────────────────
          Relative z-10 sits above both image and gradient overlay.
          w-[50vw]: content occupies exactly the left half of the viewport.
          ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-center h-full w-[50vw] px-12">

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
            <p className="tilt-stat-sub">Hover to experience the depth</p>
          </div>
        </div>

        {/* ── Animated SVG Floor Plan ───────────────────────
            Positioned absolutely at the bottom of this column.
            FloorPlanSVG manages its own IntersectionObserver.
            ─────────────────────────────────────────────── */}
        <FloorPlanSVG />
      </div>
    </section>
  );
}
