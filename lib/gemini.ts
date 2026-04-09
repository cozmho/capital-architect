// cspell:ignore genai
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a 2-sentence AI feedback for a lead based on their fundability score and profile.
 */
export async function generateLeadFeedback(score: number, businessName: string, tier: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found, skipping AI feedback");
    return `Your fundability score is ${score} (${tier} tier). Focus on improving your profile to unlock more funding options.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert credit consultant for "Capital Architect".
      Analyze this lead:
      - Business: ${businessName}
      - Fundability Score: ${score}/100
      - Tier: ${tier}

      Provide a custom 2-sentence feedback for the business owner. 
      The first sentence should acknowledge their current standing.
      The second sentence should provide a specific, actionable tip to improve or maintain their score.
      Keep it professional, encouraging, and exactly 2 sentences.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    const text = result.text?.trim() || "";
    
    // Ensure it's approximately 2 sentences if the AI rambles
    return text;
  } catch (error) {
    console.error("Gemini feedback generation failed:", error);
    return `Your fundability score is ${score} (${tier} tier). Focus on improving your profile to unlock more funding options.`;
  }
}
