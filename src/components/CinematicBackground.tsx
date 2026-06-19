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

// Continuous camera drift paths for each room (dx: translateX drift in vw, dy: translateY drift in vh)
const DRIFT_PATHS = [
  { dx: -1.5, dy: -0.5 }, // Section 1: Drifts slightly left-up
  { dx: 1.0, dy: -1.0 },  // Section 2: Drifts right-up
  { dx: 0.0, dy: -1.8 },  // Section 3: Drifts straight forward-up
  { dx: -1.5, dy: 0.5 },  // Section 4: Drifts left-down
  { dx: 1.2, dy: -0.5 },  // Section 5: Drifts right-up
  { dx: 0.0, dy: -1.2 },  // Section 6: Drifts forward-down
];

export default function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapsRef = useRef<(HTMLDivElement | null)[]>([]);
  const photosRef = useRef<(HTMLImageElement | null)[]>([]);
  const leftScrimsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rightScrimsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation targets and currents for smooth steadycam interpolation
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

        // Smooth easing factors
        const pEase = 0.07;
        const mouseEase = 0.05;

        let active = false;

        // Interpolate scroll position
        if (Math.abs(diffP) > 0.0001) {
          currentP.current += diffP * pEase;
          active = true;
        } else {
          currentP.current = targetP.current;
        }

        // Interpolate mouse coordinates
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

        // 3D Parallax camera turning (translate & rotate)
        const txMouse = mx * -30; // in px
        const tyMouse = my * -30; // in px
        const rxMouse = my * 4;    // in deg
        const ryMouse = mx * -4;   // in deg

        // Calculate horizontal scrim blending based on active section
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
          let translateY = 100; // in vh

          if (p < i - 1) {
            // Unentered room: stays below
            opacity = 0;
            translateY = 100;
            scale = 1.0;
            tx = 0;
            ty = 0;
          } else if (p >= i - 1 && p < i) {
            // Incoming threshold slide-up phase!
            const t = p - (i - 1); // 0.0 -> 1.0
            opacity = 1.0;
            translateY = (1.0 - t) * 100; // slides from 100vh down to 0
            scale = 1.0;
            tx = 0;
            ty = 0;
          } else if (p >= i && p < i + 1) {
            // Active room: stationary, slowly zooming and drifting
            const t = p - i; // 0.0 -> 1.0
            opacity = 1.0;
            translateY = 0;
            scale = 1.0 + 0.15 * t; // zoom 1.0 -> 1.15
            tx = DRIFT_PATHS[i].dx * t;
            ty = DRIFT_PATHS[i].dy * t;
          } else {
            // Special case for last image: keep it zooming if p > 5
            if (i === IMAGES.length - 1 && p >= IMAGES.length - 1) {
              const t = p - (IMAGES.length - 1);
              opacity = 1.0;
              translateY = 0;
              scale = 1.15 + 0.05 * t;
              tx = DRIFT_PATHS[i].dx + t * 0.5;
              ty = DRIFT_PATHS[i].dy + t * 0.2;
            } else {
              // Past room: completely covered by the higher z-index slide-up frame
              opacity = 0;
              translateY = 0;
              scale = 1.15;
              tx = DRIFT_PATHS[i].dx;
              ty = DRIFT_PATHS[i].dy;
            }
          }

          // Apply styles directly to bypass React state overhead
          wrap.style.opacity = String(opacity);
          wrap.style.transform = `translate3d(0, ${translateY}vh, 0)`;
          wrap.style.pointerEvents = opacity > 0.15 ? "auto" : "none";

          if (opacity > 0) {
            // Apply scale, pan drift, and mouse camera tilt
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
      // 6 sections = scroll progress from 0.0 to 5.0
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

    // Run initial frame
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
          style={{ zIndex: i }} // Z-index maps to sequence order to stack correctly on slide-up
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
