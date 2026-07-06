import type { Metadata } from "next";
import Link from "next/link";
import { publications } from "#velite";
import { MDXContent } from "@/components/mdx/mdx-content";
import { BibtexBlock } from "@/components/research/bibtex-block";
import { LabPlate } from "@/components/playground/lab-plate";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research on biometric privacy, generative editing, and computer vision, presented in the style of a research lab publication page.",
};

export default function ResearchPage() {
  const jsonLd = publications.map((pub) => ({
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: pub.title,
    // Restricted papers expose only the short teaser in structured data.
    abstract: pub.restricted ? pub.teaser ?? "" : pub.abstract,
    author: pub.authors.map((name) => ({ "@type": "Person", name })),
    datePublished: String(pub.year),
    ...(pub.restricted ? {} : { keywords: pub.keywords.join(", ") }),
    inLanguage: "en",
  }));

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        preset="research"
        kicker={`research / ${publications.length} publication`}
        title="Research notebook."
      >
        <p className="max-w-2xl text-lg leading-relaxed text-dim">
          Work in progress and in preparation. Some of it stays under wraps while the papers are
          being written — figures and a short summary here, the full account on publication. My
          complete record lives on{" "}
          <a
            href={site.links.scholar}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4"
          >
            Google Scholar
          </a>
          .
        </p>
      </PageHero>

      {publications.map((pub) => (
        <article key={pub.slug} id={pub.slug} className="wrap mt-20 scroll-mt-28">
          <div className="border-t border-line pt-12">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-accent/30 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
                {pub.status.replace("-", " ")}
              </span>
              <span className="label-mono">
                {pub.venue} / {pub.year}
              </span>
            </div>

            <h2 className="max-w-4xl text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
              {pub.title}
            </h2>
            <p className="mt-4 text-sm text-dim">{pub.authors.join(", ")}</p>

            {pub.restricted ? (
              <>
                {/* Teaser only — the abstract, body, keywords, and citation are
                    withheld while the paper is in preparation. */}
                <Reveal className="mt-8">
                  <p className="max-w-2xl text-[15px] leading-relaxed text-dim">
                    {pub.teaser ??
                      "Details for this working paper are withheld while it is in preparation."}
                  </p>
                </Reveal>

                {pub.figures.length > 0 && (
                  <section className="mt-12" aria-label="Figures">
                    <div className="grid gap-5 sm:grid-cols-2">
                      {pub.figures.map((fig, i) => (
                        <LabPlate
                          key={fig.src}
                          figure={{
                            src: fig.src,
                            caption: `fig. ${String(i + 1).padStart(2, "0")}`,
                            plate: true,
                          }}
                        />
                      ))}
                    </div>
                  </section>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <p className="label-mono text-faint">
                    full paper in preparation — methods &amp; results on publication
                  </p>
                  {pub.links.scholar && (
                    <a
                      href={pub.links.scholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-mono text-accent underline underline-offset-4 transition-colors hover:text-ink"
                    >
                      Google Scholar ↗
                    </a>
                  )}
                </div>
              </>
            ) : (
              <>
                {pub.keywords.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {pub.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-faint"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Abstract */}
                <Reveal className="mt-10">
                  <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
                    <div>
                      <p className="label-mono mb-3">abstract</p>
                      <p className="max-w-2xl text-[15px] leading-relaxed text-dim">
                        {pub.abstract}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="label-mono">links</p>
                      <div className="flex flex-col gap-2">
                        {pub.pdf && (
                          <a
                            href={pub.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-line-bright px-4 py-2.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
                          >
                            Read the PDF ↗
                          </a>
                        )}
                        {pub.links.code && (
                          <a
                            href={pub.links.code}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-line-bright px-4 py-2.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
                          >
                            Code ↗
                          </a>
                        )}
                        {pub.links.scholar && (
                          <a
                            href={pub.links.scholar}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-line-bright px-4 py-2.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
                          >
                            Google Scholar ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Figures */}
                {pub.figures.length > 0 && (
                  <section className="mt-14" aria-label="Figures">
                    <p className="label-mono mb-6">figures</p>
                    <div className="space-y-5">
                      {pub.figures.map((fig, i) => (
                        <LabPlate
                          key={fig.src}
                          figure={{ src: fig.src, caption: `fig. ${i + 1} / ${fig.caption}`, plate: true }}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Body */}
                <div className="prose-lab mt-14 max-w-3xl">
                  <MDXContent code={pub.content} />
                </div>

                {/* Citation */}
                <section className="mt-14 max-w-3xl" aria-label="Citation">
                  <p className="label-mono mb-4">cite this work</p>
                  <BibtexBlock bibtex={pub.bibtex} slug={pub.slug} />
                </section>
              </>
            )}
          </div>
        </article>
      ))}

      {/* Related */}
      <div className="wrap mt-24">
        <Link
          href="/playground"
          data-cursor-label="explore"
          className="group block rounded-xl border border-line bg-surface/50 px-8 py-10 transition-colors duration-300 hover:border-line-bright md:px-12"
        >
          <p className="label-mono mb-3">applied work</p>
          <p className="text-3xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-4xl">
            See the models in the playground <span aria-hidden>&rarr;</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
