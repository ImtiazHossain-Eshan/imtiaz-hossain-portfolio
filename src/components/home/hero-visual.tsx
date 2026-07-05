"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { NeuralField } from "@/components/three/neural-field";

/**
 * Scroll-reactive shell around the neural field. As the hero scrolls away the
 * field pushes forward and dissolves, so the section reads as depth the page
 * falls through rather than a flat backdrop that just slides off. The field
 * itself keeps all its own quality/reduced-motion/WebGL-loss handling.
 */
export function HeroVisual({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.12]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        <NeuralField className="absolute inset-0" />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, scale, y, willChange: "transform, opacity" }}
    >
      <NeuralField className="absolute inset-0" />
    </motion.div>
  );
}
