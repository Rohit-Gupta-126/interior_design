/**
 * app/page.tsx
 *
 * Main page: assembles the scroll-snap container and maps over
 * the project data to render each ProjectSection.
 *
 * It imports CinematicBackground to display the 3D scroll walkthrough
 * behind the transparent editorial sections on desktop.
 */

import ProjectSection, {
  type ProjectData,
} from "@/components/ProjectSection";
import ProgressNav from "@/components/ProgressNav";
import CinematicBackground from "@/components/CinematicBackground";

/* ══════════════════════════════════════════════════════════════
   PROJECT DATA
   Each entry represents a "keyframe" or space in the single-home walk.
   imageSrc paths are relative to /public.
   ══════════════════════════════════════════════════════════════ */

const projects: ProjectData[] = [
  {
    index: 1,
    id: "exterior-facade",
    category: "The Walkthrough",
    headline: "Exterior",
    headlineAlt: "Facade",
    description:
      "A minimalist brutalist entrance of raw concrete, timber, and towering glass panels. Natural gravel pathways and subtle evening lighting introduce a clean, understated luxury sanctuary.",
    stat: {
      label: "Project Area",
      value: "5,600",
      suffix: "sq ft",
    },
    location: "Dalma Foothills, Jamshedpur",
    year: "2026",
    imageSrc: "/hero_exterior.png",
    imageAlt:
      "Exterior concrete and glass facade of modern minimalist villa",
  },
  {
    index: 2,
    id: "entrance-threshold",
    category: "The Walkthrough",
    headline: "The Pivot",
    headlineAlt: "Threshold",
    description:
      "Crossing the threshold. A massive dark-steel framed oak pivot door swings open silently, offering a warm glimpse into the polished concrete interiors of the home.",
    stat: {
      label: "Door Weight",
      value: "320",
      suffix: "kg",
    },
    location: "Main Foyer, Jamshedpur",
    year: "2026",
    imageSrc: "/hero_entrance.png",
    imageAlt:
      "Slightly open oak pivot door at the entry of the modern villa",
  },
  {
    index: 3,
    id: "minimal-hallway",
    category: "The Walkthrough",
    headline: "The Gallery",
    headlineAlt: "Corridor",
    description:
      "A long, architectural concrete hallway guided by hidden warm LEDs. Floor-to-ceiling glass on one side frames a private courtyard with a single, sculptural olive tree.",
    stat: {
      label: "Corridor Length",
      value: "18",
      suffix: "m",
    },
    location: "West Wing, Jamshedpur",
    year: "2026",
    imageSrc: "/hero_hallway.png",
    imageAlt:
      "Polished concrete hallway with glass facade looking onto olive tree",
  },
  {
    index: 4,
    id: "living-pavilion",
    category: "The Walkthrough",
    headline: "The Hearth",
    headlineAlt: "Pavilion",
    description:
      "Arriving at the heart of the home. The modular charcoal leather sofa and raw concrete walls center around a clean architectural fireplace, open to the backyard garden.",
    stat: {
      label: "Ceiling Height",
      value: "3.8",
      suffix: "m",
    },
    location: "Living Pavilion, Jamshedpur",
    year: "2026",
    imageSrc: "/hero_living_room.png",
    imageAlt:
      "Cozy brutalist living room with low charcoal sofa and garden view",
  },
  {
    index: 5,
    id: "chef-kitchen",
    category: "The Walkthrough",
    headline: "The Culinary",
    headlineAlt: "Studio",
    description:
      "A minimal, clean culinary space featuring a monolithic concrete island, warm light-oak cabinetry, and hidden architectural details. Pure function meets luxury texture.",
    stat: {
      label: "Island Length",
      value: "4.2",
      suffix: "m",
    },
    location: "Living Pavilion, Jamshedpur",
    year: "2026",
    imageSrc: "/hero_kitchen.png",
    imageAlt:
      "Minimalist kitchen island of concrete and light wood custom cabinets",
  },
  {
    index: 6,
    id: "master-bedroom",
    category: "The Walkthrough",
    headline: "Timber",
    headlineAlt: "Sanctuary",
    description:
      "A tranquil master suite wrapped in warm oak paneling. The low-slung platform bed looks out through expansive windows into the private garden trees, creating a quiet retreat.",
    stat: {
      label: "Platform Material",
      value: "Solid Oak",
    },
    location: "East Wing, Jamshedpur",
    year: "2026",
    imageSrc: "/hero_bedroom.png",
    imageAlt:
      "Minimal bedroom platform bed with gray bedding and timber oak paneling",
  },
];

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const sectionIds = projects.map((p) => p.id);

  return (
    <>
      {/* ── Fixed Navigation Header ──────────────────────────── */}
      <header className="site-nav" role="banner">
        <div className="nav-logo">
          ARK<span>A</span>
        </div>
        <p className="nav-tagline">
          Luxury Interiors &nbsp;·&nbsp; Jamshedpur, India
        </p>
        <a
          href="mailto:studio@arkainteriors.in"
          className="nav-enquire"
          aria-label="Contact ARKA Interiors"
        >
          Enquire
        </a>
      </header>

      {/* ── Fixed 3D Cinematic Background Stack ──────────────── */}
      <CinematicBackground />

      {/* ── Scroll-Snap Main Container ───────────────────────── */}
      <main
        id="snap-container"
        className="snap-container"
        role="main"
        aria-label="Portfolio of luxury interior projects"
      >
        {projects.map((project, i) => (
          <ProjectSection
            key={project.id}
            project={project}
            sectionIndex={i}
          />
        ))}
      </main>

      {/* ── Fixed Side Progress Navigation ───────────────────── */}
      <ProgressNav sectionIds={sectionIds} />
    </>
  );
}
