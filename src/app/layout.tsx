/**
 * app/layout.tsx
 *
 * Root layout: loads Cormorant Garamond (editorial serif) and DM Sans
 * (clean UI sans-serif) via next/font/google using CSS variable injection.
 * Sets the global metadata and applies the near-black background.
 */

import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./vora.css";
import LoadingScreen from "@/components/LoadingScreen";

/* ── Cormorant Garamond — editorial heading font ── */
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
});

/* ── Inter — clean, minimal UI font ── */
const inter = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VORA — Interior Design Studio",
  description:
    "VORA is a boutique interior design practice working across India. We design for the way you actually live.",
  keywords: [
    "VORA",
    "interior design",
    "boutique studio",
    "bespoke spaces",
    "minimalist design",
    "India",
  ],
  openGraph: {
    title: "VORA — Interior Design Studio",
    description: "We design for the way you actually live.",
    type: "website",
  },
};

import CustomCursor from "@/components/CustomCursor";
import LiquidGlassFilters from "@/components/LiquidGlassFilters";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      /* Inject both font CSS variables onto the <html> element so
         they are available everywhere via var(--font-cormorant) etc. */
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body>
        <LoadingScreen />
        <CustomCursor />
        <LiquidGlassFilters />
        {children}
      </body>
    </html>
  );
}
