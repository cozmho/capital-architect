import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getPrismaClient } from "@/lib/prisma";
import { headers } from "next/headers";

/** Resolve the Prisma client or return a 503 response. */
function requirePrisma(): { prisma: ReturnType<typeof getPrismaClient> } | NextResponse {
  try {
    return { prisma: getPrismaClient() };
  } catch {
    return new NextResponse("Database not configured", { status: 503 });
  }
}

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: any;
  const stripe = getStripe();
  if (!stripe) {
    return new NextResponse("Stripe not configured", { status: 503 });
  }

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

  const session = event.data.object as any;

  switch (event.type) {
    case "checkout.session.completed": {
      const customerEmail = session.customer_details?.email;
      const metadata = session.metadata;
      const leadId = metadata?.leadId;

      if (!customerEmail && !leadId) break;

      const prismaResult = requirePrisma();
            if (prismaResult instanceof NextResponse) return prismaResult;
            const prisma = prismaResult.prisma;

            try {
                  const lead = leadId
                    ? await prisma.lead.findUnique({ where: { id: leadId } })
                    : await prisma.lead.findFirst({
                        where: { email: customerEmail },
                        orderBy: { createdAt: "desc" },
                      });

                  const productType = metadata?.productType || "roadmap";
                  const statusMap: Record<string, string> = {
                    intensive: "PAID_INTENSIVE",
                    audit: "PAID_AUDIT",
                    roadmap: "PAID_ROADMAP",
                    repair_kit: "PAID_REPAIR_KIT",
                  };

                  if (lead) {
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
                  } else {
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
                  }
                } catch (dbError) {
                  console.error("Database update failed during webhook:", dbError);
                  return new NextResponse("Database Error", { status: 500 });
                }
      break;
    }

    case "payment_intent.payment_failed": {
      const failedIntent = event.data.object as any;
      const failEmail = failedIntent.receipt_email || failedIntent.last_payment_error?.payment_method?.billing_details?.email;
      const failReason = failedIntent.last_payment_error?.message || "Unknown failure";

      if (failEmail) {
              const prismaResult = requirePrisma();
              if (prismaResult instanceof NextResponse) return prismaResult;
              const prisma = prismaResult.prisma;
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
          }
        } catch (dbError) {
          console.error("DB update failed for payment_intent.payment_failed:", dbError);
        }
      }
      break;
    }

    case "charge.refunded": {
      const refundedCharge = event.data.object as any;
      const refundEmail = refundedCharge.billing_details?.email || refundedCharge.receipt_email;

      if (refundEmail) {
              const prismaResult = requirePrisma();
              if (prismaResult instanceof NextResponse) return prismaResult;
              const prisma = prismaResult.prisma;
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
          }
        } catch (dbError) {
          console.error("DB update failed for charge.refunded:", dbError);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse("Success", { status: 200 });
}
