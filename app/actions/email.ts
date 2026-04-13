"use server";

import { resend } from "@/lib/resend";

export async function sendBlueprintEmail(email: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not found, skipping email delivery");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Capital Architect <blueprint@capitalarchitect.tech>',
      to: [email],
      subject: 'Your Free Fundability Blueprint',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #060A14; color: #F0EDE6; padding: 40px; border-radius: 12px;">
          <h1 style="color: #C8A84B; font-family: serif; border-bottom: 1px solid rgba(200,168,75,0.2); padding-bottom: 20px;">Capital Architect</h1>
          <p style="font-size: 18px; margin-top: 30px;">Hello ${name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #8E9AAD;">Thank you for requesting the <strong>Free Fundability Blueprint</strong>. This guide is your first step toward institutional-grade capital.</p>
          
          <div style="background: rgba(200,168,75,0.08); border: 1px solid rgba(200,168,75,0.25); padding: 25px; border-radius: 8px; margin: 30px 0;">
            <h2 style="color: #C8A84B; font-size: 20px; margin-top: 0;">Inside the Blueprint:</h2>
            <ul style="color: #F0EDE6; padding-left: 20px;">
              <li style="margin-bottom: 10px;">The 3-Tier Capital Stack explained</li>
              <li style="margin-bottom: 10px;">Common Metro 2 errors to avoid</li>
              <li style="margin-bottom: 10px;">Institutional entity structures</li>
            </ul>
          </div>

          <p style="text-align: center; margin: 40px 0;">
            <a href="https://capitalarchitect.tech/docs/blueprint.pdf" style="background: #C8A84B; color: #060A14; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Download Your Blueprint</a>
          </p>

          <p style="font-size: 14px; color: #8E9AAD; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 20px; margin-top: 40px;">
            Ready to see where you stand right now? 
            <a href="https://capitalarchitect.tech/assess" style="color: #C8A84B; text-decoration: none;">Take the 60-Second Fundability Assessment →</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email delivery failed:", error);
    return { success: false, error: "Unexpected error during email delivery" };
  }
}
