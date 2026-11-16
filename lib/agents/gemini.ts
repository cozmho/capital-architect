import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3-flash-preview";
const API_TIMEOUT_MS = 15000;

export function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  return key;
}

export async function callGemini(
  prompt: string,
  systemPrompt: string,
  model: string = DEFAULT_MODEL,
  maxTokens = 4096,
): Promise<string> {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const responsePromise = ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.3,
      topP: 0.9,
      maxOutputTokens: maxTokens,
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error("Gemini request timed out"));
    }, API_TIMEOUT_MS);
  });

  const response = await Promise.race([responsePromise, timeoutPromise]);
  return (response as { text?: string | null }).text ?? "";
}

export function extractJson(text: string): string {
  const trimmed = text.trim();

  try {
    JSON.parse(trimmed);
    return trimmed;
  } catch {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        JSON.parse(jsonMatch[0]);
        return jsonMatch[0];
      } catch {
        // fall through
      }
    }
    throw new Error(`No valid JSON found in response: ${trimmed.slice(0, 200)}`);
  }
}

export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  retries = 1,
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error("Unexpected retry exit");
}
