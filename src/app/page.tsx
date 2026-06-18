/**
 * app/page.tsx
 *
 * Main page: assembles the scroll-snap container and maps over
 * the project data to render each ProjectSection.
 *
 * This is a Server Component (no "use client" directive) since it
 * just renders static markup. The interactive bits (ProjectSection,
 * ProgressNav) are Client Components and are imported here.
 *
 * Data is typed with the ProjectData interface from ProjectSection.
 */

import ProjectSection, {
  type ProjectData,
} from "@/components/ProjectSection";
import ProgressNav from "@/components/ProgressNav";

/* ══════════════════════════════════════════════════════════════
   PROJECT DATA
   Each entry renders one 100vh snap section.
   imageSrc paths are relative to /public.
   ══════════════════════════════════════════════════════════════ */

const projects: ProjectData[] = [
  {
    index: 1,
    id: "living-penthouse",
    category: "Living Spaces",
    headline: "Steel City",
    headlineAlt: "Penthouse",
    description:
      "A Jamshedpur penthouse where the Dalma hills meet extreme luxury. Near-black textured walls frame amber-lit bespoke woodwork — industrial heritage, refined into restraint.",
    stat: {
      label: "Project Area",
      value: "4,800",
      suffix: "sq ft",
    },
    location: "Jamshedpur, Jharkhand",
    year: "2025",
    imageSrc: "/hero_living_room.png",
    imageAlt:
      "Luxury dark living room with warm amber backlit woodwork in a Jamshedpur penthouse",
  },
  {
    index: 2,
    id: "material-study",
    category: "Materials & Craft",
    headline: "Concrete",
    headlineAlt: "& Grain",
    description:
      "The vocabulary of luxury lives in tactile contrast. Raw charcoal concrete meets the warmth of polished amber grain. Every surface chosen for how it feels, not just how it looks.",
    stat: {
      label: "Material Variants",
      value: "27",
      suffix: "selected",
    },
    location: "Material Library, ARKA Studio",
    year: "2024–2025",
    imageSrc: "/material_detail.png",
    imageAlt:
      "Macro photograph of dark charcoal concrete meeting polished amber wood grain",
  },
  {
    index: 3,
    id: "flow-corridor",
    category: "Architecture",
    headline: "The Flow",
    headlineAlt: "Corridor",
    description:
      "A brutalist hallway that breathes. Floor-to-ceiling glass on one side; dark steel panels honoring Jamshedpur's foundry heritage on the other. Amber track lighting guides the journey.",
    stat: {
      label: "Linear Metres",
      value: "38",
      suffix: "m",
    },
    location: "Jubilee Park Estate, Jamshedpur",
    year: "2024",
    imageSrc: "/corridor_flow.png",
    imageAlt:
      "Cinematic interior corridor with floor-to-ceiling glass and dark steel panels",
  },
  {
    index: 4,
    id: "zen-water",
    category: "Zen Features",
    headline: "Still",
    headlineAlt: "Waters",
    description:
      "Where sound becomes silence. A black slate water feature with amber-lit ripples transforms a private residence into a sanctuary. Heavy. Expensive. Tranquil.",
    stat: {
      label: "Feature Weight",
      value: "2.4",
      suffix: "tonnes",
    },
    location: "Sonari Enclave, Jamshedpur",
    year: "2025",
    imageSrc: "/zen_water_feature.png",
    imageAlt:
      "Luxury interior water feature with black slate and warm amber underwater lighting",
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
          className="editorial-overline"
          style={{ textDecoration: "none" }}
          aria-label="Contact ARKA Interiors"
        >
          Enquire
        </a>
      </header>

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
