"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Peak tilt in degrees at the corners. */
  max?: number;
  /** Show the accent light that tracks the cursor. */
  glare?: boolean;
  /** Match the wrapped card's corner radius so the glare clips cleanly. */
  radiusClass?: string;
};

/**
 * Pointer-reactive 3D tilt for discrete cards. The card leans toward the cursor
 * on a spring and a soft accent glare tracks the pointer; both settle home on
 * leave. Mouse-only, and a plain div under reduced motion / touch.
 */
export function TiltCard({
  children,
  className,
  max = 7,
  glare = true,
  radiusClass = "rounded-xl",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 22, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 220, damping: 22, mass: 0.5 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  const glareOpacity = useMotionValue(0);
  const glareO = useSpring(glareOpacity, { stiffness: 200, damping: 30 });
  const glareBg = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(124,223,255,0.18), transparent 55%)`,
  );

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
        glareOpacity.set(1);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
        glareOpacity.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("relative [transform-style:preserve-3d]", className)}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className={cn("pointer-events-none absolute inset-0 z-10", radiusClass)}
          style={{ background: glareBg, opacity: glareO }}
        />
      )}
    </motion.div>
  );
}
