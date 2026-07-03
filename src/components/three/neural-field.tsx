"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { FieldQuality } from "./neural-field-scene";

// Lazy-load the Canvas so the ~800KB three.js bundle stays off the homepage's
// critical path. It only loads after mount, once we've decided to render 3D.
const NeuralFieldCanvas = dynamic(() => import("./neural-field-canvas"), {
  ssr: false,
  loading: () => null,
});

const DESKTOP: FieldQuality = { points: 560, maxEdges: 1400, pulses: 14 };
const LITE: FieldQuality = { points: 300, maxEdges: 700, pulses: 8 };

/**
 * The living neural network behind the hero. Renders a static ambient fallback
 * under prefers-reduced-motion, on WebGL failure, or before mount (so the
 * headline's LCP never waits on the canvas). Rendering pauses off-screen.
 */
export function NeuralField({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "on" | "fallback">("pending");
  const [quality, setQuality] = useState<FieldQuality>(DESKTOP);
  const [dprMax, setDprMax] = useState(1.75);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMode("fallback");
      return;
    }
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lite =
      window.innerWidth < 820 ||
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
      window.matchMedia("(pointer: coarse)").matches;
    setQuality(lite ? LITE : DESKTOP);
    setDprMax(lite ? 1.25 : 1.5);
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
      {/* Ambient fallback: always painted, canvas fades in over it. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 62% 42%, rgba(124,223,255,0.075), transparent 65%)," +
            "radial-gradient(ellipse 45% 40% at 30% 62%, rgba(124,223,255,0.05), transparent 70%)",
        }}
      />
      {mode === "on" && (
        <NeuralFieldCanvas
          quality={quality}
          dprMax={dprMax}
          inView={inView}
          onContextLost={() => setMode("fallback")}
        />
      )}
    </div>
  );
}
