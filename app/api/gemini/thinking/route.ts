// cspell:ignore genai
import {
  GoogleGenAI,
  ThinkingLevel as GeminiThinkingLevel,
  type ThinkingConfig
} from "@google/genai";
import { NextResponse } from "next/server";

type ThinkingLevelInput = "minimal" | "low" | "medium" | "high";

type GeminiThinkingRequest = {
  prompt?: string;
  model?: string;
  includeThoughts?: boolean;
  thinkingLevel?: ThinkingLevelInput;
  thinkingBudget?: number;
};

const DEFAULT_MODEL = "gemini-3-flash-preview";

function isGemini3Model(model: string): boolean {
  return model.startsWith("gemini-3") || model.startsWith("gemini-3.");
}

function toGeminiThinkingLevel(level: ThinkingLevelInput): GeminiThinkingLevel {
  switch (level) {
    case "minimal":
      return GeminiThinkingLevel.MINIMAL;
    case "low":
      return GeminiThinkingLevel.LOW;
    case "medium":
      return GeminiThinkingLevel.MEDIUM;
    case "high":
    default:
      return GeminiThinkingLevel.HIGH;
  }
}

function extractThoughtSummaries(response: unknown): string[] {
  const maybeResponse = response as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string; thought?: boolean }>;
      };
    }>;
  };

  const parts = maybeResponse.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((part) => Boolean(part.text) && part.thought)
    .map((part) => part.text as string);
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY" },
      { status: 500 }
    );
  }

  let payload: GeminiThinkingRequest;
  try {
    payload = (await request.json()) as GeminiThinkingRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const prompt = payload.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const model = payload.model?.trim() || DEFAULT_MODEL;
  const includeThoughts = Boolean(payload.includeThoughts);

  const thinkingConfig: ThinkingConfig = {};

  if (includeThoughts) {
    thinkingConfig.includeThoughts = true;
  }

  if (isGemini3Model(model)) {
    if (payload.thinkingLevel) {
      thinkingConfig.thinkingLevel = toGeminiThinkingLevel(payload.thinkingLevel);
    }
  } else if (payload.thinkingBudget !== undefined) {
    thinkingConfig.thinkingBudget = payload.thinkingBudget;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig,
      },
    });

    return NextResponse.json({
      model,
      text: response.text,
      thoughtSummaries: includeThoughts ? extractThoughtSummaries(response) : [],
      usage: response.usageMetadata ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
