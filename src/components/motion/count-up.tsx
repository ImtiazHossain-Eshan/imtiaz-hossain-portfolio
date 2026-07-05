"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Splits "88.22%" / "$0/mo" / "14" into an animatable numeric core plus its
 * literal prefix and suffix, preserving decimal precision.
 */
function parse(value: string) {
  const m = value.match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
  if (!m) return null;
  const numStr = m[2].replace(/,/g, "");
  return {
    prefix: m[1],
    suffix: m[3],
    target: parseFloat(numStr),
    decimals: numStr.includes(".") ? numStr.split(".")[1].length : 0,
  };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Odometer-style count-up that fires once the number scrolls into view. SSR
 * renders the final value (correct with JS off and for hydration), then the
 * client rolls it up from zero. Static under reduced motion.
 */
export function CountUp({
  value,
  className,
  duration = 1.7,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const parsed = parse(value);
    if (reduced || !parsed) {
      setDisplay(value);
      return;
    }
    const { prefix, suffix, target, decimals } = parsed;
    if (!inView) {
      setDisplay(`${prefix}${(0).toFixed(decimals)}${suffix}`);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const current = target * easeOutCubic(t);
      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
