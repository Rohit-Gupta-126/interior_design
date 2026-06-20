# VORA — Interior Design Studio

VORA is a bespoke, premium digital showcase for a boutique interior design practice working across India. Designed for the way you actually live, the website combines top-tier minimalism, smooth animations, and advanced front-end rendering techniques.

---

## 💎 Premium Design & Technical Features

### 1. Apple Liquid Glass Refraction
Instead of standard CSS glassmorphism, the website implements a custom SVG displacement filter bank (`LiquidGlassFilters.tsx`) that mimics physical optics.
* **Optical Refraction**: Uses `<feTurbulence>` and `<feDisplacementMap>` to warp and displace background pixels at panel edges.
* **Chromatic Aberration**: Simulates light dispersing through glass with soft prismatic color fringes.
* **Catch-Light Rim Highlights**: Employs complex CSS inner-shadow configurations and gradients to capture light along top-left bevels.

### 2. 3D Panoramic Walkthrough
An interactive horizontal and vertical panoramic showcase that guides the user through various interior spaces (Entrance Hall, Living Room, Materials Library, Floating Staircase, etc.).
* **Steadicam mouse tilt**: Visual elements tilt gently in response to mouse movement.
* **Reactive camera yaw**: Sleek parallax effects simulate camera rotation based on scroll acceleration.
* **Proximity Hotspots & Callouts**: Floating glass cards highlight key details when rooms align with the center of the screen.

### 3. Custom Touch Scroll Engine (Mobile & Tablet)
Fixed fullscreen viewports on mobile devices often suffer from WebKit/Blink scroll-blocking bugs due to pointer event capturing.
* **Manual Scroll Injection**: A custom gesture handler tracks vertical swipes and manually scrolls the window via `window.scrollBy`.
* **Exclusion Targets**: Links, form inputs, textareas, and close buttons are excluded from interception to maintain 100% native tapping functionality.
* **Exponential Decelerating Inertia**: Implements natural momentum physics on finger release (`touchend`) to keep touch scrolling feeling incredibly premium and responsive.

### 4. Interactive Typography & Motion
* **Sophisticated Pairings**: Cormorant Garamond (editorial serif), Inter (clean UI sans-serif), and Orbitron (technological sans for the wordmark).
* **Responsive Capsule Navigation**: Floating capsule nav bar that expands into a full mobile drawer menu on smaller viewports.

---

## 📂 Project Structure

```bash
interior_design/
├── public/                     # Static assets
│   └── interior_assets/        # High-res panorama slices, room images, and facade panels
├── src/
│   ├── app/
│   │   ├── fonts/              # Local optimized custom woff2 typography files
│   │   ├── layout.tsx          # Root layout loading custom fonts and global indicators
│   │   ├── page.tsx            # Home page sections, enquiry forms, and intersection observers
│   │   └── vora.css            # Global design token systems (refractions, grids, keyframes)
│   └── components/
│       ├── CustomCursor.tsx    # Smooth trailing cursor dot + ring follower (disabled on touch)
│       ├── LiquidGlassFilters.tsx # Custom SVG displacement filters bank (Lens warping)
│       ├── LoadingScreen.tsx   # Screen-wide entrance loading bar and fadeout screen
│       ├── PanoramicWalkthrough.tsx # 3D Panoramic segment engine + global momentum touch scroll
│       └── Tilt.tsx            # Mouse-guided 3D perspective card rotation component
├── package.json                # Project dependencies and workspace scripts
└── tsconfig.json               # TypeScript compiler rules
```

---

## 🛠️ Tech Stack & Scripts

* **Framework**: [Next.js](https://nextjs.org/) (App Router)
* **Core**: React 19, TypeScript
* **Styling**: Vanilla CSS (maximum control, optimized inside `vora.css`)

### Development & Build Commands

First, install the project dependencies:
```bash
npm install
```

Then, use the following scripts:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs the development server on `http://localhost:3000` |
| `npm run build` | Compiles the production bundle |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint analysis across the codebase |
| `npm run typecheck` | Validates TypeScript compilation (`tsc --noEmit`) |
