import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ trans_id: sessionId });
    if (existingPayment) {
      return NextResponse.json({ 
        message: 'Payment already recorded',
        payment: existingPayment 
      });
    }

    // For test sessions, create a simple payment record
    if (sessionId.startsWith('test_')) {
      const payment = new Payment({
        name: 'Test User',
        to_user: 'testcreator',
        amount: 5.00,
        trans_id: sessionId,
        message: 'Test payment'
      });

      await payment.save();

      return NextResponse.json({ 
        message: 'Test payment saved successfully',
        payment: payment
      });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Extract data from session metadata
    const amount = session.amount_total / 100; // Convert cents to dollars
    const creatorName = session.metadata.creator || session.metadata.creatorName || 'Unknown';
    const message = session.metadata.message || '';

    // Get customer details from session
    let customerName = 'Anonymous';
    if (session.customer_details?.name) {
      customerName = session.customer_details.name;
    } else if (session.customer_details?.email) {
      customerName = session.customer_details.email.split('@')[0];
    }

    // Create new payment record
    const payment = new Payment({
      name: customerName,
      to_user: creatorName,
      amount: amount,
      trans_id: sessionId,
      message: message,
      stripeSessionId: sessionId, // Add this for webhook lookup
      email: session.customer_details?.email || null // Store email if available
    });

    // Save to database
    await payment.save();

    return NextResponse.json({ 
      message: 'Payment saved successfully',
      payment: payment
    });

  } catch (error) {
    console.error('Error saving payment:', error);
    return NextResponse.json(
      { error: 'Failed to save payment' },
      { status: 500 }
    );
  }
}
