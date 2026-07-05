import type { Metadata } from "next";
import Link from "next/link";
import { demoConfigs } from "@/lib/playground/demos";
import { playgroundEntries } from "@/lib/playground/registry";
import { PageHero } from "@/components/layout/page-hero";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";

export const metadata: Metadata = {
  title: "AI Playground",
  description:
    "Interactive demonstrations of trained AI models: brain tumor segmentation, AI-text detection, news classification, and software quality prediction. Real outputs, real metrics.",
};

export default function PlaygroundPage() {
  return (
    <>
      <PageHero
        preset="playground"
        kicker={`the playground / ${demoConfigs.length} experiments`}
        title="A working AI laboratory."
      >
        <p className="max-w-2xl text-lg leading-relaxed text-dim">
          Every experiment here runs on authentic outputs from models I trained, with the exact
          metrics from the result files. Segment a tumor, probe a text detector, or trace 27
          experiments in a single grid. Nothing is fabricated, and the architecture is built so a
          live inference endpoint can be swapped in later without changing a single screen.
        </p>
      </PageHero>
      <div className="wrap pb-28">
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
        {playgroundEntries.map((entry) => (
          <RevealItem key={entry.slug}>
            <TiltCard className="h-full">
            <Link
              href={`/playground/${entry.slug}`}
              data-cursor-label="open experiment"
              className="group flex h-full flex-col justify-between gap-12 rounded-xl border border-line bg-surface p-8 transition-colors duration-300 hover:border-line-bright hover:bg-raised"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <span className="label-mono">{entry.labId}</span>
                  <span className="label-mono text-accent/70">{entry.domain}</span>
                </div>
                <h2 className="text-2xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
                  {entry.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-dim">{entry.summary}</p>
              </div>
              <div className="flex items-end justify-between border-t border-line pt-5">
                <div>
                  <p className="label-mono mb-1">{entry.metric.label}</p>
                  <p className="font-mono text-3xl text-ink">{entry.metric.value}</p>
                </div>
                <span
                  aria-hidden
                  className="text-dim transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                >
                  &rarr;
                </span>
              </div>
            </Link>
            </TiltCard>
          </RevealItem>
        ))}
        </RevealGroup>
      </div>
    </>
  );
}
