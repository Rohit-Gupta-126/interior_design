"use client";

import React, { useEffect, useRef } from "react";

interface CameraConfig {
  src: string;
  endScale: number;
  endTx: number;
  endTy: number;
  startScale: number;
  startTx: number;
  startTy: number;
  transformOrigin: string;
}

// Spatially connected transitions mapping the drone walkthrough sequence:
// We use deep zooms (endScale of 3.5) centered on transformOrigin (doorways)
// and tiny translations (drift) to maintain zero border exposure.
const CAMERA_CONFIGS: CameraConfig[] = [
  {
    src: "/hero_exterior.png",
    endScale: 1.05,
    endTx: -0.3,
    endTy: -0.4,
    startScale: 1.0,
    startTx: 0.0,
    startTy: 0.0,
    transformOrigin: "35% 65%",
  },
  {
    src: "/hero_entrance.png",
    endScale: 1.05,
    endTx: 0.3,
    endTy: 0.1,
    startScale: 1.0,
    startTx: -0.2,
    startTy: -0.1,
    transformOrigin: "28% 50%",
  },
  {
    src: "/hero_hallway.png",
    endScale: 1.05,
    endTx: -0.2,
    endTy: -0.3,
    startScale: 1.0,
    startTx: 0.2,
    startTy: 0.1,
    transformOrigin: "38% 50%",
  },
  {
    src: "/hero_living_room.png",
    endScale: 1.05,
    endTx: -0.25,
    endTy: 0.0,
    startScale: 1.0,
    startTx: 0.0,
    startTy: 0.3,
    transformOrigin: "35% 50%",
  },
  {
    src: "/hero_kitchen.png",
    endScale: 1.05,
    endTx: 0.1,
    endTy: 0.05,
    startScale: 1.0,
    startTx: 0.25,
    startTy: 0.0,
    transformOrigin: "70% 50%",
  },
  {
    src: "/hero_bedroom.png",
    endScale: 1.05,
    endTx: 0.0,
    endTy: -0.25,
    startScale: 1.0,
    startTx: -0.1,
    startTy: -0.05,
    transformOrigin: "50% 50%",
  },
  {
    src: "/zen_water_feature.png",
    endScale: 1.05,
    endTx: 0.0,
    endTy: 0.0,
    startScale: 1.0,
    startTx: 0.0,
    startTy: 0.5,
    transformOrigin: "50% 50%",
  },
];

const easeInOut = (t: number) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export default function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapsRef = useRef<(HTMLDivElement | null)[]>([]);
  const photosRef = useRef<(HTMLImageElement | null)[]>([]);
  const leftScrimsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rightScrimsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation values interpolation for steadycam feeling
  const targetP = useRef(0);
  const currentP = useRef(0);

  const isAnimating = useRef(false);

  useEffect(() => {
    const snapContainer = document.getElementById("snap-container");
    if (!snapContainer) return;

    const startAnimationLoop = () => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const tick = () => {
        const diffP = targetP.current - currentP.current;

        const pEase = 0.07;

        let active = false;

        if (Math.abs(diffP) > 0.0001) {
          currentP.current += diffP * pEase;
          active = true;
        } else {
          currentP.current = targetP.current;
        }

        const p = currentP.current;

        // Scrim blending based on active layout
        const sectionInt = Math.floor(p);
        const ratio = p - sectionInt;
        const currentLeftTarget = (sectionInt % 2 === 0) ? 1.0 : 0.0;
        const nextLeftTarget = ((sectionInt + 1) % 2 === 0) ? 1.0 : 0.0;

        const leftScrimOpacity = currentLeftTarget + (nextLeftTarget - currentLeftTarget) * ratio;
        const rightScrimOpacity = 1.0 - leftScrimOpacity;

        for (let i = 0; i < CAMERA_CONFIGS.length; i++) {
          const wrap = imageWrapsRef.current[i];
          const photo = photosRef.current[i];
          const leftScrim = leftScrimsRef.current[i];
          const rightScrim = rightScrimsRef.current[i];
          if (!wrap || !photo) continue;

          let scale = 1.0;
          let tx = 0;
          let ty = 0;
          let opacity = 0;
          let zIndex = 1;

          if (p >= i - 1 && p <= i + 1) {
            if (p < i) {
              // ── Incoming transition (i-1 -> i) ──
              const t = p - (i - 1); // 0.0 -> 1.0
              const tEase = easeInOut(t);
              const config = CAMERA_CONFIGS[i];

              // Scale up from startScale (e.g. 0.77) to 1.0
              scale = config.startScale + (1.0 - config.startScale) * tEase;
              // Translate from start positions to 0.0
              tx = config.startTx * (1.0 - tEase);
              ty = config.startTy * (1.0 - tEase);
              // Render underneath the outgoing image as a solid backplane
              opacity = 1.0;
              zIndex = 5;
            } else {
              // ── Outgoing transition (i -> i+1) ──
              const t = p - i; // 0.0 -> 1.0
              const tEase = easeInOut(t);
              const config = CAMERA_CONFIGS[i];

              // Zoom outgoing image deeply (up to 3.5) to fly through thresholds
              scale = 1.0 + (config.endScale - 1.0) * tEase;
              // Translate towards the doorway center
              tx = config.endTx * tEase;
              ty = config.endTy * tEase;
              
              // Outgoing stays fully opaque and zooms deeply until t = 0.72, then fades out rapidly
              // This prevents flat PowerPoint crossfading and simulates a physical camera doorway crossing.
              const fadeStart = 0.72;
              if (t < fadeStart) {
                opacity = 1.0;
              } else {
                const fadeT = (t - fadeStart) / (1.0 - fadeStart);
                opacity = 1.0 - easeInOut(fadeT);
              }
              zIndex = 10;
            }
          } else {
            // Out of active scroll window range
            opacity = 0.0;
            zIndex = 1;
          }

          // Direct style updates for smooth GPU rendering
          wrap.style.opacity = String(opacity);
          wrap.style.zIndex = String(zIndex);
          wrap.style.pointerEvents = opacity > 0.15 ? "auto" : "none";

          if (opacity > 0) {
            // Instant DOM-based lazy loading without React render cycles
            const targetSrc = CAMERA_CONFIGS[i].src;
            if (photo.getAttribute("src") !== targetSrc) {
              photo.setAttribute("src", targetSrc);
            }

            // Apply scroll-driven transform only (no mouse parallax)
            photo.style.transformOrigin = CAMERA_CONFIGS[i].transformOrigin;
            photo.style.transform = `scale(${scale}) translate3d(${tx}vw, ${ty}vh, 0)`;

            if (leftScrim) leftScrim.style.opacity = String(leftScrimOpacity);
            if (rightScrim) rightScrim.style.opacity = String(rightScrimOpacity);
          }
        }

        if (active) {
          requestAnimationFrame(tick);
        } else {
          isAnimating.current = false;
        }
      };

      requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      const scrollTop = snapContainer.scrollTop || window.scrollY || document.documentElement.scrollTop || 0;
      const clientHeight = snapContainer.clientHeight || window.innerHeight || 800;
      const progress = Math.max(0, Math.min(6.0, scrollTop / (clientHeight || 1)));
      targetP.current = progress;
      startAnimationLoop();
    };

    snapContainer.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      snapContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="cinematic-bg-container">
      {CAMERA_CONFIGS.map((config, i) => (
        <div
          key={`${config.src}-${i}`}
          ref={(el) => {
            imageWrapsRef.current[i] = el;
          }}
          className="ps-image-wrap"
          style={{ zIndex: i }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={(el) => {
              photosRef.current[i] = el;
            }}
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            alt={`Walkthrough space ${i + 1}`}
            className="ps-photo"
            style={{
              position: "absolute",
              top: "-15%",
              left: "-15%",
              width: "130%",
              height: "130%",
              objectFit: "cover",
              objectPosition: "center center",
              transformOrigin: "center center",
              minWidth: "130vw",
              minHeight: "130vh",
            }}
          />
          <div
            ref={(el) => {
              leftScrimsRef.current[i] = el;
            }}
            className="ps-gradient-left"
          />
          <div
            ref={(el) => {
              rightScrimsRef.current[i] = el;
            }}
            className="ps-gradient-right"
          />
        </div>
      ))}
    </div>
  );
}
