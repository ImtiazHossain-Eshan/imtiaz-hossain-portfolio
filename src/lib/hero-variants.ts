/**
 * Look presets for the aurora shader hero. Colours are theme hexes (parsed as
 * sRGB by three); params tune the flow so each page reads as a distinct
 * signature while staying inside the one-accent brand. `fallback` is the static
 * gradient painted under reduced motion, before mount, or on WebGL failure.
 */
export type ShaderVariant = {
  colorA: string;
  colorB: string;
  /** Spatial frequency of the flow — higher = finer filaments. */
  scale: number;
  /** Time multiplier for the drift. */
  speed: number;
  /** Opacity ceiling of the aurora over the page background. */
  intensity: number;
};

export type HeroPreset = { variant: ShaderVariant; fallback: string };

const glow = (a: string, b: string) =>
  `radial-gradient(ellipse 62% 55% at 28% 32%, ${a}, transparent 62%),` +
  `radial-gradient(ellipse 52% 60% at 82% 18%, ${b}, transparent 66%)`;

export const heroPresets = {
  projects: {
    variant: { colorA: "#7cdfff", colorB: "#2cb8e8", scale: 1.0, speed: 1.0, intensity: 0.9 },
    fallback: glow("rgba(124,223,255,0.10)", "rgba(44,184,232,0.08)"),
  },
  research: {
    variant: { colorA: "#7cdfff", colorB: "#7ce8b8", scale: 1.35, speed: 0.8, intensity: 0.85 },
    fallback: glow("rgba(124,223,255,0.09)", "rgba(124,232,184,0.07)"),
  },
  about: {
    variant: { colorA: "#7cdfff", colorB: "#ffd48a", scale: 0.85, speed: 0.7, intensity: 0.8 },
    fallback: glow("rgba(124,223,255,0.09)", "rgba(255,212,138,0.06)"),
  },
  playground: {
    variant: { colorA: "#8be6ff", colorB: "#7ce8b8", scale: 1.15, speed: 1.3, intensity: 0.95 },
    fallback: glow("rgba(139,230,255,0.10)", "rgba(124,232,184,0.08)"),
  },
} satisfies Record<string, HeroPreset>;
