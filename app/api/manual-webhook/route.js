import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function POST(request) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // console.log('Looking for payment with session ID:', sessionId);
    
    // Find the payment record by session ID
    const payment = await Payment.findOne({ stripeSessionId: sessionId });
    
    if (!payment) {
      // console.log('Payment not found for session:', sessionId);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // console.log('Found payment:', payment._id, 'current status:', payment.status);
    
    if (payment.status === 'pending') {
      // Mark the payment as paid
      await payment.markAsPaid(sessionId.replace('cs_', 'pi_'));
      
      console.log('Payment marked as paid:', payment._id);
      
      return NextResponse.json({
        message: 'Payment successfully marked as paid',
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount,
          to_user: payment.to_user
        }
      });
    } else {
      return NextResponse.json({
        message: 'Payment was already processed',
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount,
          to_user: payment.to_user
        }
      });
    }
    
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
