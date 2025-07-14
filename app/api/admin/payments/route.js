import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all pending payments
    const pendingPayments = await Payment.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(20);
    
    return NextResponse.json({
      success: true,
      count: pendingPayments.length,
      payments: pendingPayments.map(payment => ({
        id: payment._id,
        name: payment.name,
        to_user: payment.to_user,
        amount: payment.amount,
        message: payment.message,
        sessionId: payment.stripeSessionId,
        email: payment.email,
        createdAt: payment.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending payments' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { paymentId, action } = await request.json();
    
    if (!paymentId || !action) {
      return NextResponse.json(
        { error: 'Payment ID and action are required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    if (action === 'mark_paid') {
      await payment.markAsPaid('manual_approval_' + Date.now());
      
      return NextResponse.json({
        message: 'Payment marked as paid',
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount,
          to_user: payment.to_user
        }
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
