// Pure functions returning branded HTML email strings.
// No Resend dependency — these are testable template builders.

const BRAND = {
  bg: "#060A14",
  gold: "#C8A84B",
  text: "#F0EDE6",
  muted: "#8E9AAD",
  border: "rgba(200,168,75,0.2)",
};

function wrapper(content: string): string {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: ${BRAND.bg}; color: ${BRAND.text}; padding: 40px; border-radius: 12px;">
      <h1 style="color: ${BRAND.gold}; font-family: Georgia, serif; border-bottom: 1px solid ${BRAND.border}; padding-bottom: 20px; margin-top: 0;">Capital Architect</h1>
      ${content}
      <p style="font-size: 12px; color: ${BRAND.muted}; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 20px; margin-top: 40px;">
        Capital Architect &mdash; Institutional-grade credit compliance and funding.
      </p>
    </div>
  `;
}

const TIER_LABELS: Record<string, string> = {
  A: "Tier A — Capital Ready",
  B: "Tier B — Emerging",
  C: "Tier C — Rebuild First",
};

const ROUTE_MAP: Record<string, string> = {
  A: "ready",
  B: "prep",
  C: "repair",
};

export function buildAssessmentCompleteEmail(
  name: string,
  score: number,
  tier: string,
  route: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://capitalarchitect.tech";
  return wrapper(`
    <p style="font-size: 18px; margin-top: 30px;">Hello ${name},</p>
    <p style="font-size: 16px; line-height: 1.6; color: ${BRAND.muted};">
      Your Verdic™ Fundability Assessment is complete. Here are your results:
    </p>
    <div style="background: rgba(200,168,75,0.08); border: 1px solid ${BRAND.border}; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
      <p style="font-size: 14px; color: ${BRAND.muted}; margin: 0 0 8px;">YOUR VERDIC™ SCORE</p>
      <p style="font-family: Georgia, serif; font-size: 48px; color: ${BRAND.gold}; margin: 0;">${score}</p>
      <p style="font-size: 14px; color: ${BRAND.muted}; margin: 8px 0 0;">/ 100</p>
      <p style="font-size: 16px; color: ${BRAND.text}; margin-top: 16px; font-weight: 600;">${TIER_LABELS[tier] || `Tier ${tier}`}</p>
    </div>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${baseUrl}/assess/results/${route}" style="background: ${BRAND.gold}; color: ${BRAND.bg}; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">View Your Full Results</a>
    </p>
  `);
}

export function buildPaymentConfirmationEmail(
  name: string,
  productName: string,
  amount: number
): string {
  const formattedAmount = `$${(amount / 100).toLocaleString()}`;
  return wrapper(`
    <p style="font-size: 18px; margin-top: 30px;">Hello ${name},</p>
    <p style="font-size: 16px; line-height: 1.6; color: ${BRAND.muted};">
      Your payment has been received. Here's your confirmation:
    </p>
    <div style="background: rgba(200,168,75,0.08); border: 1px solid ${BRAND.border}; padding: 25px; border-radius: 8px; margin: 30px 0;">
      <p style="font-size: 14px; color: ${BRAND.muted}; margin: 0;">Product</p>
      <p style="font-size: 18px; color: ${BRAND.text}; margin: 4px 0 16px; font-weight: 600;">${productName}</p>
      <p style="font-size: 14px; color: ${BRAND.muted}; margin: 0;">Amount Paid</p>
      <p style="font-size: 24px; color: ${BRAND.gold}; margin: 4px 0 0; font-weight: 600;">${formattedAmount}</p>
    </div>
    <p style="font-size: 16px; line-height: 1.6; color: ${BRAND.muted};">
      Our team will be in touch within 24 hours to kick off your engagement. If you have questions, reply to this email.
    </p>
  `);
}

export function buildAdminNewLeadAlertEmail(lead: {
  name: string;
  email: string;
  score: number;
  tier: string;
  path: string;
}): string {
  return wrapper(`
    <p style="font-size: 18px; margin-top: 30px; color: ${BRAND.gold};">New Lead Alert</p>
    <div style="background: rgba(200,168,75,0.08); border: 1px solid ${BRAND.border}; padding: 25px; border-radius: 8px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: ${BRAND.muted}; font-size: 14px;">Name</td><td style="padding: 8px 0; color: ${BRAND.text}; font-size: 14px; text-align: right;">${lead.name}</td></tr>
        <tr><td style="padding: 8px 0; color: ${BRAND.muted}; font-size: 14px;">Email</td><td style="padding: 8px 0; color: ${BRAND.text}; font-size: 14px; text-align: right;">${lead.email}</td></tr>
        <tr><td style="padding: 8px 0; color: ${BRAND.muted}; font-size: 14px;">Path</td><td style="padding: 8px 0; color: ${BRAND.text}; font-size: 14px; text-align: right;">${lead.path}</td></tr>
        <tr><td style="padding: 8px 0; color: ${BRAND.muted}; font-size: 14px;">Score</td><td style="padding: 8px 0; color: ${BRAND.gold}; font-size: 18px; text-align: right; font-weight: 600;">${lead.score}</td></tr>
        <tr><td style="padding: 8px 0; color: ${BRAND.muted}; font-size: 14px;">Tier</td><td style="padding: 8px 0; color: ${BRAND.text}; font-size: 14px; text-align: right; font-weight: 600;">${TIER_LABELS[lead.tier] || lead.tier}</td></tr>
      </table>
    </div>
  `);
}

export function buildFollowUpEmail(
  name: string,
  tier: string,
  daysSinceAssessment: number
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://capitalarchitect.tech";
  const route = ROUTE_MAP[tier] || "prep";
  const firstName = name.split(" ")[0] || name;

  return wrapper(`
    <p style="font-size: 18px; margin-top: 30px;">${firstName},</p>
    <p style="font-size: 16px; line-height: 1.6; color: ${BRAND.muted};">
      You completed your Verdic™ assessment ${daysSinceAssessment} days ago and scored <strong style="color: ${BRAND.text};">${TIER_LABELS[tier] || `Tier ${tier}`}</strong>.
    </p>
    <p style="font-size: 16px; line-height: 1.6; color: ${BRAND.muted};">
      Your results and next steps are still available. When you're ready, we're here.
    </p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${baseUrl}/assess/results/${route}" style="background: ${BRAND.gold}; color: ${BRAND.bg}; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Review Your Results</a>
    </p>
    <p style="font-size: 14px; color: ${BRAND.muted};">
      If you have questions about your score or next steps, simply reply to this email.
    </p>
  `);
}
