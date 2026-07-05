"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Keeps GSAP ScrollTrigger locked to Lenis's smoothed scroll position. Lives
 * inside the ReactLenis provider so `useLenis` can subscribe to scroll ticks.
 */
function ScrollTriggerBridge() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

/**
 * Lenis smooth scroll at the document root, bridged to GSAP ScrollTrigger so
 * scroll-scrubbed timelines and pins ride the exact same smoothed position.
 * A single animation loop drives everything: GSAP's ticker steps Lenis
 * (autoRaf off), Lenis's scroll event steps ScrollTrigger.
 *
 * Disabled wholesale under prefers-reduced-motion so native scrolling and its
 * accessibility affordances stay intact.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    // Read the instance off the ref each frame so there is no mount-order race.
    const step = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(step);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(step);
    };
  }, [reduced]);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{ lerp: 0.12, wheelMultiplier: 0.9, autoRaf: false }}
      ref={lenisRef}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
