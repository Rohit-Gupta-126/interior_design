export default function LiquidGlassFilters() {
  return (
    <svg
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        {/* Nav / floating elements: gentle lens warp */}
        <filter
          id="lg-lens"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65 0.65"
            numOctaves={1}
            seed={2}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={4}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          {/* Chromatic aberration: shift R channel slightly */}
          <feColorMatrix
            in="displaced"
            type="matrix"
            values="1.008 0 0 0 -0.004
                    0 1   0 0  0
                    0 0 0.994 0 0.003
                    0 0 0     1 0"
            result="chromatic"
          />
          <feComposite in="chromatic" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Cards: slightly stronger warp for visible refraction */}
        <filter
          id="lg-lens-card"
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55 0.55"
            numOctaves={1}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={5.5}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          {/* Prismatic color fringe at glass boundary */}
          <feColorMatrix
            in="displaced"
            type="matrix"
            values="1.012 0     0     0 -0.006
                    0     1.0   0     0  0
                    0     0     0.991 0  0.005
                    0     0     0     1  0"
            result="chromatic"
          />
          <feComposite in="chromatic" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Side panel: vertical lens with stronger distortion at edges */}
        <filter
          id="lg-lens-panel"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.45 0.35"
            numOctaves={1}
            seed={13}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={6}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feColorMatrix
            in="displaced"
            type="matrix"
            values="1.010 0 0     0 -0.005
                    0 1.0 0     0  0
                    0 0   0.993 0  0.004
                    0 0   0     1  0"
            result="chromatic"
          />
          <feComposite in="chromatic" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
