import type { Metadata } from "next";
import Link from "next/link";
import { DomainExplorer } from "@/components/about/domain-explorer";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Imtiaz Hossain is an AI Engineer and researcher at BRAC University working across computer vision, NLP, deep learning, systems, and production platforms.",
};

const certifications = [
  { title: "Understanding Machine Learning", issuer: "DataCamp", href: "/assets/certificates/understanding-machine-learning.pdf" },
  { title: "Data Manipulation in Python", issuer: "DataCamp", href: "/assets/certificates/data-manipulation-in-python.pdf" },
  { title: "Cleaning Data in Python", issuer: "DataCamp", href: "/assets/certificates/cleaning-data-in-python.pdf" },
];

const facts = [
  { label: "based in", value: site.location },
  { label: "university", value: `${site.university}, CSE` },
  { label: "cgpa", value: site.cgpa },
  { label: "focus", value: "AI · CV · NLP · Research" },
];

export default function AboutPage() {
  return (
    <div className="pb-24">
      <PageHero
        preset="about"
        kicker="about / the person behind the lab"
        title="I build intelligent systems, and I show my work."
        titleClassName="text-4xl leading-[1.08] sm:text-6xl"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <p className="max-w-2xl text-lg leading-relaxed text-dim">
            I am an AI Engineer and researcher at {site.university}, working across computer
            vision, NLP, deep learning, systems programming, cloud, and game development. What
            connects all of it is a bias toward evidence: I would rather report a model&apos;s
            honest ceiling than dress up a number. The eight facets below each link to the
            projects, demos, and papers that back them up.
          </p>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-1">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface px-5 py-4">
                <dt className="label-mono mb-1">{f.label}</dt>
                <dd className="text-sm text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </PageHero>

      {/* Domain explorer */}
      <section className="wrap mt-20" aria-label="Areas of work">
        <Reveal>
          <p className="label-mono mb-6">eight facets / expand to explore</p>
        </Reveal>
        <DomainExplorer />
      </section>

      {/* Certifications */}
      <section className="wrap mt-20" aria-label="Certifications">
        <p className="label-mono mb-6">certifications</p>
        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {certifications.map((cert) => (
            <a
              key={cert.title}
              href={cert.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-surface px-6 py-6 transition-colors duration-300 hover:bg-raised"
            >
              <p className="label-mono mb-3 text-accent/70">{cert.issuer}</p>
              <p className="text-[15px] font-medium text-ink transition-colors group-hover:text-accent">
                {cert.title}
              </p>
              <p className="mt-3 text-xs text-faint">View certificate ↗</p>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="wrap mt-24">
        <Link
          href="/resume"
          data-cursor-label="read"
          className="group block rounded-xl border border-line bg-surface/50 px-8 py-10 transition-colors duration-300 hover:border-line-bright md:px-12"
        >
          <p className="label-mono mb-3">the formal record</p>
          <p className="text-3xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-4xl">
            Read the resume and CV <span aria-hidden>&rarr;</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
