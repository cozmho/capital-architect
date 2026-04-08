"use server";

import { getPrismaClient } from "@/lib/prisma";
import { generateLeadFeedback } from "@/lib/gemini";

const prisma = getPrismaClient();

type ScoringInput = {
  metro2ErrorCount?: number | null;
  recentInquiries?: number | null;
  entityType?: string | null;
  ficoScore?: number | null;
  monthlyRevenue?: number | null;
  timeInBusiness?: number | null;
};

export async function calculateFundabilityScore(input: ScoringInput): Promise<number> {
  let score = 70; // Start with a base neutral score

  // 1. Credit Quality (FICO) - High Impact
  if (input.ficoScore) {
    const fico = Math.max(300, Math.min(850, input.ficoScore));
    if (fico >= 740) score += 20;
    else if (fico >= 700) score += 10;
    else if (fico < 640) score -= 15;
    else if (fico < 580) score -= 30;
  }

  // 2. Metro 2 Compliance Errors - Critical Impact
  if (input.metro2ErrorCount) {
    const errors = Math.max(0, input.metro2ErrorCount);
    score -= errors * 12; // 12 pts per error
  }

  // 3. Underwriting (Inquiries) - Medium Impact
  if (input.recentInquiries !== null && input.recentInquiries !== undefined) {
    const inquiries = Math.max(0, input.recentInquiries);
    if (inquiries > 6) score -= 25;
    else if (inquiries > 3) score -= 10;
  }

  // 4. Revenue & Stability - Positive Impact
  if (input.monthlyRevenue) {
    const revenue = Math.max(0, input.monthlyRevenue);
    if (revenue >= 50000) score += 15;
    else if (revenue >= 10000) score += 5;
  }

  if (input.timeInBusiness) {
    const months = Math.max(0, input.timeInBusiness);
    if (months >= 24) score += 10;
    else if (months >= 6) score += 5;
  }

  // 5. Entity Structure - Institutional Preference
  if (input.entityType === "LLC") score += 5;
  else if (input.entityType === "Private Trust") score += 10;
  else if (input.entityType === "Sole Prop") score -= 5;

  // Final Clamp
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
