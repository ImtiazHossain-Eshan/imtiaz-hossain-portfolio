import type { Metadata } from "next";
import { projects } from "#velite";
import { ProjectIndex } from "@/components/projects/project-index";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies across AI research, computer vision, NLP, full-stack platforms, systems programming, and games.",
};

export default function ProjectsPage() {
  const rows = [...projects]
    .sort((a, b) => a.featured - b.featured || a.title.localeCompare(b.title))
    .map((p) => ({
      slug: p.slug,
      url: p.url,
      title: p.title,
      tagline: p.tagline,
      category: p.category,
      period: p.period,
      status: p.status,
      cover: p.cover,
      featured: p.featured,
    }));

  return (
    <>
      <PageHero
        preset="projects"
        kicker={`the logbook / ${rows.length} entries`}
        title="Every system tells a story."
      />
      <div className="wrap pb-28">
        <ProjectIndex projects={rows} />
      </div>
    </>
  );
}
