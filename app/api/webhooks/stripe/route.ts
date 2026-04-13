import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPrismaClient } from "@/lib/prisma";
import { headers } from "next/headers";

const prisma = getPrismaClient();

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${msg}`);
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Stripe event payloads are dynamic
  const session = event.data.object as any;

  switch (event.type) {
    // ── Payment Success ──
    case "checkout.session.completed": {
      const customerEmail = session.customer_details?.email;
      const metadata = session.metadata;
      const leadId = metadata?.leadId;

      if (!customerEmail && !leadId) break;

      try {
        // Find lead by metadata leadId first, fall back to email
        const lead = leadId
          ? await prisma.lead.findUnique({ where: { id: leadId } })
          : await prisma.lead.findFirst({
              where: { email: customerEmail },
              orderBy: { createdAt: "desc" },
            });

        // Determine status based on product type
        const productType = metadata?.productType || "roadmap";
        const statusMap: Record<string, string> = {
          intensive: "PAID_INTENSIVE",
          roadmap: "PAID_ROADMAP",
          repair_kit: "PAID_REPAIR_KIT",
        };

        if (lead) {
          // Check idempotency — don't reprocess
          if (lead.stripeSessionId === session.id) break;

          await prisma.lead.update({
            where: { id: lead.id },
            data: {
              paymentStatus: "paid",
              paidAmount: session.amount_total,
              paidAt: new Date(),
              stripeSessionId: session.id,
              stripeCustomerId: session.customer || null,
              status: statusMap[productType] || "PAID_READY_INTENSIVE",
              notes: (lead.notes ?? "") + `\n[Stripe] Payment received for ${productType}. Session: ${session.id}`,
            },
          });
          console.log(`Updated lead ${lead.id} for payment from ${customerEmail}`);
        } else {
          // Create a new lead if one doesn't exist
          await prisma.lead.create({
            data: {
              email: customerEmail,
              businessName: metadata?.businessName || "TBD",
              ownerName: session.customer_details?.name || "TBD",
              status: statusMap[productType] || "PAID_READY_INTENSIVE",
              paymentStatus: "paid",
              paidAmount: session.amount_total,
              paidAt: new Date(),
              stripeSessionId: session.id,
              stripeCustomerId: session.customer || null,
              tier: metadata?.tier || "B",
              source: "stripe_checkout",
              notes: `[Stripe] New lead created from payment. Session: ${session.id}`,
            },
          });
          console.log(`Created new lead for payment from ${customerEmail}`);
        }
      } catch (dbError) {
        console.error("Database update failed during webhook:", dbError);
        return new NextResponse("Database Error", { status: 500 });
      }
      break;
    }

    // ── Payment Failed ──
    case "payment_intent.payment_failed": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Stripe event payloads are dynamic
      const failedIntent = event.data.object as any;
      const failEmail = failedIntent.receipt_email || failedIntent.last_payment_error?.payment_method?.billing_details?.email;
      const failReason = failedIntent.last_payment_error?.message || "Unknown failure";

      if (failEmail) {
        try {
          const lead = await prisma.lead.findFirst({
            where: { email: failEmail },
            orderBy: { createdAt: "desc" },
          });

          if (lead) {
            await prisma.lead.update({
              where: { id: lead.id },
              data: {
                paymentStatus: "failed",
                notes: (lead.notes ?? "") + `\n[Stripe] Payment failed: ${failReason}`,
              },
            });
            console.log(`Marked lead ${lead.id} payment as failed: ${failReason}`);
          }
        } catch (dbError) {
          console.error("Database update failed for payment_intent.payment_failed:", dbError);
        }
      }
      break;
    }

    // ── Refund ──
    case "charge.refunded": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Stripe event payloads are dynamic
      const refundedCharge = event.data.object as any;
      const refundEmail = refundedCharge.billing_details?.email || refundedCharge.receipt_email;

      if (refundEmail) {
        try {
          const lead = await prisma.lead.findFirst({
            where: { email: refundEmail, paymentStatus: "paid" },
            orderBy: { createdAt: "desc" },
          });

          if (lead) {
            await prisma.lead.update({
              where: { id: lead.id },
              data: {
                paymentStatus: "refunded",
                status: "REFUNDED",
                notes: (lead.notes ?? "") + `\n[Stripe] Refund processed. Charge: ${refundedCharge.id}`,
              },
            });
            console.log(`Marked lead ${lead.id} as refunded`);
          }
        } catch (dbError) {
          console.error("Database update failed for charge.refunded:", dbError);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse("Success", { status: 200 });
}
