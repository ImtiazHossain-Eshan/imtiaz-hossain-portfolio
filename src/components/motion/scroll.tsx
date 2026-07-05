"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A hairline scroll-progress meter pinned to the top of the viewport. Springs
 * toward the true progress so it feels weighted rather than mechanical.
 * Renders nothing under reduced motion.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[95] h-px origin-left bg-gradient-to-r from-accent-deep via-accent to-transparent"
      style={{ scaleX, willChange: "transform" }}
    />
  );
}

type ParallaxProps = {
  children: ReactNode;
  /**
   * Travel as a fraction of the element's own height. Positive drifts the
   * content slower than the page (recedes); negative overtakes it. ~0.15–0.4
   * reads as depth without feeling detached.
   */
  speed?: number;
  className?: string;
};

/**
 * Vertical parallax. The wrapped content shifts as the element crosses the
 * viewport, borrowing the page's real (Lenis-smoothed) scroll position.
 * Collapses to a plain div under reduced motion.
 */
export function Parallax({ children, speed = 0.28, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const pct = speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`${pct}%`, `${-pct}%`]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y, willChange: "transform" }}>{children}</motion.div>
    </div>
  );
}

/**
 * Scroll-scrubbed reveal: opacity, rise, and a whisper of scale tied directly
 * to the element's entrance progress, so the motion tracks the scroll wheel
 * instead of firing once. Great for section headers and figures.
 */
export function ScrollScrub({
  children,
  className,
  rise = 60,
}: {
  children: ReactNode;
  className?: string;
  rise?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.42"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [rise, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ opacity, y, scale, willChange: "transform, opacity" }}>
        {children}
      </motion.div>
    </div>
  );
}
