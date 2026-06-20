/**
 * app/layout.tsx
 *
 * Root layout: loads Cormorant Garamond (editorial serif), Inter
 * (clean UI sans-serif), and Orbitron for the VORA wordmark.
 */

import type { Metadata } from "next";
import localFont from "next/font/local";
import CustomCursor from "@/components/CustomCursor";
import LiquidGlassFilters from "@/components/LiquidGlassFilters";
import LoadingScreen from "@/components/LoadingScreen";
import "./vora.css";

const cormorant = localFont({
  src: [
    {
      path: "./fonts/cormorant-garamond-regular-latin.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "./fonts/cormorant-garamond-italic-latin.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-cormorant",
});

const inter = localFont({
  src: [
    {
      path: "./fonts/inter-latin.woff2",
      weight: "300 600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-inter",
});

const orbitron = localFont({
  src: [
    {
      path: "./fonts/orbitron-latin.woff2",
      weight: "400 900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "VORA - Interior Design Studio",
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
    title: "VORA - Interior Design Studio",
    description: "We design for the way you actually live.",
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
      className={`${cormorant.variable} ${inter.variable} ${orbitron.variable}`}
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
