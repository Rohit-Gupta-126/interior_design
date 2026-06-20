"use client";

import React, { useEffect, useRef, useState } from "react";

interface HotspotConfig {
  rx: number;
  ry: number;
}

interface InfoConfig {
  tag: string;
  title: string;
  body: string;
  details: [string, string][];
}

interface RoomData {
  type: "room" | "transition";
  name?: string;
  label?: string;
  img: string;
  left: string;      // CSS left positioning
  nativeX: number;   // X-offset in native pixels (for overlap tracking)
  hotspot?: HotspotConfig;
  info?: InfoConfig;
}

const ROOMS: RoomData[] = [
  {
    type: "room",
    name: "Entrance Hall",
    label: "01",
    img: "/interior_assets/artwork (1).png",
    left: "0vh",
    nativeX: 0,
    hotspot: { rx: 0.62, ry: 0.58 },
    info: {
      tag: "The Entrance Hall",
      title: "First impressions are made in stone.",
      body: "A cantilevered roofline draws you in past clipped hedges toward a wall of glass. Inside, travertine and brushed bronze catch the last warm light of evening — the threshold between garden and home dissolves into a single composed frame.",
      details: [
        ["Facade", "Powder-coated Anthracite Panel"],
        ["Threshold", "Full-height Pivot Glass"],
        ["Lighting", "Grazing Façade Wash"],
        ["Landscaping", "Clipped Boxwood Hedge"],
      ],
    },
  },
  {
    type: "transition",
    img: "/interior_assets/artwork (2).png",
    left: "155.46vh",
    nativeX: 1679,
  },
  {
    type: "room",
    name: "Living Room",
    label: "02",
    img: "/interior_assets/artwork (3).png",
    left: "305.46vh",
    nativeX: 3299,
    hotspot: { rx: 0.4, ry: 0.62 },
    info: {
      tag: "The Living Room",
      title: "A skyline borrowed for the view.",
      body: "A deep sectional in charcoal boucle anchors the room beneath a floor-to-ceiling window framing the city beyond. Walnut columns and a low travertine-topped table keep the eye level, letting the skyline do the talking after dark.",
      details: [
        ["Seating", "Charcoal Boucle Sectional"],
        ["Columns", "Coopered American Walnut"],
        ["Tables", "Travertine + Blackened Steel"],
        ["Glazing", "Floor-to-Ceiling, Low-Iron"],
      ],
    },
  },
  {
    type: "room",
    name: "Materials Library",
    label: "03",
    img: "/interior_assets/artwork (4).png",
    left: "470.37vh",
    nativeX: 5080,
    hotspot: { rx: 0.6, ry: 0.55 },
    info: {
      tag: "The Materials Library",
      title: "Every surface earns the right to stay.",
      body: "A coopered walnut column stands sentinel beside a long shadow-gap cabinet, its concealed light spilling across a curated shelf of objects. Nothing here is decorative by accident — every piece on display was chosen, not arranged.",
      details: [
        ["Column", "Coopered Walnut, Hand-finished"],
        ["Cabinetry", "Matte Lacquer, Shadow-gap Reveal"],
        ["Lighting", "Concealed LED Strip, 2700K"],
        ["Display", "Curated Object Shelf"],
      ],
    },
  },
  {
    type: "room",
    name: "The Staircase",
    label: "04",
    img: "/interior_assets/artwork (5).png",
    left: "631.20vh",
    nativeX: 6817,
    hotspot: { rx: 0.55, ry: 0.42 },
    info: {
      tag: "The Staircase",
      title: "A single gesture, cantilevered in air.",
      body: "Blackened steel treads appear to float, held only by a hairline glass balustrade lit from above. There is no stringer, no visible support — just the quiet confidence of structure engineered to disappear.",
      details: [
        ["Treads", "Blackened Steel, Floating"],
        ["Balustrade", "Hairline Low-Iron Glass"],
        ["Lighting", "Integrated Handrail Strip"],
        ["Engineering", "Cantilevered, No Visible Stringer"],
      ],
    },
  },
  {
    type: "room",
    name: "The Reading Corner",
    label: "05",
    img: "/interior_assets/artwork (6).png",
    left: "786.76vh",
    nativeX: 8497,
    hotspot: { rx: 0.84, ry: 0.62 },
    info: {
      tag: "The Reading Corner",
      title: "One lamp, and the room softens.",
      body: "A sculptural floor lamp casts a single warm sphere of light against an otherwise unbroken dark wall. It is the quietest moment in the house — proof that restraint, used well, is its own kind of luxury.",
      details: [
        ["Fixture", "Sculptural Sphere Floor Lamp"],
        ["Wall Finish", "Matte Charcoal Plaster"],
        ["Flooring", "Wide-plank Smoked Oak"],
        ["Mood", "Single-source Ambient Glow"],
      ],
    },
  },
  {
    type: "room",
    name: "The Media Wall",
    label: "06",
    img: "/interior_assets/artwork (7).png",
    left: "631.20vh", // shifted to match Staircase
    nativeX: 6817,
    hotspot: { rx: 0.42, ry: 0.62 },
    info: {
      tag: "The Media Wall",
      title: "Technology, kept out of sight.",
      body: "A recessed console runs the width of the wall, lit from beneath so it appears to hover. The television sits flush against matte paneling, present only when switched on — everything else recedes into shadow.",
      details: [
        ["Console", "Floating, Recessed Plinth"],
        ["Panelling", "Matte Charcoal Shadow-box"],
        ["Lighting", "Underlit LED, Warm White"],
        ["Integration", "Flush-mount Display"],
      ],
    },
  },
  {
    type: "transition",
    img: "/interior_assets/artwork (8).png",
    left: "736.76vh", // shifted
    nativeX: 7957,
  },
  {
    type: "room",
    name: "The Courtyard Glass",
    label: "07",
    img: "/interior_assets/artwork (9).png",
    left: "825.65vh", // shifted
    nativeX: 8917,
    hotspot: { rx: 0.62, ry: 0.46 },
    info: {
      tag: "The Courtyard Glass",
      title: "A wall of green, brought indoors.",
      body: "A full-height glass partition slides away to dissolve the line between inside and out. Beyond it, a private planted courtyard does the work most rooms ask of art — it just needs to be looked at.",
      details: [
        ["Partition", "Full-height Sliding Glass"],
        ["Landscaping", "Layered Native Planting"],
        ["Flooring", "Wide-plank Walnut"],
        ["Lighting", "Recessed Edge Strip"],
      ],
    },
  },
  {
    type: "room",
    name: "Master Bedroom",
    label: "08",
    img: "/interior_assets/artwork (10).png",
    left: "953.43vh", // shifted
    nativeX: 10297,
    hotspot: { rx: 0.5, ry: 0.6 },
    info: {
      tag: "The Master Bedroom",
      title: "Where the day finally softens.",
      body: "A low platform bed sits beneath a glowing amber-lit headboard wall, flanked by hand-woven pendant lights. Floor-to-ceiling glass opens onto a private screen of trees — the last room of the house, and the quietest.",
      details: [
        ["Headboard", "Backlit Amber Recess"],
        ["Pendants", "Hand-woven Rattan Shade"],
        ["Flooring", "Dark Walnut, Wide-plank"],
        ["Glazing", "Floor-to-Ceiling, Garden-facing"],
      ],
    },
  },
];

const TOTAL_ROOMS = ROOMS.filter((r) => r.type === "room").length;

export default function PanoramicWalkthrough() {
  const walkFixedRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<HTMLDivElement>(null);
  const panoStageRef = useRef<HTMLDivElement>(null);
  const progFillRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const roomLabelRef = useRef<HTMLDivElement>(null);
  const rlNumRef = useRef<HTMLDivElement>(null);
  const rlNameRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  const hotspotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activePanelIndex, setActivePanelIndex] = useState<number | null>(null);
  const [hintGone, setHintGone] = useState(false);

  const mny = useRef(0);

  useEffect(() => {
    // Resize the ref array to fit the number of rooms
    hotspotRefs.current = hotspotRefs.current.slice(0, ROOMS.length);

    const handleMouseMove = (e: MouseEvent) => {
      mny.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const spacerEl = spacerRef.current;
    const walkFixed = walkFixedRef.current;
    const pano = panoRef.current;
    const panoStage = panoStageRef.current;
    const progFill = progFillRef.current;
    const scrollHint = scrollHintRef.current;
    const roomLabel = roomLabelRef.current;
    const rlNum = rlNumRef.current;
    const rlName = rlNameRef.current;

    if (!spacerEl || !walkFixed || !pano || !panoStage || !progFill || !scrollHint || !roomLabel || !rlNum || !rlName) {
      return;
    }

    let currentX = 0;
    let tiltY = 0;
    let activeRm = -1;
    let exitFade = 0;
    let inW = false;
    let animationFrameId: number;

    const loop = () => {
      const sy = window.scrollY;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sTop = spacerEl.offsetTop;
      const sH = spacerEl.offsetHeight;
      const pH = document.documentElement.scrollHeight - vh;

      // Update scroll progress bar
      if (progFill) {
        progFill.style.width = `${(sy / (pH || 1)) * 100}%`;
      }

      const denom = sH - vh;
      const raw = denom > 0 ? (sy - sTop) / denom : 0;
      const p = Math.max(0, Math.min(1, raw));

      // Fade out walkthrough as we exit (from raw = 1.0 to 1.25)
      exitFade = Math.max(0, Math.min(1, (raw - 1.0) / 0.25));
      walkFixed.style.opacity = String(1 - exitFade);
      walkFixed.style.pointerEvents = exitFade >= 0.99 ? "none" : "auto";

      inW = raw >= -0.01 && raw <= 1.30;
      walkFixed.classList.toggle("hidden", raw > 1.29);

      if (sy > 60 && !hintGone) {
        setHintGone(true);
        scrollHint.classList.add("gone");
      }

      roomLabel.classList.toggle("on", inW && p > 0.005 && exitFade < 0.5);

      const S = vh / 1080.0;

      let targetX = 0;
      let targetY = 0;
      let activeRmIdx = 0;
      let currentCx = 0;

      // ── THREE-PHASE SCROLL MAPPING ──
      // Phase A: Strip 1 horizontal pan (Panorama 1 + 2)
      if (p <= 0.55) {
        const t = p / 0.55;
        targetX = t * (vw - 10417 * S);
        targetY = 0;
        currentCx = (vw * 0.5 - targetX) / S;

        // Map active room based on currentCx coordinates
        if (currentCx < 2600) {
          activeRmIdx = 0; // Entrance Hall (01)
        } else if (currentCx < 5150) {
          activeRmIdx = 2; // Living Room (02)
        } else if (currentCx < 6817) {
          activeRmIdx = 3; // Materials Library (03)
        } else if (currentCx < 8497) {
          activeRmIdx = 4; // Staircase (04)
        } else {
          activeRmIdx = 5; // Reading Corner (05)
        }
      }
      // Phase B: Vertical transition to Strip 2 (Media Wall)
      else if (p < 0.65) {
        const t = (p - 0.55) / 0.10;
        const xStart = vw - 10417 * S;
        const xEnd = vw - 6817 * S;
        targetX = (1 - t) * xStart + t * xEnd;
        targetY = -t * vh;
        currentCx = (1 - t) * 9457 + t * 7777; // Smoothly interpolate active room center during transition

        if (t < 0.5) {
          activeRmIdx = 5; // Reading Corner (05)
        } else {
          activeRmIdx = 6; // Media Wall (06)
        }
      }
      // Phase C: Strip 2 horizontal pan (Panorama 3)
      else {
        // Complete pan by p = 0.88, then hold bedroom stationary till p = 1.0
        if (p <= 0.88) {
          const t = (p - 0.65) / 0.23;
          targetX = (1 - t) * (vw - 6817 * S) + t * (vw - 12217 * S);
        } else {
          targetX = vw - 12217 * S;
        }
        targetY = -vh;
        currentCx = (vw * 0.5 - targetX) / S;

        if (currentCx < 8700) {
          activeRmIdx = 6; // Media Wall (06)
        } else if (currentCx < 10500) {
          activeRmIdx = 8; // Courtyard Glass (07)
        } else {
          activeRmIdx = 9; // Master Bedroom (08)
        }
      }

      // Smooth horizontal interpolation
      currentX += (targetX - currentX) * 0.085;
      tiltY += (mny.current * 8 - tiltY) * 0.05;

      // Apply transform to pano wrapper
      pano.style.transform = `translateX(${currentX}px) translateY(${targetY}px)`;

      // Camera yaw based on panning lag
      const camYaw = Math.max(-3.0, Math.min(3.0, (targetX - currentX) * 0.012));
      panoStage.style.transform = `rotateY(${camYaw}deg)`;

      // Apply vertical mouse steadicam tilt directly to slices
      const slices = pano.querySelectorAll(".slice");
      slices.forEach((sliceEl) => {
        const el = sliceEl as HTMLElement;
        el.style.transform = `translateY(${tiltY}px)`;
      });

      // Update room label text
      if (inW) {
        if (activeRmIdx !== activeRm) {
          activeRm = activeRmIdx;
          const seg = ROOMS[activeRmIdx];
          if (seg && seg.type === "room") {
            rlNum.textContent = seg.label || "";
            rlName.textContent = seg.name || "";
          }
        }
      }

      // Update Hotspots Opacity based on distance to screen center
      hotspotRefs.current.forEach((hs, i) => {
        if (!hs) return;
        const room = ROOMS[i];
        if (!room.hotspot) return;

        const isStrip1 = i < 6;
        const isStrip2 = i >= 6;
        const currentStrip = p >= 0.65 ? 2 : (p <= 0.55 ? 1 : (activeRmIdx >= 6 ? 2 : 1));

        let fade = 0;
        if (currentStrip === 1 && isStrip1) {
          const hsX = room.nativeX + room.hotspot.rx * 1920;
          const dist = Math.abs(hsX - currentCx) / 960;
          fade = Math.max(0, 1 - dist);
        } else if (currentStrip === 2 && isStrip2) {
          const hsX = room.nativeX + room.hotspot.rx * 1920;
          const dist = Math.abs(hsX - currentCx) / 960;
          fade = Math.max(0, 1 - dist);
        }

        // Apply global exit fade
        fade = fade * (1 - exitFade);

        hs.style.opacity = String(fade);
        hs.classList.toggle("live", fade > 0.25);
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hintGone]);

  const openInfo = (index: number) => {
    setActivePanelIndex(index);
  };

  const closeInfo = () => {
    setActivePanelIndex(null);
  };

  return (
    <>
      <div id="prog" ref={progFillRef}>
        <div id="prog-fill" />
      </div>

      <div id="room-label" ref={roomLabelRef} style={{ top: "32%" }}>
        <div id="rl-num" ref={rlNumRef}>01</div>
        <div id="rl-name" ref={rlNameRef}>Entrance</div>
      </div>

      <div id="dim" ref={dimRef} className={activePanelIndex !== null ? "on" : ""} onClick={closeInfo} />

      <div id="scroll-hint" ref={scrollHintRef}>
        <span className="sh-text">Scroll to walk through</span>
        <div className="sh-line" />
      </div>

      {/* --- Walkthrough Fixed Viewport ------------------------- */}
      <div id="walk-fixed" ref={walkFixedRef}>
        <div id="pano-stage" ref={panoStageRef}>
          <div id="pano" ref={panoRef}>
            {/* Strip 1: Slices 1 to 6 */}
            <div className="pano-strip strip-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/interior_assets/panorama 1.png"
                alt="Panorama Part 1"
                className="pano-img"
                style={{ left: "0vh", width: "648.15vh" }}
                loading="eager"
                fetchPriority="high"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/interior_assets/panorama 2.png"
                alt="Panorama Part 2"
                className="pano-img"
                style={{ left: "631.20vh", width: "333.33vh" }}
                loading="eager"
                fetchPriority="high"
              />
              {ROOMS.slice(0, 6).map((room, ri) => {
                const isRoom = room.type === "room";
                const globalIndex = ri;
                return (
                  <div
                    key={`strip1-overlay-${ri}`}
                    className={`slice ${isRoom ? "room-seg" : "slice-transition"}`}
                    style={{ left: room.left, pointerEvents: "none" }}
                  >
                    {isRoom && (
                      <div className="room-text" style={{ pointerEvents: "auto" }}>
                        <p className="rt-tag">
                          {room.label} &nbsp;/&nbsp; 0{TOTAL_ROOMS}
                        </p>
                        <h2 className="rt-title">{room.name}</h2>
                        <p className="rt-sub">Discover the space &nbsp;&#8599;</p>
                      </div>
                    )}
                    {isRoom && room.hotspot && (
                      <div
                        ref={(el) => {
                          hotspotRefs.current[globalIndex] = el;
                        }}
                        className="hotspot"
                        style={{
                          left: `${room.hotspot.rx * 100}%`,
                          top: `${room.hotspot.ry * 100}%`,
                          pointerEvents: "auto",
                        }}
                        onClick={() => openInfo(globalIndex)}
                      >
                        <div className="hs-ring" />
                        <div className="hs-core">&#9670;</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Strip 2: Slices 7 to 10 */}
            <div className="pano-strip strip-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/interior_assets/panaroma 3.png"
                alt="Panorama Part 3"
                className="pano-img"
                style={{ left: "631.20vh", width: "500vh" }}
                loading="eager"
                fetchPriority="high"
              />
              {ROOMS.slice(6, 10).map((room, ri) => {
                const isRoom = room.type === "room";
                const globalIndex = 6 + ri;
                return (
                  <div
                    key={`strip2-overlay-${ri}`}
                    className={`slice ${isRoom ? "room-seg" : "slice-transition"}`}
                    style={{ left: room.left, pointerEvents: "none" }}
                  >
                    {isRoom && (
                      <div className="room-text" style={{ pointerEvents: "auto" }}>
                        <p className="rt-tag">
                          {room.label} &nbsp;/&nbsp; 0{TOTAL_ROOMS}
                        </p>
                        <h2 className="rt-title">{room.name}</h2>
                        <p className="rt-sub">Discover the space &nbsp;&#8599;</p>
                      </div>
                    )}
                    {isRoom && room.hotspot && (
                      <div
                        ref={(el) => {
                          hotspotRefs.current[globalIndex] = el;
                        }}
                        className="hotspot"
                        style={{
                          left: `${room.hotspot.rx * 100}%`,
                          top: `${room.hotspot.ry * 100}%`,
                          pointerEvents: "auto",
                        }}
                        onClick={() => openInfo(globalIndex)}
                      >
                        <div className="hs-ring" />
                        <div className="hs-core">&#9670;</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- Scroll Spacer to Drive Fixed Viewport Scroll ---- */}
      <div id="walk-spacer" ref={spacerRef} />

      {/* --- Info Panels Layer --------------------------------- */}
      <div id="panels">
        {ROOMS.map((room, ri) => {
          if (!room.info) return null;
          return (
            <div
              key={`panel-${ri}`}
              className={`info-panel ${activePanelIndex === ri ? "open" : ""}`}
            >
              <div className="info-panel-refract" />
              <div className="info-panel-body">
                <button className="ip-close" onClick={closeInfo}>
                  &#x2715;
                </button>
                
                {/* Left Column: Title & Paragraph */}
                <div className="ip-col-left">
                  <div className="ip-bar" />
                  <p className="ip-tag">{room.info.tag}</p>
                  <h2 className="ip-title">{room.info.title}</h2>
                  <p className="ip-body">{room.info.body}</p>
                </div>
                
                {/* Right Column: Key Spec Details */}
                <div className="ip-col-right">
                  <div className="ip-details">
                    {room.info.details.map(([key, val], idx) => (
                      <div key={idx} className="ip-row">
                        <span>{key}</span>
                        <span>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
