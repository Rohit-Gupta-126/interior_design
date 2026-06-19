"use client";

import React, { useEffect, useRef } from "react";

const IMAGES = [
  "/hero_exterior.png",
  "/hero_entrance.png",
  "/hero_hallway.png",
  "/hero_living_room.png",
  "/hero_kitchen.png",
  "/hero_bedroom.png",
];

// Spatially connected transitions mapping the drone walkthrough sequence:
// - Zoom transitions: camera dollying forward through a doorway or down a hall.
// - Pan transitions: camera turning laterally to look at an adjacent space.
const CAM_PATHS = [
  {
    // Transition 0 (Section 1 -> 2: Exterior Facade -> Entrance Pivot Door)
    // Focuses on the wood-glass door located center-left in the exterior photo.
    type: "zoom",
    targetScale: 3.0,
    targetTx: -5.0,  // Shifts left to center the door
    targetTy: -10.0, // Shifts up to center the door
  },
  {
    // Transition 1 (Section 2 -> 3: Entrance Door -> Hallway Gallery)
    // Focuses on the glowing corridor interior visible through the open doorway (shifted to the right in the entrance photo).
    type: "zoom",
    targetScale: 2.8,
    targetTx: 18.0,  // Shifts right to center the corridor opening
    targetTy: 6.0,
  },
  {
    // Transition 2 (Section 3 -> 4: Hallway Gallery -> Living Pavilion)
    // Focuses on the living room at the far end of the long hallway corridor.
    type: "zoom",
    targetScale: 2.8,
    targetTx: 0.0,
    targetTy: -5.0,
  },
  {
    // Transition 3 (Section 4 -> 5: Living Pavilion -> Kitchen Island Studio)
    // The kitchen is adjacent to the living room. Camera pans right laterally.
    type: "pan-right",
    targetScale: 1.0,
    targetTx: 0,
    targetTy: 0,
  },
  {
    // Transition 4 (Section 5 -> 6: Kitchen Island Studio -> master timber bedroom)
    // Focuses on entering the bedroom door at the end of the house.
    type: "zoom",
    targetScale: 2.6,
    targetTx: -10.0,
    targetTy: -5.0,
  }
];

export default function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapsRef = useRef<(HTMLDivElement | null)[]>([]);
  const photosRef = useRef<(HTMLImageElement | null)[]>([]);
  const leftScrimsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rightScrimsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation values interpolation
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

        // Easing factors for smooth dolly motion
        const pEase = 0.08;
        const mouseEase = 0.06;

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

        // Camera tilt offsets (max 30px translation, 4deg rotation)
        const txMouse = mx * -30;
        const tyMouse = my * -30;
        const rxMouse = my * 4;
        const ryMouse = mx * -4;

        // Scrim blending based on layout side
        const sectionInt = Math.floor(p);
        const ratio = p - sectionInt;
        const currentLeftTarget = (sectionInt % 2 === 0) ? 1.0 : 0.0;
        const nextLeftTarget = ((sectionInt + 1) % 2 === 0) ? 1.0 : 0.0;

        const leftScrimOpacity = currentLeftTarget + (nextLeftTarget - currentLeftTarget) * ratio;
        const rightScrimOpacity = 1.0 - leftScrimOpacity;

        for (let i = 0; i < IMAGES.length; i++) {
          const wrap = imageWrapsRef.current[i];
          const photo = photosRef.current[i];
          const leftScrim = leftScrimsRef.current[i];
          const rightScrim = rightScrimsRef.current[i];
          if (!wrap || !photo) continue;

          let scale = 1.0;
          let tx = 0;
          let ty = 0;
          let opacity = 0;

          if (p >= i - 1 && p <= i + 1) {
            if (p < i) {
              // ── Incoming transition (i-1 -> i) ──
              const t = p - (i - 1); // 0.0 -> 1.0
              const path = CAM_PATHS[i - 1];

              if (path.type === "zoom") {
                // Russian-Doll Nesting Math: starts scaled down and centers as t -> 1
                const startScale = 1.0 / path.targetScale;
                const startTx = -path.targetTx / path.targetScale;
                const startTy = -path.targetTy / path.targetScale;

                scale = startScale + (1.0 - startScale) * t;
                tx = startTx * (1.0 - t);
                ty = startTy * (1.0 - t);
                opacity = t; // Fade in on top of previous
              } else if (path.type === "pan-right") {
                // Lateral Pan: slides in from the right edge
                scale = 1.0;
                tx = 100 * (1.0 - t);
                ty = 0;
                opacity = 1.0; // Fully opaque slide-in
              }
            } else {
              // ── Outgoing transition (i -> i+1) ──
              const t = p - i; // 0.0 -> 1.0

              if (i < CAM_PATHS.length) {
                const path = CAM_PATHS[i];

                if (path.type === "zoom") {
                  // Outgoing zoom: scales up towards the focal point
                  scale = 1.0 + (path.targetScale - 1.0) * t;
                  tx = path.targetTx * t;
                  ty = path.targetTy * t;
                  opacity = 1.0 - t; // Fades out to reveal nesting
                } else if (path.type === "pan-right") {
                  // Outgoing pan: slides left out of the viewport
                  scale = 1.0;
                  tx = -100 * t;
                  ty = 0;
                  opacity = 1.0; // Stays fully opaque underneath incoming
                }
              } else {
                // Final image (Bedroom): slowly zooms on scroll overshoot
                const tOver = Math.max(0, p - (IMAGES.length - 1));
                scale = 1.0 + 0.15 * tOver;
                tx = 0;
                ty = 0;
                opacity = 1.0;
              }
            }
          } else {
            // Out of transition window
            opacity = 0;
          }

          // Direct style edits for performance
          wrap.style.opacity = String(opacity);
          wrap.style.pointerEvents = opacity > 0.15 ? "auto" : "none";

          if (opacity > 0) {
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
      targetP.current = Math.max(0, Math.min(5.0, snapContainer.scrollTop / clientHeightRef.current));
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
      {IMAGES.map((src, i) => (
        <div
          key={`${src}-${i}`}
          ref={(el) => {
            imageWrapsRef.current[i] = el;
          }}
          className="ps-image-wrap"
          style={{ zIndex: i }}
        >
          <img
            ref={(el) => {
              photosRef.current[i] = el;
            }}
            src={src}
            alt={`Walkthrough space ${i + 1}`}
            className="ps-photo"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transformOrigin: "center center",
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
