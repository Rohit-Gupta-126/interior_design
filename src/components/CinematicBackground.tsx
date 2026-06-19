"use client";

import React, { useEffect, useRef, useState } from "react";

interface CameraConfig {
  src: string;
  endScale: number;
  endTx: number;
  endTy: number;
  startScale: number;
  startTx: number;
  startTy: number;
}

// Spatially connected transitions mapping the drone walkthrough sequence:
// Each camera configuration details the start state (coming from previous room)
// and the end state (going to next room).
const CAMERA_CONFIGS: CameraConfig[] = [
  {
    // Exterior Facade (0)
    src: "/hero_exterior.png",
    endScale: 1.45,
    endTx: 8.0,
    endTy: 2.0,
    startScale: 1.0,
    startTx: 0.0,
    startTy: 0.0,
  },
  {
    // Entrance Threshold Pivot (1)
    src: "/hero_entrance.png",
    endScale: 1.45,
    endTx: -12.0,
    endTy: 1.0,
    startScale: 0.77,
    startTx: -8.0,
    startTy: -2.0,
  },
  {
    // Minimal Hallway Gallery (2)
    src: "/hero_hallway.png",
    endScale: 1.45,
    endTx: 0.0,
    endTy: -2.0,
    startScale: 0.77,
    startTx: 12.0,
    startTy: -1.0,
  },
  {
    // Living Pavilion Hearth (3)
    src: "/hero_living_room.png",
    endScale: 1.25,
    endTx: -28.0,
    endTy: 0.0,
    startScale: 0.77,
    startTx: 0.0,
    startTy: 2.0,
  },
  {
    // Chef Kitchen Island (4)
    src: "/hero_kitchen.png",
    endScale: 1.45,
    endTx: 8.0,
    endTy: 1.0,
    startScale: 0.82,
    startTx: 28.0,
    startTy: 0.0,
  },
  {
    // Master Timber Bedroom (5)
    src: "/hero_bedroom.png",
    endScale: 1.15,
    endTx: 0.0,
    endTy: 0.0,
    startScale: 0.77,
    startTx: -8.0,
    startTy: -1.0,
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

  // Scroll-driven lazy loading of images
  const [loadedIndices, setLoadedIndices] = useState<boolean[]>([
    true,
    false,
    false,
    false,
    false,
    false,
  ]);

  // Animation values interpolation for steadycam feeling
  const targetP = useRef(0);
  const currentP = useRef(0);

  const targetMx = useRef(0);
  const targetMy = useRef(0);
  const currentMx = useRef(0);
  const currentMy = useRef(0);

  const clientHeightRef = useRef(800);
  const isAnimating = useRef(false);

  useEffect(() => {
    const snapContainer = document.getElementById("snap-container");
    if (!snapContainer) return;

    clientHeightRef.current = snapContainer.clientHeight || window.innerHeight;

    const handleResize = () => {
      clientHeightRef.current = snapContainer.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const startAnimationLoop = () => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const tick = () => {
        const diffP = targetP.current - currentP.current;
        const diffMx = targetMx.current - currentMx.current;
        const diffMy = targetMy.current - currentMy.current;

        const pEase = 0.07;
        const mouseEase = 0.05;

        let active = false;

        if (Math.abs(diffP) > 0.0001) {
          currentP.current += diffP * pEase;
          active = true;
        } else {
          currentP.current = targetP.current;
        }

        if (Math.abs(diffMx) > 0.0001 || Math.abs(diffMy) > 0.0001) {
          currentMx.current += diffMx * mouseEase;
          currentMy.current += diffMy * mouseEase;
          active = true;
        } else {
          currentMx.current = targetMx.current;
          currentMy.current = targetMy.current;
        }

        const p = currentP.current;
        const mx = currentMx.current;
        const my = currentMy.current;

        // Camera tilt offsets (max 35px translation, 4deg rotation)
        const txMouse = mx * -35;
        const tyMouse = my * -35;
        const rxMouse = my * 4.0;
        const ryMouse = mx * -4.0;

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
          if (!wrap) continue;

          let scale = 1.0;
          let tx = 0;
          let ty = 0;
          let opacity = 0;

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
              // Incoming fades in on top
              opacity = t;
            } else {
              // ── Outgoing transition (i -> i+1) ──
              const t = p - i; // 0.0 -> 1.0
              const tEase = easeInOut(t);
              const config = CAMERA_CONFIGS[i];

              // Scale up from 1.0 to endScale (e.g. 1.45)
              scale = 1.0 + (config.endScale - 1.0) * tEase;
              // Translate from 0.0 to end positions
              tx = config.endTx * tEase;
              ty = config.endTy * tEase;
              // Underneath layer stays opaque to prevent black background leak
              opacity = 1.0;
            }
          } else {
            // Out of active scroll window range
            opacity = 0.0;
          }

          // Direct style updates for smooth GPU rendering
          wrap.style.opacity = String(opacity);
          wrap.style.pointerEvents = opacity > 0.15 ? "auto" : "none";

          if (opacity > 0 && photo) {
            photo.style.transform = `scale(${scale}) translate3d(calc(${tx}vw + ${txMouse}px), calc(${ty}vh + ${tyMouse}px), 0) rotateX(${rxMouse}deg) rotateY(${ryMouse}deg)`;

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
      const scrollTop = snapContainer.scrollTop;
      const progress = Math.max(0, Math.min(5.0, scrollTop / clientHeightRef.current));
      targetP.current = progress;

      // Lazy load next image keys as the user approaches
      setLoadedIndices((prev) => {
        let changed = false;
        const next = [...prev];
        for (let i = 0; i < CAMERA_CONFIGS.length; i++) {
          if (!next[i] && progress >= i - 1.2) {
            next[i] = true;
            changed = true;
          }
        }
        return changed ? next : prev;
      });

      startAnimationLoop();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMx.current = (e.clientX / window.innerWidth) - 0.5;
      targetMy.current = (e.clientY / window.innerHeight) - 0.5;
      startAnimationLoop();
    };

    snapContainer.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("resize", handleResize);
      snapContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
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
          {loadedIndices[i] && (
            <img
              ref={(el) => {
                photosRef.current[i] = el;
              }}
              src={config.src}
              alt={`Walkthrough space ${i + 1}`}
              className="ps-photo"
              style={{
                position: "absolute",
                top: "-15%",
                left: "-15%",
                width: "130%",
                height: "130%",
                objectFit: "cover",
                objectPosition: "center",
                transformOrigin: "center center",
              }}
            />
          )}
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
