/**
 * components/ProjectSection.tsx
 *
 * Cinematic Scroll-Driven Walks & 3D Background Parallax Layout:
 * ─────────────────────────────────────────────────────────────────
 * On desktop, background images and text panels are fixed in place.
 * Scrolling down scales up the active photo (dollies forward) and
 * fades it out, revealing the next image which starts zoomed and scales down.
 * The editorial text panels slide out and in to the left.
 * A 3D window parallax is applied to the active image based on cursor offsets.
 */

"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import FloorPlanSVG from "@/components/FloorPlanSVG";

/* ── Types ──────────────────────────────────────────────────── */

interface ProjectStat {
  label: string;
  value: string;
  suffix?: string;
}

export interface ProjectData {
  index: number;
  category: string;
  headline: string;
  headlineAlt?: string;
  description: string;
  stat: ProjectStat;
  location: string;
  year: string;
  imageSrc: string;
  imageAlt: string;
  id: string;
}

interface ProjectSectionProps {
  project: ProjectData;
  sectionIndex: number;
}

/* ── Origin Focus Mapping for zooms ── */
const ORIGINS: Record<number, string> = {
  0: "80% 70%", // Section 1: Wide room -> focus fireplace console on bottom right
  1: "50% 50%", // Section 2: Macro detail -> focus center
  2: "50% 52%", // Section 3: Hallway corridor -> focus water feature at end
  3: "50% 50%", // Section 4: Water feature -> focus center
};

/* ── Tilt Utility for Stats Card ─────────────────────────── */
function getTiltTransform(
  e: React.MouseEvent<HTMLDivElement>,
  el: HTMLDivElement
): string {
  const rect = el.getBoundingClientRect();
  const rotateY = (((e.clientX - rect.left) / rect.width) - 0.5) * 14;
  const rotateX = (0.5 - ((e.clientY - rect.top) / rect.height)) * 14;
  return `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
}

/* ── Component ───────────────────────────────────────────── */

export default function ProjectSection({ project, sectionIndex }: ProjectSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // One-shot intersection observer to fade in content initially
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3D Parallax Tilt for Stats Card
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;
    const el = tiltRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
    el.style.transform = getTiltTransform(e, el);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);

  // Scroll engine to animate text panel translation & fade (Desktop only)
  useEffect(() => {
    const container = document.getElementById("snap-container");
    if (!container) return;

    const onScroll = () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;

      if (window.innerWidth <= 900) {
        // Clear all desktop inline styles on mobile to let CSS media queries take over
        content.style.opacity = "";
        content.style.transform = "";
        content.style.pointerEvents = "";
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const top = rect.top;
      const progress = top / viewportHeight;

      // Check if section is inside or near the viewport
      if (top > -viewportHeight && top < viewportHeight) {

        // ── TEXT PANEL TRANSLATION & FADE ──
        let textOpacity = 0;
        let translateX = 0;
        
        const isRight = sectionIndex % 2 !== 0;
        const slideDir = isRight ? 1 : -1;

        if (progress === 0) {
          textOpacity = 1;
          translateX = 0;
        } else if (progress > 0) {
          // Entering from below
          const entryThreshold = 0.65; /* Increased from 0.35 for much longer visibility during scroll */
          if (progress < entryThreshold) {
            const p = (entryThreshold - progress) / entryThreshold;
            textOpacity = p;
            translateX = slideDir * 60 * (1 - p); /* Reduced from 120px to 60px for cleaner/minimal movement */
          } else {
            textOpacity = 0;
            translateX = slideDir * 60;
          }
        } else {
          // Exiting to top
          const exitThreshold = 0.65; /* Increased from 0.35 for much longer visibility */
          const absProgress = Math.abs(progress);
          if (absProgress < exitThreshold) {
            const p = (exitThreshold - absProgress) / exitThreshold;
            textOpacity = p;
            translateX = slideDir * 60 * (1 - p); /* Reduced from 120px to 60px */
          } else {
            textOpacity = 0;
            translateX = slideDir * 60;
          }
        }

        content.style.opacity = String(Math.max(0, Math.min(1, textOpacity)));
        content.style.transform = `translate3d(${translateX}px, 0, 0)`;
        content.style.pointerEvents = textOpacity > 0.35 ? "auto" : "none";
      } else {
        // Out of viewport
        content.style.opacity = "0";
        content.style.pointerEvents = "none";
      }
    };

    onScroll();

    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionIndex]); // Add sectionIndex dependency to ensure correct alignment values

  const indexStr = String(project.index).padStart(2, "0");
  const isRightLayout = sectionIndex % 2 !== 0;

  return (
    <section
      ref={sectionRef}
      id={project.id}
      className="ps-root"
      aria-label={`Project ${indexStr}: ${project.headline}`}
    >
      {/* ── MOBILE ONLY BACKGROUND IMAGE ── */}
      <div className="ps-image-wrap-mobile">
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          fill
          sizes="100vw"
          quality={90}
          loading={sectionIndex === 0 ? "eager" : "lazy"}
          priority={sectionIndex === 0}
          className="ps-photo-mobile"
          style={{ objectFit: "cover", objectPosition: "center right" }}
        />
        <div className="ps-gradient-mobile" />
      </div>

      {/* ── LAYER 2: Editorial Floating Panel ── */}
      <div ref={contentRef} className={`ps-content ${isRightLayout ? "align-right" : "align-left"}`}>
        {/* Index / Category overline */}
        <div className={`ps-overline ${isVisible ? "fi fi-d1" : "fi-init"}`}>
          <span className="ps-idx">{indexStr}</span>
          <span className="ps-cat">{project.category}</span>
        </div>

        {/* Giant serif headline */}
        <h2 className={`ps-title ${isVisible ? "fi fi-d2" : "fi-init"}`}>
          {project.headline}
          {project.headlineAlt && (
            <span className="ps-title-alt">
              {" / "}{project.headlineAlt}
            </span>
          )}
        </h2>

        {/* Amber rule */}
        <div className={`ps-rule ${isVisible ? "fi fi-d3" : "fi-init"}`} />

        {/* Description */}
        <p className={`ps-desc ${isVisible ? "fi fi-d3" : "fi-init"}`}>
          {project.description}
        </p>

        {/* Detail rows */}
        <dl className={`ps-meta ${isVisible ? "fi fi-d4" : "fi-init"}`}>
          <div className="ps-meta-row">
            <dt>Area</dt>
            <dd>{project.stat.value}{project.stat.suffix ? ` ${project.stat.suffix}` : ""}</dd>
          </div>
          <div className="ps-meta-row">
            <dt>Location</dt>
            <dd>{project.location}</dd>
          </div>
          <div className="ps-meta-row">
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>

        {/* Liquid Glass Stats Card */}
        <div
          ref={tiltRef}
          className={`ps-card ${isVisible ? "fi fi-d5" : "fi-init"}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="ps-card-inner">
            <p className="ps-card-label">{project.stat.label}</p>
            <p className="ps-card-value">
              {project.stat.value}
              {project.stat.suffix && <span className="ps-card-suffix"> {project.stat.suffix}</span>}
            </p>
          </div>
        </div>

        {/* SVG floor plan */}
        <FloorPlanSVG />
      </div>
    </section>
  );
}
