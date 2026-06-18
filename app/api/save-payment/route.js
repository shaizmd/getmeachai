import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function POST(req) {
  try {
    // Initialize Stripe INSIDE handler
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingPayment = await Payment.findOne({ trans_id: sessionId });

    if (existingPayment) {
      return NextResponse.json({
        message: 'Payment already recorded',
        payment: existingPayment
      });
    }

    if (sessionId.startsWith('test_')) {
      const payment = new Payment({
        name: 'Test User',
        to_user: 'testcreator',
        amount: 5.0,
        trans_id: sessionId,
        message: 'Test payment'
      });

      await payment.save();

      return NextResponse.json({
        message: 'Test payment saved successfully',
        payment
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const amount = session.amount_total / 100;

    const creatorName =
      session.metadata.creator ||
      session.metadata.creatorName ||
      'Unknown';

    const message = session.metadata.message || '';

    let customerName = 'Anonymous';

    if (session.customer_details?.name) {
      customerName = session.customer_details.name;
    } else if (session.customer_details?.email) {
      customerName =
        session.customer_details.email.split('@')[0];
    }

    const payment = new Payment({
      name: customerName,
      to_user: creatorName,
      amount,
      trans_id: sessionId,
      message,
      stripeSessionId: sessionId,
      email: session.customer_details?.email || null
    });

    await payment.save();

    return NextResponse.json({
      message: 'Payment saved successfully',
      payment
    });

  } catch (error) {
    console.error('Error saving payment:', error);

    return NextResponse.json(
      { error: 'Failed to save payment' },
      { status: 500 }
    );
  }
}