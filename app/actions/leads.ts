"use server";

import { getPrismaClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { sendBlueprintEmail } from "./email";

const prisma = getPrismaClient();

/**
 * Updates a lead's status and revalidates the setter dashboard.
 */
export async function updateLeadStatus(leadId: string, newStatus: string) {
  try {
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: newStatus,
        lastContactedAt: new Date()
      },
    });

    revalidatePath("/dashboard/setter");

    return {
      success: true,
      leadId: updatedLead.id,
      status: updatedLead.status
    };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Updates lead notes from the setter workflow.
 */
export async function updateLeadNotes(leadId: string, notes: string) {
  try {
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { notes },
    });

    revalidatePath("/dashboard/setter");

    return {
      success: true,
      leadId: updatedLead.id
    };
  } catch (error) {
    console.error("Error updating lead notes:", error);
    return { success: false, error: "Failed to update notes" };
  }
}

type LeadMagnetInput = {
  name: string;
  email: string;
  business?: string;
};

export async function submitLeadMagnet(input: LeadMagnetInput) {
  try {
    const lead = await prisma.lead.create({
      data: {
        ownerName: input.name,
        businessName: input.business || "TBD",
        email: input.email,
        source: "lead_magnet_blueprint",
        status: "NEW_LEAD",
        notes: "Requested Free Fundability Blueprint",
      },
    });

    // Trigger asynchronous email delivery
    try {
      await sendBlueprintEmail(input.email, input.name);
    } catch (emailError) {
      console.error("Lead magnet email trigger failed:", emailError);
      // We don't fail the lead creation if the email fails
    }

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error("Lead magnet submission error:", error);
    return { success: false, error: "Failed to submit request" };
  }
}
