import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {

    // Initialize Stripe INSIDE handler
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amount, message, creatorName } = await req.json();
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 0.5) {
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      );
    }

    if (typeof creatorName !== 'string' || !creatorName.trim()) {
      return NextResponse.json(
        { error: 'Creator name is required' },
        { status: 400 }
      );
    }

    if (message && (typeof message !== 'string' || message.length > 500)) {
      return NextResponse.json(
        { error: 'Message must be 500 characters or fewer' },
        { status: 400 }
      );
    }

    const normalizedCreatorName = creatorName.trim().toLowerCase();
    const requestUrl = new URL(req.url);
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      req.headers.get('origin') ||
      `${requestUrl.protocol}//${requestUrl.host}`;

    const supporterName =
      session?.user?.name ||
      session?.user?.email?.split('@')[0] ||
      'Anonymous';

    const unitAmount = Math.round(numericAmount * 100);

    await dbConnect();

    const checkoutSession =
      await stripe.checkout.sessions.create({
        payment_method_types: ['card'],

        line_items: [
          {
            price_data: {
              currency: 'usd',

              product_data: {
                name: `Chai for ${normalizedCreatorName}`,

                description:
                  message ||
                  'Thanks for supporting with a chai ☕',
              },

              unit_amount: unitAmount,
            },

            quantity: 1,
          },
        ],

        mode: 'payment',
        success_url:
          `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}` +
          `&amount=${numericAmount}` +
          `&creator=${encodeURIComponent(
            normalizedCreatorName
          )}` +
          `&message=${encodeURIComponent(message || '')}`,
        cancel_url: `${baseUrl}/cancel`,

        metadata: {
          creator: normalizedCreatorName,
          message: message || '',
          supporterName,
        },
      });

    const payment = new Payment({
      name: supporterName,

      to_user: normalizedCreatorName,

      amount: numericAmount,

      trans_id: checkoutSession.id,

      message: message || '',

      status: 'pending',

      stripeSessionId: checkoutSession.id,

      email: session?.user?.email || null,
    });

    await payment.save();

    return NextResponse.json({
      id: checkoutSession.id,
    });

  } catch (error) {

    console.error('Stripe error:', error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
