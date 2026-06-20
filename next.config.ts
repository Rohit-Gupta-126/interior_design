/**
 * next.config.ts
 *
 * Next.js 16 configuration.
 * - reactCompiler: enabled (pre-existing)
 * - images.qualities: REQUIRED in Next.js 16. Without this, the
 *   image optimisation API returns 400 for any quality value.
 *   We allow the quality range used in our components (85).
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    /* Next.js 16 requires an explicit qualities allowlist.
       We use quality={85} in ProjectSection.tsx, so 85 must be included. */
    qualities: [25, 50, 75, 85, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
