"use server";

import { getPrismaClient } from "@/lib/prisma";
import { calculateFundabilityScore } from "./scoring";

const prisma = getPrismaClient();

type AssessmentInput = {
  name: string;
  email: string;
  phone: string;
  hasEntity: boolean;
  entityType?: string | null;
  recentInquiries: number;
  metro2ErrorCount: number;
};

type AssessmentResult = {
  success: boolean;
  tier: "A" | "B" | "C";
  score: number;
  leadId: string;
};

export async function processAssessment(input: AssessmentInput): Promise<AssessmentResult> {
  try {
    // Calculate fundability score
    const score = await calculateFundabilityScore({
      metro2ErrorCount: input.metro2ErrorCount,
      recentInquiries: input.recentInquiries,
      entityType: input.hasEntity ? input.entityType : null,
    });

    // Determine tier
    let tier: "A" | "B" | "C";
    if (score >= 80) {
      tier = "A";
    } else if (score >= 65) {
      tier = "B";
    } else {
      tier = "C";
    }

    // Save to database
    const lead = await prisma.lead.create({
      data: {
        businessName: input.name,
        email: input.email,
        phone: input.phone,
        entityType: input.hasEntity ? input.entityType : "No Entity",
        recentInquiries: input.recentInquiries,
        metro2ErrorCount: input.metro2ErrorCount,
        fundabilityScore: score,
        tier,
        status: "ASSESSMENT_COMPLETE",
        source: "public_assessment",
      },
    });

    return {
      success: true,
      tier,
      score,
      leadId: lead.id,
    };
  } catch (error) {
    console.error("Assessment processing error:", error);
    throw new Error("Failed to process assessment");
  }
}
