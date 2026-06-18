/**
 * app/layout.tsx
 *
 * Root layout: loads Cormorant Garamond (editorial serif) and DM Sans
 * (clean UI sans-serif) via next/font/google using CSS variable injection.
 * Sets the global metadata and applies the near-black background.
 */

import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

/* ── Cormorant Garamond — editorial heading font ── */
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
});

/* ── DM Sans — clean, minimal UI font ── */
const dmSans = DM_Sans({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "ARKA Interiors — Luxury Interior Design, Jamshedpur",
  description:
    "ARKA Interiors creates bespoke luxury living spaces in Jamshedpur and across India. Where industrial heritage meets extreme refinement.",
  keywords: [
    "luxury interior design",
    "Jamshedpur",
    "bespoke interiors",
    "high-end architecture",
    "interior designer India",
  ],
  openGraph: {
    title: "ARKA Interiors — Luxury Interior Design, Jamshedpur",
    description: "Bespoke luxury interiors for those who demand the extraordinary.",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      /* Inject both font CSS variables onto the <html> element so
         they are available everywhere via var(--font-cormorant) etc. */
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
