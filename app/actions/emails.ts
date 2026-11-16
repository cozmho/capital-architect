"use server";

import { resend } from "@/lib/resend";
import {
  buildAssessmentCompleteEmail,
  buildPaymentConfirmationEmail,
  buildAdminNewLeadAlertEmail,
  buildFollowUpEmail,
} from "@/lib/email-templates";

const FROM = "Capital Architect <hello@capitalarchitect.tech>";

export async function sendAssessmentCompleteEmail(
  email: string,
  name: string,
  score: number,
  tier: string,
  route: string
) {
  if (!process.env.RESEND_API_KEY) return { success: false, error: "Email not configured" };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: `Your Verdic™ Score: ${score}/100 — ${tier === "A" ? "Capital Ready" : tier === "B" ? "Almost There" : "Action Required"}`,
      html: buildAssessmentCompleteEmail(name, score, tier, route),
    });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error("Assessment email failed:", error);
    return { success: false, error: "Email delivery failed" };
  }
}

export async function sendPaymentConfirmationEmail(
  email: string,
  name: string,
  productName: string,
  amount: number
) {
  if (!process.env.RESEND_API_KEY) return { success: false, error: "Email not configured" };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: `Payment Confirmed — ${productName}`,
      html: buildPaymentConfirmationEmail(name, productName, amount),
    });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error("Payment confirmation email failed:", error);
    return { success: false, error: "Email delivery failed" };
  }
}

export async function sendAdminNewLeadAlert(lead: {
  name: string;
  email: string;
  score: number;
  tier: string;
  path: string;
}) {
  if (!process.env.RESEND_API_KEY) return { success: false, error: "Email not configured" };

  const adminEmail = process.env.ADMIN_ALERT_EMAIL || "team@capitalarchitect.tech";

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [adminEmail],
      subject: `New Lead: ${lead.name} — Tier ${lead.tier} (${lead.score}/100)`,
      html: buildAdminNewLeadAlertEmail(lead),
    });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error("Admin alert email failed:", error);
    return { success: false, error: "Email delivery failed" };
  }
}

export async function sendFollowUpEmail(
  email: string,
  name: string,
  tier: string,
  daysSince: number
) {
  if (!process.env.RESEND_API_KEY) return { success: false, error: "Email not configured" };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: "Your Fundability Results Are Waiting",
      html: buildFollowUpEmail(name, tier, daysSince),
    });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error("Follow-up email failed:", error);
    return { success: false, error: "Email delivery failed" };
  }
}
