"use client";

import React, { useEffect, useRef } from "react";

const IMAGES = [
  "/hero_exterior.png",
  "/hero_living_room.png",
  "/material_detail.png",
  "/corridor_flow.png",
  "/zen_water_feature.png",
  "/zen_water_feature.png",
];

// 3D camera pan/zoom parameters for transitions (5 transitions for 6 sections)
const CAM_PATHS = [
  {
    // Transition 0 (Section 1 -> 2: Exterior to Living Room)
    targetScale: 2.6,
    targetTx: -30, // in vw
    targetTy: -15, // in vh
    targetRx: 10,  // in deg
    targetRy: -15, // in deg
  },
  {
    // Transition 1 (Section 2 -> 3: Living Room to Glass Corridor)
    targetScale: 2.8,
    targetTx: 30,
    targetTy: 10,
    targetRx: -8,
    targetRy: 12,
  },
  {
    // Transition 2 (Section 3 -> 4: Glass Corridor to Concrete Corridor)
    targetScale: 2.5,
    targetTx: 0,
    targetTy: -10,
    targetRx: 6,
    targetRy: 0,
  },
  {
    // Transition 3 (Section 4 -> 5: Concrete Corridor to Timber Study)
    targetScale: 3.0,
    targetTx: -20,
    targetTy: 15,
    targetRx: 12,
    targetRy: -12,
  },
  {
    // Transition 4 (Section 5 -> 6: Timber Study to Still Waters)
    // Zooming deep inside the same zen_water_feature to focus on water ripples
    targetScale: 2.8,
    targetTx: 25,
    targetTy: -10,
    targetRx: -6,
    targetRy: 8,
  }
];

export default function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapsRef = useRef<(HTMLDivElement | null)[]>([]);
  const photosRef = useRef<(HTMLImageElement | null)[]>([]);
  const leftScrimsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rightScrimsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation values tracked with refs to prevent React re-renders on scroll/mouse updates
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

    // Set initial heights safely
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

        // Gimbal / steadycam smoothing factors
        const pEase = 0.08;
        const mouseEase = 0.06;

        let active = false;

        // Smoothly interpolate scroll progress
        if (Math.abs(diffP) > 0.0001) {
          currentP.current += diffP * pEase;
          active = true;
        } else {
          currentP.current = targetP.current;
        }

        // Smoothly interpolate mouse tilt values
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

        // Mouse coordinates mapped to 3D perspective forces
        const txMouse = mx * -40; // in px
        const tyMouse = my * -40; // in px
        const rxMouse = my * 5;    // in deg
        const ryMouse = mx * -5;   // in deg

        // Calculate dynamic left/right gradient scrim opacities based on active section alignment
        const sectionInt = Math.floor(p);
        const ratio = p - sectionInt;

        // Odd sections (0, 2, 4 -> Sections 1, 3, 5) have text on left, target left scrim
        // Even sections (1, 3, 5 -> Sections 2, 4, 6) have text on right, target right scrim
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
          let rx = 0;
          let ry = 0;
          let opacity = 0;

          // Check if current image is in transition window
          if (p >= i - 1 && p <= i + 1) {
            if (p < i) {
              // Incoming transition (i-1 -> i)
              const t = p - (i - 1); // 0 to 1
              const path = CAM_PATHS[i - 1];
              
              // Nesting Math: start scale is reciprocal, start tx/ty are inverse scaled offset
              const startScale = 1.0 / path.targetScale;
              const startTx = -path.targetTx / path.targetScale;
              const startTy = -path.targetTy / path.targetScale;
              const startRx = path.targetRx;
              const startRy = path.targetRy;

              scale = startScale + (1.0 - startScale) * t;
              tx = startTx * (1.0 - t);
              ty = startTy * (1.0 - t);
              rx = startRx * (1.0 - t);
              ry = startRy * (1.0 - t);
              opacity = t;
            } else {
              // Outgoing transition (i -> i+1)
              const t = p - i; // 0 to 1
              if (i < CAM_PATHS.length) {
                const path = CAM_PATHS[i];
                
                scale = 1.0 + (path.targetScale - 1.0) * t;
                tx = path.targetTx * t;
                ty = path.targetTy * t;
                rx = path.targetRx * t;
                ry = path.targetRy * t;
                
                // If this is the last image in the stack, don't fade it out (we dolly in closer)
                if (i === IMAGES.length - 1) {
                  opacity = 1.0;
                } else {
                  opacity = 1.0 - t;
                }
              } else {
                // Beyond the last path, static active
                scale = 1.0;
                tx = 0;
                ty = 0;
                rx = 0;
                ry = 0;
                opacity = 1.0;
              }
            }
          } else {
            // Special case: for p > 4, the final image stays active and continues zooming
            if (i === IMAGES.length - 1 && p > IMAGES.length - 1) {
              const t = p - (IMAGES.length - 1); // transition 4 (4 -> 5)
              const path = CAM_PATHS[IMAGES.length - 1];
              scale = 1.0 + (path.targetScale - 1.0) * t;
              tx = path.targetTx * t;
              ty = path.targetTy * t;
              rx = path.targetRx * t;
              ry = path.targetRy * t;
              opacity = 1.0;
            } else {
              opacity = 0;
            }
          }

          // Direct DOM style writes to bypass React state overhead (layout-thrashing free)
          wrap.style.opacity = String(Math.max(0, Math.min(1, opacity)));
          wrap.style.pointerEvents = opacity > 0.15 ? "auto" : "none";

          if (opacity > 0) {
            // Apply scale and translation + mouse parallax offsets
            const finalRx = rx + rxMouse;
            const finalRy = ry + ryMouse;

            photo.style.transform = `scale(${scale}) translate3d(calc(${tx}vw + ${txMouse}px), calc(${ty}vh + ${tyMouse}px), 0) rotateX(${finalRx}deg) rotateY(${finalRy}deg)`;

            // Dynamically blend the left and right gradient scrims based on current layout alignment
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
      // 6 sections = progress from 0.0 to 5.0
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

    // Initial render trigger
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
