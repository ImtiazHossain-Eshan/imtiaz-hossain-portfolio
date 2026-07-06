import { defineCollection, defineConfig, s } from "velite";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";

/**
 * Typed content collections. Every collection carries `raw` so the RAG
 * indexer can chunk plain source text without re-parsing MDX.
 */

const gallery = s.array(s.object({ src: s.string(), caption: s.string() }));

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      slug: s.slug("projects"),
      category: s.enum(["ai", "fullstack", "systems", "games"]),
      tagline: s.string(),
      summary: s.string(),
      /** Coerced: bare years in YAML arrive as numbers. */
      period: s.coerce.string(),
      /** Lower = earlier on the homepage; anything <= 6 is featured. */
      featured: s.number().default(99),
      status: s.enum(["live", "shipped", "research", "coursework"]).default("shipped"),
      cover: s.string().optional(),
      /** Optional YouTube walkthrough (facade-embedded for fast loads). */
      video: s.object({ id: s.string(), title: s.string() }).optional(),
      gallery: gallery.default([]),
      stack: s.array(s.string()).default([]),
      links: s
        .object({
          github: s.string().optional(),
          live: s.string().optional(),
          paper: s.string().optional(),
          demo: s.string().optional(),
        })
        .default({}),
      metrics: s
        .array(s.object({ label: s.string(), value: s.string(), detail: s.string().optional() }))
        .default([]),
      timeline: s.array(s.object({ label: s.string(), detail: s.string() })).default([]),
      /** Grid-positioned nodes for the interactive architecture diagram. */
      architecture: s
        .array(
          s.object({
            id: s.string(),
            label: s.string(),
            sub: s.string().optional(),
            col: s.number(),
            row: s.number(),
            to: s.array(s.string()).default([]),
          }),
        )
        .default([]),
      toc: s.toc(),
      metadata: s.metadata(),
      raw: s.raw(),
      content: s.mdx(),
    })
    .transform((data) => ({ ...data, url: `/projects/${data.slug}` })),
});

const publications = defineCollection({
  name: "Publication",
  pattern: "research/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      slug: s.slug("research"),
      authors: s.array(s.string()),
      venue: s.string(),
      year: s.number(),
      status: s.enum(["published", "under-review", "preprint", "in-progress"]),
      abstract: s.string(),
      bibtex: s.string(),
      pdf: s.string().optional(),
      links: s
        .object({
          code: s.string().optional(),
          doi: s.string().optional(),
          scholar: s.string().optional(),
        })
        .default({}),
      figures: gallery.default([]),
      keywords: s.array(s.string()).default([]),
      /** When true, the research page shows only a teaser + figures — the
          abstract, body, keywords, and citation are withheld (paper in prep). */
      restricted: s.boolean().default(false),
      /** Short public description shown in place of the abstract when restricted. */
      teaser: s.string().optional(),
      raw: s.raw(),
      content: s.mdx(),
    })
    .transform((data) => ({ ...data, url: `/research#${data.slug}` })),
});

const posts = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      slug: s.slug("posts"),
      date: s.isodate(),
      draft: s.boolean().default(true),
      tags: s.array(s.string()).default([]),
      summary: s.string(),
      cover: s.string().optional(),
      /** Related project slugs. */
      related: s.array(s.string()).default([]),
      toc: s.toc(),
      metadata: s.metadata(),
      raw: s.raw(),
      content: s.mdx(),
    })
    .transform((data) => ({ ...data, url: `/blog/${data.slug}` })),
});

/** Free-form facts, FAQ entries, and about copy that feed the RAG index. */
const docs = defineCollection({
  name: "Doc",
  pattern: "site/**/*.md",
  schema: s.object({
    title: s.string(),
    slug: s.slug("docs"),
    kind: s.enum(["fact", "faq", "about", "resume"]),
    /** Where a citation for this doc should send the visitor. */
    href: s.string().default("/about"),
    raw: s.raw(),
    content: s.markdown(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { projects, publications, posts, docs },
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "vesper", keepBackground: false }],
      rehypeKatex,
    ],
  },
});
