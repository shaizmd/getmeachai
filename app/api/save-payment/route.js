import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment has not been completed' },
        { status: 400 }
      );
    }

    await dbConnect();

    let payment = await Payment.findOne({
      $or: [
        { trans_id: sessionId },
        { stripeSessionId: sessionId },
      ],
    });

    if (payment) {
      if (payment.status !== 'paid') {
        await payment.markAsPaid(session.payment_intent);
      }

      return NextResponse.json({
        message: 'Payment already recorded',
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount,
          to_user: payment.to_user,
        },
      });
    }

    const amount = session.amount_total / 100;

    const creatorName =
      session.metadata.creator ||
      session.metadata.creatorName ||
      null;

    if (!creatorName) {
      return NextResponse.json(
        { error: 'Payment is missing creator information' },
        { status: 400 }
      );
    }

    const message = session.metadata.message || '';

    let customerName = 'Anonymous';

    if (session.customer_details?.name) {
      customerName = session.customer_details.name;
    } else if (session.customer_details?.email) {
      customerName =
        session.customer_details.email.split('@')[0];
    }

    payment = new Payment({
      name: customerName,
      to_user: creatorName.toLowerCase(),
      amount,
      trans_id: sessionId,
      message,
      stripeSessionId: sessionId,
      email: session.customer_details?.email || null,
      status: 'pending',
    });

    await payment.save();
    await payment.markAsPaid(session.payment_intent);

    return NextResponse.json({
      message: 'Payment saved successfully',
      payment: {
        id: payment._id,
        status: payment.status,
        amount: payment.amount,
        to_user: payment.to_user,
      },
    });

  } catch (error) {
    console.error('Error saving payment:', error);

    return NextResponse.json(
      { error: 'Failed to save payment' },
      { status: 500 }
    );
  }
}
