import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const PRODUCTS: Record<string, { name: string; amount: number; description: string }> = {
  intensive: {
    name: "Funding Readiness Intensive",
    amount: 150000, // $1,500
    description: "14-day program: entity setup, credit positioning, and underwriting prep",
  },
  roadmap: {
    name: "Funding Roadmap",
    amount: 35000, // $350
    description: "Complete funding roadmap with dashboard access",
  },
  repair_kit: {
    name: "DIY Credit Repair Guide",
    amount: 4700, // $47
    description: "Step-by-step disputation process with letter templates",
  },
};

const TIER_ROUTES: Record<string, string> = {
  A: "ready",
  B: "prep",
  C: "repair",
};

export async function POST(req: Request) {
  try {
    const { email, leadId, tier, productType } = await req.json();

    if (!email || !productType) {
      return NextResponse.json(
        { error: "Missing required fields: email, productType" },
        { status: 400 }
      );
    }

    const product = PRODUCTS[productType];
    if (!product) {
      return NextResponse.json(
        { error: `Invalid productType: ${productType}` },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://capitalarchitect.tech";
    const tierRoute = TIER_ROUTES[tier] || "prep";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      metadata: {
        leadId: leadId || "",
        tier: tier || "",
        productType,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/assess/results/${tierRoute}?payment=success`,
      cancel_url: `${baseUrl}/assess/results/${tierRoute}?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
