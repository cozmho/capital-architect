import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ paid: false });
  }

  try {
    // Check Stripe for completed payments by this email
    const sessions = await stripe.checkout.sessions.list({
      limit: 10,
      expand: ["data.customer_details"],
    });

    const hasPaid = sessions.data.some(
      (session) =>
        session.payment_status === "paid" &&
        session.customer_details?.email?.toLowerCase() === email.toLowerCase()
    );

    return NextResponse.json({ paid: hasPaid });
  } catch (error) {
    console.error("Stripe check failed:", error);
    // Fallback: return false rather than crashing
    return NextResponse.json({ paid: false });
  }
}
