import { streamText, type ModelMessage } from "ai";
import { getModel, embedQuery, assistantEnabled, resolveProvider } from "@/lib/ai/provider";
import { retrieve } from "@/lib/ai/retrieval";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Best-effort per-IP sliding-window limiter (per warm function instance). */
const WINDOW_MS = 60_000;
const MAX_REQ = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // crude memory guard
  return arr.length > MAX_REQ;
}

const SYSTEM = `You are the portfolio assistant for Imtiaz Hossain, an AI Engineer and researcher.

Rules:
- Answer ONLY using the provided CONTEXT passages about Imtiaz's work. Do not use outside knowledge about him.
- If the context does not contain the answer, reply exactly: "I don't have verified information about that yet."
- Be concise, technical, and conversational. Prefer specifics (metrics, tech, decisions) over generalities.
- When you use a passage, cite it inline with its bracketed number, like [1] or [2].
- After answering, if relevant, suggest one related project or topic the visitor could ask about next.
- Never invent metrics, employers, publications, or links. Never claim Imtiaz did something not in the context.
- Speak about Imtiaz in the third person.`;

type ClientMessage = { role: "user" | "assistant"; content: string };

function plainText(text: string) {
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Citations": "[]" },
  });
}

/** Greetings and filler get a friendly nudge, not the refusal line. */
const SMALL_TALK =
  /^(hi+|hey+|hello+|hellow+|yo|sup|hmm+|huh|ok(ay)?|thanks?|thank you|test(ing)?|what\??|why\??|cool|nice|wow)[\s!.?]*$/i;

const GREETING_REPLY =
  "Hey! I'm the assistant for Imtiaz's portfolio, grounded in his projects, research, and experience. " +
  'Ask me something specific, for example: "Tell me about BRACU Vault", ' +
  '"Explain the brain tumor segmentation project", or "What\'s his experience with NLP?"';

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "rate_limited", message: "Too many questions in a short time. Please slow down." },
      { status: 429 },
    );
  }

  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-8);
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser || lastUser.content.trim().length < 2) {
    return Response.json({ error: "empty_query" }, { status: 400 });
  }
  const query = lastUser.content.slice(0, 1000);

  // Small talk never needs the model or retrieval; answer it even offline.
  if (SMALL_TALK.test(query.trim())) {
    return plainText(GREETING_REPLY);
  }

  if (!assistantEnabled()) {
    return Response.json(
      {
        error: "offline",
        message:
          "The AI assistant is not configured. Set AI_PROVIDER and the matching API key to enable it.",
      },
      { status: 503 },
    );
  }

  // Retrieve grounding context (hybrid when embeddings + key available).
  const queryEmbedding = await embedQuery(query);
  const chunks = retrieve(query, queryEmbedding, 6);

  if (chunks.length === 0) {
    return plainText(
      "I don't have verified information about that yet. Try asking about one of " +
        "Imtiaz's projects (BRACU Vault, Polaris, brain tumor segmentation), his " +
        "research, or his skills and experience.",
    );
  }

  const context = chunks
    .map((c, i) => `[${i + 1}] (${c.source}: ${c.title})\n${c.text}`)
    .join("\n\n");

  const citations = chunks.map((c, i) => ({
    n: i + 1,
    title: c.title,
    url: c.url,
    source: c.source,
  }));

  const model = getModel()!;
  // AI SDK v7: the system prompt goes in `instructions`, never in messages.
  const modelMessages: ModelMessage[] = [
    ...messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content }) as ModelMessage),
    {
      role: "user",
      content: `CONTEXT:\n${context}\n\nQUESTION: ${query}\n\nAnswer using only the context above, citing sources inline like [1].`,
    },
  ];

  const result = streamText({
    model,
    instructions: SYSTEM,
    messages: modelMessages,
    temperature: 0.3,
    maxOutputTokens: 700,
  });

  // Stream manually so a provider failure (bad key, retired model id, quota)
  // becomes a readable message instead of an empty bubble that hangs forever.
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let emitted = false;
      try {
        for await (const delta of result.textStream) {
          emitted = true;
          controller.enqueue(encoder.encode(delta));
        }
        if (!emitted) {
          controller.enqueue(
            encoder.encode(
              "The model returned an empty response. Please try again in a moment.",
            ),
          );
        }
      } catch (err) {
        console.error("[assistant] provider stream error:", err);
        controller.enqueue(
          encoder.encode(
            emitted
              ? "\n\n(The response was cut off by a provider error. Please try again.)"
              : "The AI provider rejected the request (this usually means the API key or model id needs updating). Please try again later.",
          ),
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Citations": encodeURIComponent(JSON.stringify(citations)),
      "X-Provider": resolveProvider(),
    },
  });
}

export async function GET() {
  return Response.json({ enabled: assistantEnabled(), provider: resolveProvider() });
}
