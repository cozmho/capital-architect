"use server";

type ScoringInput = {
  metro2ErrorCount?: number | null;
  recentInquiries?: number | null;
  entityType?: string | null;
};

export async function calculateFundabilityScore(input: ScoringInput): Promise<number> {
  let score = 100;

  // Deduct 15 points per Metro 2 error
  if (input.metro2ErrorCount) {
    score -= input.metro2ErrorCount * 15;
  }

  // Deduct points based on recent inquiries
  if (input.recentInquiries !== null && input.recentInquiries !== undefined) {
    if (input.recentInquiries > 4) {
      score -= 20;
    } else if (input.recentInquiries >= 2 && input.recentInquiries <= 4) {
      score -= 10;
    }
  }

  // Add points based on entity type
  if (input.entityType === "LLC") {
    score += 10;
  } else if (input.entityType === "Private Trust") {
    score += 15;
  }

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
}
