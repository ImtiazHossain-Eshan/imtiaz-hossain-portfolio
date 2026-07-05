import Image from "next/image";
import Link from "next/link";
import { projects } from "#velite";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/scroll";
import { fig } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Editorial, alternating case-study rows. Pulls the featured projects
 * (featured <= 6) from the content layer.
 */
export function SelectedWork() {
  const featured = [...projects]
    .filter((p) => p.featured <= 6)
    .sort((a, b) => a.featured - b.featured);

  if (featured.length === 0) return null;

  return (
    <section className="wrap py-28 md:py-36" aria-labelledby="selected-work-heading">
      <Reveal>
        <div className="mb-16 flex items-end justify-between gap-6 md:mb-24">
          <div>
            <p className="label-mono mb-4">01 / selected work</p>
            <h2
              id="selected-work-heading"
              className="text-4xl font-medium tracking-tight text-ink sm:text-5xl"
            >
              Systems that <em className="font-display italic text-accent">shipped</em>
            </h2>
          </div>
          <Link
            href="/projects"
            className="label-mono hidden shrink-0 border-b border-line pb-1 transition-colors hover:border-accent hover:text-ink md:block"
          >
            all projects &rarr;
          </Link>
        </div>
      </Reveal>

      <div className="space-y-24 md:space-y-32">
        {featured.map((project, i) => {
          const reversed = i % 2 === 1;
          return (
            <Reveal key={project.slug}>
              <Link
                href={project.url}
                data-cursor-label="case study"
                className="group grid items-center gap-8 md:grid-cols-12 md:gap-12"
              >
                <Parallax
                  speed={0.07}
                  className={cn("md:col-span-7", reversed && "md:order-2")}
                >
                  <div className="relative overflow-hidden rounded-xl border border-line bg-surface">
                    {project.cover && (
                      <Image
                        src={project.cover}
                        alt={`${project.title} interface`}
                        width={1280}
                        height={800}
                        sizes="(max-width: 768px) 100vw, 58vw"
                        className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                        priority={i === 0}
                      />
                    )}
                    <span className="label-mono absolute left-4 top-4 rounded-full border border-line-bright bg-bg/70 px-3 py-1 backdrop-blur-sm">
                      fig. {fig(i + 1)} / {project.category}
                    </span>
                  </div>
                </Parallax>

                <div className={cn("md:col-span-5", reversed && "md:order-1")}>
                  <p className="label-mono mb-3 text-accent/80">
                    {project.period}
                    {project.status === "live" && " / live"}
                  </p>
                  <h3 className="text-3xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-dim">
                    {project.tagline}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-faint"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="mt-8 inline-block text-sm text-dim transition-colors duration-300 group-hover:text-ink">
                    Read the case study &rarr;
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-16 md:hidden">
        <Link href="/projects" className="label-mono border-b border-line pb-1">
          all projects &rarr;
        </Link>
      </div>
    </section>
  );
}
