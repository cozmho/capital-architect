import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Fail closed: a missing or invalid signature is never accepted.
  if (!webhookSecret || !sig) {
    return NextResponse.json(
      { error: "Webhook secret not configured or signature missing" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;
      const customerName = session.customer_details?.name;

      console.log("=== PAYMENT RECEIVED ===");
      console.log("Email:", email);
      console.log("Name:", customerName);
      console.log("Amount:", session.amount_total);
      console.log("Payment ID:", session.payment_intent);

      // TODO: Persist to Supabase (prospects table) — deferred (Gate 1)
      break;
    }

    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const email = intent.receipt_email;

      console.log("=== PAYMENT INTENT SUCCEEDED ===");
      console.log("Email:", email);
      console.log("Amount:", intent.amount);

      // TODO: Persist to Supabase — deferred (Gate 1)
      break;
    }

    default:
      console.log("Unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true });
}
