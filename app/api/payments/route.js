import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find payments for the user
    const payments = await Payment.find({ to_user: username })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 payments

    // Calculate stats
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalSupporters = new Set(payments.map(p => p.name)).size;
    
    // Calculate this month's donations
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = payments
      .filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Get recent donations (last 5)
    const recentDonations = payments.slice(0, 5).map(payment => ({
      id: payment._id,
      amount: payment.amount,
      supporterEmail: payment.name,
      message: payment.message,
      date: payment.createdAt
    }));

    const stats = {
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalSupporters,
      thisMonth: Math.round(thisMonth * 100) / 100,
      recentDonations
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
