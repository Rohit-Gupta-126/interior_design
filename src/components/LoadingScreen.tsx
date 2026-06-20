"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Fill the loader progress bar after mount
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 80);

    // Fade out loader after 1.9 seconds, matching HTML setTimeout
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      // Wait for transition duration before removing from DOM
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 700);
      return () => clearTimeout(removeTimer);
    }, 1900);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      id="loader"
      style={{
        transition: "opacity 0.7s ease",
        opacity: isFading ? 0 : 1,
      }}
    >
      <div id="loader-name">VORA</div>
      <div id="loader-sub">Interior Design Studio</div>
      <div id="lbar-w">
        <div id="lbar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
