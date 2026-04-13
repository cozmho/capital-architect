import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getPrismaClient } from '@/lib/prisma';
import { headers } from 'next/headers';

const prisma = getPrismaClient();

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const customerEmail = session.customer_details?.email;
      const metadata = session.metadata;
      
      if (customerEmail) {
        try {
          // Update the lead based on email
          // We look for the most recent lead with this email
          const lead = await prisma.lead.findFirst({
            where: { email: customerEmail },
            orderBy: { createdAt: 'desc' }
          });

          if (lead) {
            await prisma.lead.update({
              where: { id: lead.id },
              data: {
                status: 'PAID_READY_INTENSIVE',
                tier: 'B', // Ensure they are at least Tier B if they paid for the intensive
                notes: lead.notes + `\n[Stripe] Payment received for Funding Readiness Intensive. Session: ${session.id}`
              }
            });
            console.log(`Updated lead ${lead.id} for payment from ${customerEmail}`);
          } else {
            // Create a new lead if one doesn't exist (e.g. they went straight to checkout)
            await prisma.lead.create({
              data: {
                email: customerEmail,
                businessName: metadata?.businessName || 'TBD',
                ownerName: session.customer_details?.name || 'TBD',
                status: 'PAID_READY_INTENSIVE',
                tier: 'B',
                source: 'stripe_checkout',
                notes: `[Stripe] New lead created from payment. Session: ${session.id}`
              }
            });
            console.log(`Created new lead for payment from ${customerEmail}`);
          }
        } catch (dbError) {
          console.error('Database update failed during webhook:', dbError);
          return new NextResponse('Database Error', { status: 500 });
        }
      }
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse('Success', { status: 200 });
}
