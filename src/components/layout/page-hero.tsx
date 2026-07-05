import type { ReactNode } from "react";
import { ShaderHero } from "@/components/three/shader-hero";
import { TextReveal } from "@/components/motion/text-reveal";
import { heroPresets } from "@/lib/hero-variants";
import { cn } from "@/lib/utils";

/**
 * Shared page header: an aurora shader backdrop (tuned per page) under a
 * readability scrim, with the kicker + masked headline that every inner page
 * already used. Keeps the copy server-rendered for LCP; only the WebGL layer is
 * client + lazy. Children flow beneath the headline (description, facts, etc.).
 */
export function PageHero({
  preset,
  kicker,
  title,
  titleClassName,
  children,
}: {
  preset: keyof typeof heroPresets;
  kicker: string;
  title: string;
  titleClassName?: string;
  children?: ReactNode;
}) {
  const { variant, fallback } = heroPresets[preset];

  return (
    <header className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <ShaderHero variant={variant} fallback={fallback} className="absolute inset-0" />
        {/* Scrim: keep the copy legible while letting the aurora breathe. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(7,8,10,0.62) 0%, rgba(7,8,10,0.28) 42%, rgba(7,8,10,0.9) 100%)",
          }}
        />
      </div>

      <div className="wrap pb-14 pt-36 md:pb-20 md:pt-44">
        <p className="label-mono mb-5">{kicker}</p>
        <h1
          className={cn(
            "max-w-4xl text-5xl font-medium tracking-tight text-ink sm:text-6xl",
            titleClassName,
          )}
        >
          <TextReveal text={title} immediate />
        </h1>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
