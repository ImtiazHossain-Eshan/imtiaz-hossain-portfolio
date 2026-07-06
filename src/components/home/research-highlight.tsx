import Link from "next/link";
import Image from "next/image";
import { publications } from "#velite";
import { Reveal } from "@/components/motion/reveal";

/** Teaser for the flagship publication, styled like a journal plate. */
export function ResearchHighlight() {
  const pub = publications[0];
  if (!pub) return null;

  // Restricted (in-preparation) papers show only the teaser + a neutral caption
  // here too, so the homepage never re-exposes what /research withholds.
  const summarySource = pub.restricted && pub.teaser ? pub.teaser : pub.abstract;
  const summary =
    summarySource.length > 340 ? summarySource.slice(0, 340).trimEnd() + "…" : summarySource;
  const cover = pub.figures[0];
  const coverCaption = pub.restricted ? "fig. 01" : cover?.caption ?? "figure";

  return (
    <section className="wrap py-28 md:py-36" aria-labelledby="research-heading">
      <Reveal>
        <p className="label-mono mb-4">03 / research</p>
      </Reveal>
      <div className="grid gap-10 md:grid-cols-12 md:gap-14">
        <Reveal className="md:col-span-7">
          <h2
            id="research-heading"
            className="text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl"
          >
            {pub.title}
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-dim">{summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-accent/30 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
              {pub.status.replace("-", " ")}
            </span>
            <span className="label-mono">
              {pub.venue} / {pub.year}
            </span>
          </div>
          <Link
            href="/research"
            data-cursor-label="read"
            className="mt-10 inline-block rounded-full border border-line-bright px-6 py-3 text-sm text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Read the publication &rarr;
          </Link>
        </Reveal>
        {cover && (
          <Reveal delay={0.15} className="md:col-span-5">
            <figure className="overflow-hidden rounded-xl border border-line bg-surface">
              <Image
                src={cover.src}
                alt={coverCaption}
                width={1100}
                height={800}
                sizes="(max-width: 768px) 100vw, 40vw"
                className="h-auto w-full"
              />
              <figcaption className="label-mono px-4 py-3">{coverCaption}</figcaption>
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  );
}
