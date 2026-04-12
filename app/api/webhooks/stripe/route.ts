import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

// In-memory paid users store
// TODO: Replace with Supabase/database in production
const paidUsers = new Set<string>();

export { paidUsers };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // If no webhook secret configured, accept all completed checkout events
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Development mode — parse raw event
      event = JSON.parse(body) as Stripe.Event;
    }
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

      if (email) {
        paidUsers.add(email.toLowerCase());
        console.log("Paid user registered:", email);
      }

      // TODO: Update Supabase — set prospect.has_paid = true WHERE email = email
      // TODO: Update Clerk user metadata with paid status
      break;
    }

    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const email = intent.receipt_email;

      console.log("=== PAYMENT INTENT SUCCEEDED ===");
      console.log("Email:", email);
      console.log("Amount:", intent.amount);

      if (email) {
        paidUsers.add(email.toLowerCase());
      }
      break;
    }

    default:
      console.log("Unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true });
}
