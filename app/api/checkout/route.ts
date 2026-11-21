import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const PRODUCTS: Record<string, { name: string; amount: number; description: string }> = {
  intensive: {
    name: "Funding Readiness Intensive",
    amount: 150000, // $1,500
    description: "14-day program: entity setup, credit positioning, and underwriting prep",
  },
  audit: {
    name: "Fundability Audit",
    amount: 49700, // $497
    description: "Exact lender order map so you don't burn inquiries on wrong applications",
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

export const TIER_ROUTES: Record<string, string> = {
  A: "ready",
  B: "prep",
  C: "repair",
};

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let email: string | undefined;
    let leadId: string | undefined;
    let tier: string | undefined;
    let productType: string | undefined;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = body.email;
      leadId = body.leadId;
      tier = body.tier;
      productType = body.productType;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formBody = await req.text();
      const params = new URLSearchParams(formBody);
      email = params.get("email") || undefined;
      leadId = params.get("leadId") || undefined;
      tier = params.get("tier") || undefined;
      productType = params.get("productType") || undefined;
    }

    if (!productType) {
      return NextResponse.json(
        { error: "Missing required fields: productType" },
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
        const tierRoute = tier && TIER_ROUTES[tier] ? TIER_ROUTES[tier] : "prep";

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 503 }
      );
    }

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
