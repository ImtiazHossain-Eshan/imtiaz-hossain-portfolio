"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Route-level entrance transition. Re-mounts on every navigation: the page
 * lifts in while a thin electric-ice scanline sweeps down the viewport, so each
 * navigation reads like an instrument taking a fresh reading. Collapses to a
 * plain render under reduced motion.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[85] h-px bg-gradient-to-r from-transparent via-accent to-transparent"
        initial={{ y: 0, opacity: 0.85 }}
        animate={{ y: "100vh", opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.5, 0, 0.2, 1] }}
      />
    </>
  );
}
