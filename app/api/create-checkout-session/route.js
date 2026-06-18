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

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amount, message, creatorName } = await req.json();

    const session = await getServerSession(authOptions);

    const supporterName =
      session?.user?.name ||
      session?.user?.email?.split('@')[0] ||
      'Anonymous';

    const unitAmount = Math.round(amount * 100);

    await dbConnect();

    const checkoutSession =
      await stripe.checkout.sessions.create({
        payment_method_types: ['card'],

        line_items: [
          {
            price_data: {
              currency: 'usd',

              product_data: {
                name: `Chai for ${creatorName || 'Creator'}`,

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
          `${req.headers.get('origin')}` +
          `/success?session_id={CHECKOUT_SESSION_ID}` +
          `&amount=${amount}` +
          `&creator=${encodeURIComponent(
            creatorName || 'Creator'
          )}` +
          `&message=${encodeURIComponent(message || '')}`,

        cancel_url:
          `${req.headers.get('origin')}/cancel`,

        metadata: {
          creator: creatorName || 'Unknown',
          message: message || '',
          supporterName,
        },
      });

    const payment = new Payment({
      name: supporterName,

      to_user: creatorName.toLowerCase(),

      amount,

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