"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ShaderVariant } from "@/lib/hero-variants";

// Keep the three.js bundle off each page's critical path; only load after we've
// decided to actually render WebGL.
const ShaderHeroCanvas = dynamic(() => import("./shader-hero-canvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * Aurora shader backdrop with the same guardrails as the neural field: a static
 * gradient fallback under prefers-reduced-motion, on WebGL failure, or before
 * mount, plus a lite DPR tier for small/low-memory devices and a frameloop that
 * pauses off-screen.
 */
export function ShaderHero({
  variant,
  fallback,
  className,
}: {
  variant: ShaderVariant;
  fallback: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "on" | "fallback">("pending");
  const [dprMax, setDprMax] = useState(1.4);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("fallback");
      return;
    }
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lite =
      window.innerWidth < 820 ||
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
      window.matchMedia("(pointer: coarse)").matches;
    setDprMax(lite ? 1.0 : 1.4);
    setMode("on");
  }, []);

  useEffect(() => {
    if (mode !== "on" || !wrapRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, [mode]);

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      {/* Static fallback, always painted; the canvas fades in over it. */}
      <div className="absolute inset-0" style={{ background: fallback }} />
      {mode === "on" && (
        <ShaderHeroCanvas
          variant={variant}
          dprMax={dprMax}
          inView={inView}
          onContextLost={() => setMode("fallback")}
        />
      )}
    </div>
  );
}
