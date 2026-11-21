import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ paid: false });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ paid: false, error: 'Stripe not configured' });
  }

  try {
      const sessions = await stripe.checkout.sessions.list({
        limit: 50,
        expand: ['data.customer_details'],
      });

    const hasPaid = sessions.data.some(
      (session) =>
        session.payment_status === 'paid' &&
        session.customer_details?.email?.toLowerCase() === email.toLowerCase()
    );

    return NextResponse.json({ paid: hasPaid });
  } catch (error) {
    console.error('Stripe check failed:', error);
    return NextResponse.json({ paid: false });
  }
}
