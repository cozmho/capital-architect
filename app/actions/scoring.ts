"use server";

import { getPrismaClient } from "@/lib/prisma";
import { generateLeadFeedback } from "@/lib/gemini";

const prisma = getPrismaClient();

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

type IntakePayload = {
  businessName: string;
  email?: string;
  phone?: string;
  recentInquiries: number;
  metro2ErrorCount: number;
  entityType: string;
};

type IntakeResult = {
  success: boolean;
  leadId: string;
  fundabilityScore: number;
  tier: string;
  message: string;
  aiFeedback: string;
};

export async function processIntake(payload: IntakePayload): Promise<IntakeResult> {
  try {
    // Calculate fundability score with baseline algorithm
    const fundabilityScore = await calculateFundabilityScore({
      metro2ErrorCount: payload.metro2ErrorCount,
      recentInquiries: payload.recentInquiries,
      entityType: payload.entityType,
    });

    // Determine tier based on score
    let tier: string;
    if (fundabilityScore >= 80) {
      tier = "A";
    } else if (fundabilityScore >= 65) {
      tier = "B";
    } else {
      tier = "C";
    }

    // Generate custom 2-sentence AI feedback
    const aiFeedback = await generateLeadFeedback(fundabilityScore, payload.businessName, tier);

    // `email` is indexed but not unique, so use find/update-or-create instead of upsert.
    const resolvedEmail =
      payload.email || `${payload.businessName.toLowerCase().replace(/\s/g, "-")}@placeholder.com`;

    const existingLead = await prisma.lead.findFirst({
      where: {
        email: resolvedEmail,
      },
      select: {
        id: true,
      },
    });

    const lead = existingLead
      ? await prisma.lead.update({
          where: {
            id: existingLead.id,
          },
          data: {
            businessName: payload.businessName,
            phone: payload.phone,
            recentInquiries: payload.recentInquiries,
            metro2ErrorCount: payload.metro2ErrorCount,
            entityType: payload.entityType,
            fundabilityScore,
            tier,
            status: "INTAKE_COMPLETE",
            notes: aiFeedback, // Store AI feedback in notes
          },
        })
      : await prisma.lead.create({
          data: {
            businessName: payload.businessName,
            email: resolvedEmail,
            phone: payload.phone,
            recentInquiries: payload.recentInquiries,
            metro2ErrorCount: payload.metro2ErrorCount,
            entityType: payload.entityType,
            fundabilityScore,
            tier,
            status: "INTAKE_COMPLETE",
            source: "client_dashboard",
            notes: aiFeedback, // Store AI feedback in notes
          },
        });

    return {
      success: true,
      leadId: lead.id,
      fundabilityScore,
      tier,
      aiFeedback,
      message: `Intake saved successfully. Fundability Score: ${fundabilityScore}. Tier: ${tier}`,
    };
  } catch (error) {
    console.error("Intake processing error:", error);
    throw new Error("Failed to process intake");
  }
}
