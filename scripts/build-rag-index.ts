/**
 * Builds the assistant's retrieval index from Velite output.
 *
 * Chunks every content collection (projects, research, blog, resume facts,
 * about, FAQ) into overlapping passages with source metadata, and writes
 * public/rag-index.json. New content is picked up automatically on the next
 * build. When GOOGLE_GENERATIVE_AI_API_KEY is present, chunks are embedded with
 * Gemini text-embedding-004 for vector search; otherwise the index still works
 * with lexical BM25 retrieval at request time.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const veliteDir = join(root, ".velite");
// Emitted as an importable module so it is bundled into serverless/edge
// functions on any host (Vercel, Cloudflare, etc.) rather than read from disk
// at runtime, which Workers do not support and Vercel does not reliably trace.
const outPath = join(root, "src", "lib", "ai", "rag-index.generated.json");

type Chunk = {
  id: string;
  title: string;
  url: string;
  source: string;
  text: string;
  embedding?: number[];
};

function readJson<T>(name: string): T[] {
  const path = join(veliteDir, name);
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf8")) as T[];
}

/** Split text into ~900-char passages on paragraph boundaries, with overlap. */
function chunkText(text: string, maxLen = 900): string[] {
  const paras = text
    .replace(/```[\s\S]*?```/g, " ") // drop code fences from retrieval text
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 40);

  const chunks: string[] = [];
  let buf = "";
  for (const para of paras) {
    if ((buf + " " + para).length > maxLen && buf) {
      chunks.push(buf.trim());
      // small overlap: carry the tail sentence
      const tail = buf.split(". ").slice(-1)[0];
      buf = tail.length < 200 ? tail + " " + para : para;
    } else {
      buf = buf ? buf + " " + para : para;
    }
  }
  if (buf.trim().length > 40) chunks.push(buf.trim());
  return chunks;
}

type Doc = { title: string; url?: string; raw: string; slug?: string };

function collect(): Chunk[] {
  const chunks: Chunk[] = [];
  const push = (source: string, title: string, url: string, raw: string) => {
    chunkText(raw).forEach((text, i) => {
      chunks.push({ id: `${source}:${title}:${i}`, title, url, source, text });
    });
  };

  for (const p of readJson<Doc & { url: string }>("projects.json")) {
    push("project", p.title, p.url, p.raw);
  }
  for (const p of readJson<Doc & { url: string; restricted?: boolean; teaser?: string }>(
    "publications.json",
  )) {
    // Restricted (in-preparation) papers: index only the public teaser, never
    // the raw abstract/methods/results/name from the body.
    push("research", p.title, p.url, p.restricted ? p.teaser ?? "" : p.raw);
  }
  for (const p of readJson<Doc & { url: string; draft?: boolean }>("posts.json")) {
    if (p.draft) continue; // drafts aren't public; keep them out of the assistant
    push("blog", p.title, p.url, p.raw);
  }
  for (const d of readJson<Doc & { href?: string }>("docs.json")) {
    push(d.title.includes("Resume") ? "resume" : "about", d.title, (d as { href?: string }).href ?? "/about", d.raw);
  }
  return chunks;
}

async function embedAll(chunks: Chunk[], apiKey: string): Promise<void> {
  const model = "text-embedding-004";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
  let ok = 0;
  for (const chunk of chunks) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: `models/${model}`,
          content: { parts: [{ text: chunk.text }] },
        }),
      });
      if (!res.ok) continue;
      const json = await res.json();
      const values = json?.embedding?.values;
      if (Array.isArray(values)) {
        chunk.embedding = values;
        ok += 1;
      }
    } catch {
      // leave this chunk lexical-only
    }
  }
  console.log(`[rag] embedded ${ok}/${chunks.length} chunks`);
}

async function main() {
  mkdirSync(join(root, "src", "lib", "ai"), { recursive: true });
  const chunks = collect();

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (apiKey && chunks.length > 0) {
    console.log("[rag] embedding chunks with Gemini text-embedding-004...");
    await embedAll(chunks, apiKey);
  } else {
    console.log("[rag] no embedding key; index will use lexical BM25 retrieval");
  }

  const hasEmbeddings = chunks.some((c) => c.embedding);
  writeFileSync(
    outPath,
    JSON.stringify({ version: 1, hasEmbeddings, chunks }),
    "utf8",
  );
  console.log(`[rag] wrote ${chunks.length} chunks -> src/lib/ai/rag-index.generated.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
