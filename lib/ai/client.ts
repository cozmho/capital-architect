/**
 * lib/ai/client.ts — Unified AI client with provider fallback.
 *
 * Supports:
 *  - Gemini (direct via @google/genai)
 *  - OpenAI-compatible via gateway (primary), OpenRouter (fallback)
 *
 * Provider selection via AI_PROVIDER env var.
 * Usage:
 *   AI_PROVIDER=gemini → uses GEMINI_API_KEY directly
 *   AI_PROVIDER=openai-compatible → routes through OPENAI_BASE_URL → OpenRouter if needed
 */

import { GoogleGenAI } from '@google/genai';

const DEFAULT_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-3-flash-preview';
const API_TIMEOUT_MS = 30000;
const MAX_OUTPUT_TOKENS = 4096;

// ============================================================================
// PROVIDER CONFIGURATION
// ============================================================================

export type AiProvider = 'gemini' | 'openai-compatible';

/**
 * OpenAI-compatible gateway configuration.
 * Reads from environment variables — set in .env:
 *   OPENAI_BASE_URL  — gateway base URL (e.g. FreeLLM http://127.0.0.1:31415/v1)
 *   OPENAI_API_KEY   — gateway API key
 *   OPENROUTER_API_KEY — optional fallback key (https://openrouter.ai/settings/api-keys)
 */
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL?.trim() || 'http://127.0.0.1:31415/v1';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim() || '';

const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL?.trim() || 'https://openrouter.ai/api/v1';

// ============================================================================
// TYPES
// ============================================================================

export interface AiRequest {
  prompt: string;
  systemPrompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  json?: boolean; // if true, parse response as JSON
}

export interface AiResponse {
  text: string;
  model: string;
  tokensUsed?: number;
}

// ============================================================================
// GEMINI CLIENT
// ============================================================================

let _geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (_geminiClient) return _geminiClient;
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error('GEMINI_API_KEY is not configured');
  _geminiClient = new GoogleGenAI({ apiKey: key });
  return _geminiClient;
}

// ============================================================================
// OPENAI-COMPATIBLE CLIENT (raw fetch)
// ============================================================================

interface OpenAiChatRequest {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

interface OpenAiChatResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: { message?: string; type?: string };
}

async function callOpenAiCompatible(
  baseClientUrl: string,
  apiKey: string,
  request: AiRequest,
  model: string,
  timeoutMs: number = API_TIMEOUT_MS
): Promise<AiResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const payload: OpenAiChatRequest = {
    model,
    messages: [
      { role: 'system', content: request.systemPrompt },
      { role: 'user', content: request.prompt },
    ],
    max_tokens: request.maxTokens ?? MAX_OUTPUT_TOKENS,
    temperature: request.temperature ?? 0.3,
    top_p: 0.9,
  };

  let response: Response;
  try {
    response = await fetch(`${baseClientUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://capitalarchitect.tech',
        'X-Title': 'Capital Architect',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  const data = (await response.json()) as OpenAiChatResponse;

  if (!response.ok || data.error) {
    const errMsg = data.error?.message || `HTTP ${response.status}`;
    throw new Error(`OpenAI-compatible API error: ${errMsg}`);
  }

  const text = data.choices[0]?.message?.content ?? '';
  const tokensUsed = data.usage?.total_tokens;
  const actualModel = model;

  return { text, model: actualModel, tokensUsed };
}

// ============================================================================
// MAIN CALL FUNCTION
// ============================================================================

export async function callAi(request: AiRequest): Promise<AiResponse> {
  const provider = (process.env.AI_PROVIDER || 'openai-compatible').toLowerCase();
  const model = request.model || DEFAULT_MODEL;

  // Route based on provider setting
  if (provider === 'gemini') {
    return callGemini(request);
  }

  // openai-compatible (default)
  return callOpenAiCompatibleProvider(request, model);
}

async function callGemini(request: AiRequest): Promise<AiResponse> {
  const ai = getGeminiClient();
  const model = request.model || DEFAULT_MODEL;
  const maxTokens = request.maxTokens ?? MAX_OUTPUT_TOKENS;

  const responsePromise = ai.models.generateContent({
    model,
    contents: request.prompt,
    config: {
      systemInstruction: request.systemPrompt,
      temperature: request.temperature ?? 0.3,
      topP: 0.9,
      maxOutputTokens: maxTokens,
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error('AI request timed out'));
    }, API_TIMEOUT_MS);
  });

  const response = await Promise.race([responsePromise, timeoutPromise]);
  const text = (response as { text?: string | null }).text ?? '';

  return {
    text,
    model,
    tokensUsed: (response as { usageMetadata?: { totalTokenCount?: number } }).usageMetadata?.totalTokenCount,
  };
}

async function callOpenAiCompatibleProvider(request: AiRequest, model: string): Promise<AiResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured. Set it in .env.');
  }

  // Try the configured gateway first (primary)
  try {
    console.log('[AI] Using OpenAI-compatible gateway (primary):', OPENAI_BASE_URL);
    return await callOpenAiCompatible(
      OPENAI_BASE_URL,
      OPENAI_API_KEY,
      request,
      model
    );
  } catch (primaryErr) {
    console.warn('[AI] Gateway failed, attempting OpenRouter fallback:', (primaryErr as Error).message);

    // Try OpenRouter as fallback via env
    const orKey = process.env.OPENROUTER_API_KEY?.trim();
    if (orKey) {
      try {
        console.log('[AI] Using OpenRouter (fallback)');
        return await callOpenAiCompatible(
          OPENROUTER_BASE_URL,
          orKey,
          request,
          model
        );
      } catch (fallbackErr) {
        console.error('[AI] OpenRouter fallback also failed:', (fallbackErr as Error).message);
      }
    }

    throw new Error(`Both gateway and OpenRouter failed. Primary: ${(primaryErr as Error).message}`);
  }
}

/**
 * Call AI and parse the response as JSON. Throws if not valid JSON.
 */
export async function callAiJson<T>(request: AiRequest): Promise<T> {
  const result = await callAi({ ...request, json: true });
  const text = result.text.trim();
  try {
    return JSON.parse(text) as T;
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        // fall through
      }
    }
    throw new Error(`AI response is not valid JSON: ${text.slice(0, 200)}`);
  }
}

/**
 * @deprecated Use getGeminiClient() directly or callAi() for unified routing.
 * This function exists for the gemini-thinking endpoint which requires
 * GoogleGenAI SDK for thinking config support.
 */
export function getGoogleGenAIClient(): GoogleGenAI {
  return getGeminiClient();
}

/**
 * @deprecated Use GEMINI_API_KEY directly or getGeminiClient().
 */
export function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error('GEMINI_API_KEY is not configured');
  return key;
}

export { DEFAULT_MODEL };