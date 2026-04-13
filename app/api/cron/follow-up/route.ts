import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { sendFollowUpEmail } from "@/app/actions/emails";

const prisma = getPrismaClient();

export async function GET(req: Request) {
  // Verify cron secret (Vercel automatically sends this)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);

  try {
    // Find leads who completed assessment but haven't paid
    const leads = await prisma.lead.findMany({
      where: {
        status: { in: ["VERDIC_SCORED", "ASSESSMENT_COMPLETE", "INTAKE_COMPLETE"] },
        paymentStatus: null,
        createdAt: { lt: fortyEightHoursAgo },
        followUpCount: { lt: 3 },
        email: { not: null },
        OR: [
          { followUpSentAt: null },
          { followUpSentAt: { lt: seventyTwoHoursAgo } },
        ],
      },
      take: 50, // Batch limit to stay within Vercel function timeout
      orderBy: { createdAt: "asc" },
    });

    let sent = 0;
    let errors = 0;

    for (const lead of leads) {
      if (!lead.email) continue;

      const daysSince = Math.floor(
        (now.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      try {
        const result = await sendFollowUpEmail(
          lead.email,
          lead.ownerName || lead.businessName || "there",
          lead.tier,
          daysSince
        );

        if (result.success) {
          await prisma.lead.update({
            where: { id: lead.id },
            data: {
              followUpSentAt: now,
              followUpCount: { increment: 1 },
              lastContactedAt: now,
            },
          });
          sent++;
        } else {
          errors++;
        }
      } catch (err) {
        console.error(`Follow-up failed for lead ${lead.id}:`, err);
        errors++;
      }
    }

    return NextResponse.json({
      processed: leads.length,
      sent,
      errors,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Follow-up cron error:", error);
    return NextResponse.json(
      { error: "Follow-up cron failed" },
      { status: 500 }
    );
  }
}
