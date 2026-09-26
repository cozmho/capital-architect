import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

// Initialize Resend (requires RESEND_API_KEY in .env.local)
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: pendingLeads, error: queryError } = await supabaseAdmin
      .from("leads")
      .select("id, full_name, email, phone, tier, score, status")
      .eq("status", "new")
      .lte("created_at", cutoffDate)
      .limit(50);

    if (queryError) {
      console.error("[CRON] Supabase fetch error:", queryError);
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }

    if (!pendingLeads || pendingLeads.length === 0) {
      return NextResponse.json({ message: "No pending leads to process", processed: 0 });
    }

    const processedIds: string[] = [];

    for (const lead of pendingLeads) {
      console.log(`[CRON] Dispatching email to: ${lead.email} | Tier: ${lead.tier}`);
      
      let subject = "";
      let htmlBody = "";

      if (lead.tier === "A") {
        subject = "Your Verdic Underwriting Results: Funding Ready";
        htmlBody = `<p>Hi ${lead.full_name},</p><p>Your business scored a ${lead.score} and is in Tier A. You are ready for funding. Let's schedule a consultation to review capital deployment options.</p>`;
      } else if (lead.tier === "B") {
         subject = "Your Verdic Underwriting Results: Preparation Needed";
         htmlBody = `<p>Hi ${lead.full_name},</p><p>Your business scored a ${lead.score} and is in Tier B. We need to optimize your credit profile before applying. Here is your preparation roadmap.</p>`;
      } else {
         subject = "Your Verdic Underwriting Results: Repair Sequence";
         htmlBody = `<p>Hi ${lead.full_name},</p><p>Your business scored a ${lead.score} and is in Tier C. Let's get your foundation solid. Here are the steps to repair your reporting.</p>`;
      }

      try {
        await resend.emails.send({
          from: 'Capital Architect <onboarding@resend.dev>', // Update with your verified domain later
          to: [lead.email],
          subject: subject,
          html: htmlBody,
        });
        processedIds.push(lead.id);
      } catch (emailErr) {
         console.error(`[CRON] Failed to send email to ${lead.email}`, emailErr);
         // Do not push to processedIds if email fails, so it retries next run
      }
    }

    if (processedIds.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("leads")
        .update({
          status: "contacted",
          last_contacted_at: new Date().toISOString()
        })
        .in("id", processedIds);

      if (updateError) {
        console.error("[CRON] Update error:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedIds.length,
      leadIds: processedIds
    });
  } catch (err: any) {
    console.error("[CRON] Unhandled error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
