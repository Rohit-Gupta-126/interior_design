/**
 * components/ProjectSection.tsx
 *
 * A single 100vh snap section with a strict 50/50 split layout.
 * LEFT:  Sticky editorial panel — project details, tilt card, SVG floor plan.
 * RIGHT: Full-bleed, edge-to-edge photography panel.
 *
 * Entrance animations are driven by useIntersectionObserver.
 * 3D parallax tilt on the stats card is implemented via a custom
 * mousemove handler (no external library, no WebGL).
 */

"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
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
  /** Path to the right-panel image (relative to /public) */
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
  /* Observe the whole section — triggers text fade-up animations */
  const { ref: sectionRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.25,
    keepObserving: false,
  });

  /* Observe the right panel — triggers image fade-in */
  const { ref: imgRef, isVisible: imgVisible } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      keepObserving: false,
    });

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
      ref={sectionRef}
      id={project.id}
      className="snap-section"
      aria-label={`Project ${indexStr}: ${project.headline}`}
    >
      {/* ═══════════════════════════════════
          LEFT PANEL — Editorial Content
          ═══════════════════════════════════ */}
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
          {project.location} &nbsp;·&nbsp; {project.year}
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
            Positioned absolutely at the bottom of the panel.
            The FloorPlanSVG component handles its own
            IntersectionObserver internally.
            ─────────────────────────────────────────────── */}
        <FloorPlanSVG />
      </div>

      {/* ═══════════════════════════════════
          RIGHT PANEL — Full-bleed Photo
          ═══════════════════════════════════ */}
      <div
        ref={imgRef}
        className="panel-right"
        aria-hidden="true"
      >
        {/* Shimmer placeholder while image loads */}
        <div
          className={`img-shimmer ${imgVisible ? "loaded" : ""}`}
        />

        {/* Gradient overlay from right edge to allow left text bleed */}
        <div className="img-overlay" />

        {/*
          Next.js <Image> with fill prop:
          - Parent must be position:relative (set in .panel-right CSS)
          - object-fit:cover ensures full bleed without distortion
          - sizes hints 50vw since this panel is half the viewport
          - loading="eager" for the HERO (section 0), lazy for others
          - preload={true} only for the first image (LCP element)
        */}
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="50vw"
          quality={85}
          loading={sectionIndex === 0 ? "eager" : "lazy"}
          preload={sectionIndex === 0}
          className={`img-hidden ${imgVisible ? "img-visible" : ""}`}
        />
      </div>
    </section>
  );
}
