import Link from "next/link";
import { NeuralField } from "@/components/three/neural-field";
import { Magnetic } from "@/components/motion/magnetic";
import { site } from "@/lib/site";

const roles = ["Computer Vision", "NLP", "Deep Learning", "Research", "Production Systems"];

/** Real numbers, surfaced immediately. Each traces to a result file. */
const telemetry = [
  { label: "case studies", value: "14" },
  { label: "best test dice", value: "88.22%" },
  { label: "nlp experiments", value: "27" },
  { label: "infra cost", value: "$0/mo" },
];

/** Server-rendered hero: headline paints and animates with zero JS. */
export function Hero() {
  const words = [
    { text: "I", serif: false },
    { text: "build", serif: false },
    { text: "intelligent", serif: true },
    { text: "systems.", serif: false },
  ];

  return (
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
      <NeuralField className="absolute inset-0" />

      {/* Readability scrims: strong on the left where the copy lives,
          light elsewhere so the field still breathes. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(7,8,10,0.92) 0%, rgba(7,8,10,0.62) 34%, rgba(7,8,10,0.12) 62%, rgba(7,8,10,0) 78%)," +
            "linear-gradient(to bottom, rgba(7,8,10,0.6) 0%, rgba(7,8,10,0) 22%, rgba(7,8,10,0) 55%, rgba(7,8,10,0.94) 100%)",
        }}
      />

      <div className="wrap relative z-10 flex flex-1 flex-col justify-center pb-16 pt-32">
        <p
          className="hero-fade mb-8 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.16em] text-dim"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-good" aria-hidden />
          {site.name} / {site.location} / open to research &amp; roles
        </p>

        <h1
          aria-label={site.tagline}
          className="max-w-5xl text-[clamp(2.9rem,8.5vw,7rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink"
        >
          {words.map((word, i) => (
            <span key={word.text} aria-hidden className="hero-mask mr-[0.24em] last:mr-0">
              <span
                className={
                  "hero-word" + (word.serif ? " font-display italic font-normal text-accent" : "")
                }
                style={{ animationDelay: `${0.25 + i * 0.09}s` }}
              >
                {word.text}
              </span>
            </span>
          ))}
        </h1>

        <div
          className="hero-fade mt-9 flex max-w-2xl flex-wrap gap-2"
          style={{ animationDelay: "0.85s" }}
        >
          {roles.map((role) => (
            <span
              key={role}
              className="rounded-full border border-line-bright bg-bg/60 px-3.5 py-1.5 font-mono text-[12px] text-ink/90 backdrop-blur-sm"
            >
              {role}
            </span>
          ))}
        </div>

        <div
          className="hero-fade mt-11 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "1.05s" }}
        >
          <Magnetic>
            <Link
              href="/projects"
              data-cursor-label="enter"
              className="inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-bg transition-colors duration-300 hover:bg-accent"
            >
              Explore the lab
              <span aria-hidden>&rarr;</span>
            </Link>
          </Magnetic>
          <Link
            href="/playground"
            className="rounded-full border border-line-bright bg-bg/60 px-6 py-3.5 text-[15px] text-ink backdrop-blur-sm transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Try the AI playground
          </Link>
        </div>
      </div>

      {/* Telemetry strip: instant proof, lab-instrument style. */}
      <div className="hero-fade relative z-10 border-t border-line/70" style={{ animationDelay: "1.3s" }}>
        <div className="wrap grid grid-cols-2 gap-x-8 gap-y-4 py-6 md:flex md:items-center md:justify-between">
          {telemetry.map((item) => (
            <div key={item.label} className="flex items-baseline gap-3">
              <span className="font-mono text-xl text-ink md:text-2xl">{item.value}</span>
              <span className="label-mono">{item.label}</span>
            </div>
          ))}
          <span className="label-mono hidden items-center gap-2 md:flex">
            scroll
            <span className="block h-6 w-px overflow-hidden bg-line-bright">
              <span className="scroll-cue block h-full w-full bg-accent" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
