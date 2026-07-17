import type { Metadata } from "next";
import { resume } from "@/lib/resume";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume and CV of Imtiaz Hossain, an AI engineer and researcher focused on computer vision, NLP, deep learning, and full-stack systems.",
};

export default function ResumePage() {
  return (
    <div className="pb-24 pt-36 md:pt-44">
      <div className="wrap no-print mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-mono mb-4">resume / cv</p>
          <h1 className="text-4xl font-medium tracking-tight text-ink sm:text-5xl">Resume</h1>
        </div>
        <a
          href="/resume/imtiaz-hossain-resume.pdf"
          download
          className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-bg transition-colors duration-300 hover:bg-accent"
        >
          Download PDF
        </a>
      </div>

      <div className="wrap">
        <article className="mx-auto max-w-4xl rounded-sm border border-line bg-[#fffdfa] p-7 text-[#171717] md:p-12">
          <header className="border-b border-[#cfcfc8] pb-5">
            <h2 className="text-3xl font-semibold tracking-tight text-[#111]">{resume.name}</h2>
            <p className="mt-1 text-[15px] font-medium text-[#174a63]">{resume.title}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[#444]">
              <span>{resume.location}</span>
              <a className="underline-offset-2 hover:underline" href={`tel:${resume.phone.replace(/\s/g, "")}`}>
                {resume.phone}
              </a>
              <a className="underline-offset-2 hover:underline" href={`mailto:${resume.email}`}>
                {resume.email}
              </a>
              <a className="underline-offset-2 hover:underline" href={resume.links.portfolio}>
                {clean(resume.links.portfolio)}
              </a>
              <a className="underline-offset-2 hover:underline" href={resume.links.github}>
                GitHub
              </a>
              <a className="underline-offset-2 hover:underline" href={resume.links.linkedin}>
                LinkedIn
              </a>
              <a className="underline-offset-2 hover:underline" href={resume.links.scholar}>
                Google Scholar
              </a>
            </div>
          </header>

          <Section title="Summary">
            <p>{resume.summary}</p>
          </Section>

          <Section title="Technical Skills">
            <dl className="space-y-3">
              {resume.skills.map((skill) => (
                <div key={skill.group} className="grid gap-1 text-[13px] sm:grid-cols-[12rem_1fr]">
                  <dt className="font-semibold text-[#222]">{skill.group}</dt>
                  <dd>
                    <ul className="space-y-1">
                      {skill.lines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Research Experience">
            <ExperienceList entries={resume.researchExperience} />
          </Section>

          <Section title="Selected Engineering Projects">
            <ExperienceList entries={resume.engineeringProjects} />
          </Section>

          <Section title="Additional Projects">
            <ul className="space-y-2">
              {resume.additionalProjects.map((project) => (
                <li key={project.name}>
                  <span className="font-semibold text-[#111]">{project.name}:</span>{" "}
                  {project.description}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Research Output">
            {resume.research.map((research) => (
              <div key={research.title}>
                <p className="font-semibold text-[#111]">{research.title}</p>
                <p className="text-[#555]">
                  {research.venue}, {research.year}. {research.note}
                </p>
              </div>
            ))}
          </Section>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Section title="Education" flush>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-semibold text-[#111]">{resume.education.degree}</p>
                <span className="text-[12px] text-[#555]">{resume.education.period}</span>
              </div>
              <p className="font-medium text-[#174a63]">{resume.education.school}</p>
              <p className="text-[#555]">
                {resume.education.location} - {resume.education.detail}
              </p>
              <p className="mt-1">
                Relevant coursework: {resume.education.coursework.join(", ")}.
              </p>
            </Section>
            <Section title="Teaching & Leadership" flush>
              <div className="space-y-3">
                {resume.teachingAndLeadership.map((item) => (
                  <div key={item.role}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-semibold text-[#111]">{item.role}</p>
                      <span className="text-[12px] text-[#555]">{item.period}</span>
                    </div>
                    <p className="font-medium text-[#174a63]">{item.org}</p>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Section title="Honors" flush>
              <ul className="list-disc space-y-1 pl-5">
                {resume.honors.map((honor) => (
                  <li key={honor}>{honor}</li>
                ))}
              </ul>
            </Section>
            <Section title="Certifications" flush>
              <ul className="list-disc space-y-1 pl-5">
                {resume.certifications.map((certification) => (
                  <li key={certification.title}>
                    {certification.title} - {certification.issuer}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </article>
      </div>
    </div>
  );
}

function ExperienceList({
  entries,
}: {
  entries: ReadonlyArray<{
    role: string;
    org: string;
    period: string;
    bullets: readonly string[];
  }>;
}) {
  return (
    <div className="space-y-5">
      {entries.map((entry) => (
        <div key={`${entry.role}-${entry.org}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h4 className="text-[14px] font-semibold text-[#111]">{entry.role}</h4>
            <span className="text-[12px] text-[#555]">{entry.period}</span>
          </div>
          <p className="text-[12.5px] font-medium text-[#174a63]">{entry.org}</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  children,
  flush,
}: {
  title: string;
  children: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <section className={flush ? "" : "mt-6"}>
      <h3 className="mb-2.5 border-b border-[#cfcfc8] pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-[#174a63]">
        {title}
      </h3>
      <div className="text-[13px] leading-relaxed text-[#333]">{children}</div>
    </section>
  );
}

function clean(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
