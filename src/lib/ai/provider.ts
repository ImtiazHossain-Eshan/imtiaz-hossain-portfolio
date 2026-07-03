import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";

/**
 * Provider registry. `AI_PROVIDER` selects the backend; each provider reads its
 * own key from the environment. Returns null when the selected provider has no
 * key, so the assistant can present an offline state instead of erroring.
 */
export type ProviderName = "gemini" | "openrouter" | "groq";

export function resolveProvider(): ProviderName {
  const raw = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  if (raw === "openrouter" || raw === "groq") return raw;
  return "gemini";
}

export function getModel(): LanguageModel | null {
  const provider = resolveProvider();

  if (provider === "gemini") {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return null;
    return createGoogleGenerativeAI({ apiKey })(
      process.env.AI_MODEL || "gemini-2.5-flash",
    );
  }

  if (provider === "groq") {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;
    return createGroq({ apiKey })(process.env.AI_MODEL || "llama-3.3-70b-versatile");
  }

  // openrouter (OpenAI-compatible)
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return createOpenAICompatible({
    name: "openrouter",
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  })(process.env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct");
}

export function assistantEnabled(): boolean {
  return getModel() !== null;
}

/**
 * Embeds a query with Gemini text-embedding-004 when a Google key is present,
 * matching the index build. Returns undefined otherwise (lexical-only search).
 */
export async function embedQuery(text: string): Promise<number[] | undefined> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return undefined;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] },
        }),
      },
    );
    if (!res.ok) return undefined;
    const json = await res.json();
    const values = json?.embedding?.values;
    return Array.isArray(values) ? values : undefined;
  } catch {
    return undefined;
  }
}
