"use server";

import { getPrismaClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
