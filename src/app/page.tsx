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
    id: "fall-line-house",
    category: "Living Spaces",
    headline: "Fall Line",
    headlineAlt: "House",
    description:
      "A cantilevered concrete masterpiece projecting over a forest waterfall. Frameless glass facade frames the wild landscape, bringing raw nature into a warm, amber-lit sanctuary.",
    stat: {
      label: "Project Area",
      value: "5,200",
      suffix: "sq ft",
    },
    location: "Dalma Foothills, Jamshedpur",
    year: "2025",
    imageSrc: "/hero_exterior.png",
    imageAlt:
      "Cantilevered brutalist house exterior suspended over a waterfall in Jamshedpur",
  },
  {
    index: 2,
    id: "the-hearth",
    category: "Living Spaces",
    headline: "The Hearth",
    headlineAlt: "Living",
    description:
      "Inside the main cantilever. High-volume raw concrete ceilings frame a low-slung dark leather conversation pit, centered by an amber-lit fireplace that reflects off the deep forest shadows.",
    stat: {
      label: "Ceiling Height",
      value: "4.2",
      suffix: "m",
    },
    location: "Main Pavilion, Jamshedpur",
    year: "2025",
    imageSrc: "/hero_living_room.png",
    imageAlt:
      "Minimalist brutalist living room with low-slung furniture and concrete ceilings",
  },
  {
    index: 3,
    id: "the-gallery",
    category: "Materials & Craft",
    headline: "The Gallery",
    headlineAlt: "Corridor",
    description:
      "A glass-walled corridor hovering directly above the rushing torrent. Here, steel pivot doors and polished dark concrete establish an uncompromising threshold between wild water and architectural order.",
    stat: {
      label: "Material Variants",
      value: "9",
      suffix: "selected",
    },
    location: "Waterfall Deck, Jamshedpur",
    year: "2025",
    imageSrc: "/material_detail.png",
    imageAlt:
      "Glass-walled corridor with raw concrete and steel doors overlooking a waterfall",
  },
  {
    index: 4,
    id: "the-threshold",
    category: "Architecture",
    headline: "The Threshold",
    headlineAlt: "Transitions",
    description:
      "A hallway where opposites form a tense, luxury dialogue. The cold texture of sandblasted concrete meets the warm, glowing grain of aged timber paneling, guided by hidden amber light channels.",
    stat: {
      label: "Linear Metres",
      value: "42",
      suffix: "m",
    },
    location: "Main Gallery, Jamshedpur",
    year: "2024–2025",
    imageSrc: "/corridor_flow.png",
    imageAlt:
      "Brutalist interior hallway showing contrast between concrete and wood panels",
  },
  {
    index: 5,
    id: "timber-study",
    category: "Zen Features",
    headline: "Timber",
    headlineAlt: "Study",
    description:
      "The private study room—a deep, sound-insulated sanctuary clad entirely in rich cedar wood, centering on a black slate zen water feature with glowing underwater amber ripples.",
    stat: {
      label: "Wood Type",
      value: "Aged Cedar",
    },
    location: "Private Suite, Jamshedpur",
    year: "2025",
    imageSrc: "/zen_water_feature.png",
    imageAlt:
      "Private library study with timber walls and a black slate zen water feature",
  },
  {
    index: 6,
    id: "still-waters",
    category: "Zen Features",
    headline: "Still",
    headlineAlt: "Waters",
    description:
      "A close-up look at where sound becomes silence. A black slate water basin with custom underwater amber-lit ripples transforms the study into a meditative space. Brutalist. Expensive. Tranquil.",
    stat: {
      label: "Feature Weight",
      value: "1.8",
      suffix: "tonnes",
    },
    location: "Private Suite, Jamshedpur",
    year: "2025",
    imageSrc: "/zen_water_feature.png",
    imageAlt:
      "Macro close-up details of warm amber ripples on a black slate zen water basin",
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
