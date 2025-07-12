import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectdb';
import Page from '@/models/Page';
import Payment from '@/models/Payment';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get username from query parameters
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      );
    }
    
    // Find user page by username
    const userPage = await Page.findOne({ username: username.toLowerCase() });
    
    if (!userPage) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get real payment data from database
    const payments = await Payment.find({ 
      to_user: username.toLowerCase() 
    }).sort({ createdAt: -1 });
    
    // Calculate real statistics
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalSupporters = new Set(payments.map(p => p.name)).size;
    const totalPayments = payments.length;
    
    // Calculate monthly growth
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const thisMonthAmount = payments
      .filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const lastMonthAmount = payments
      .filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const monthlyGrowth = lastMonthAmount > 0 ? 
      Math.round(((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100) : 
      thisMonthAmount > 0 ? 100 : 0;
    
    // Get recent supporters (last 10)
    const recentSupporters = payments.slice(0, 10).map(payment => ({
      name: payment.name,
      amount: payment.amount,
      message: payment.message,
      date: payment.createdAt
    }));
    
    // Get top supporters (by total amount)
    const supporterTotals = {};
    payments.forEach(payment => {
      if (supporterTotals[payment.name]) {
        supporterTotals[payment.name] += payment.amount;
      } else {
        supporterTotals[payment.name] = payment.amount;
      }
    });
    
    const topSupporters = Object.entries(supporterTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    // Update the goal current amount with real data
    if (userPage.goal) {
      userPage.goal.currentAmount = totalAmount;
      await userPage.save();
    }
    
    // Return real profile data
    const profileData = {
      user: userPage,
      stats: {
        totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
        totalSupporters: totalSupporters,
        totalPayments: totalPayments,
        monthlyGrowth: monthlyGrowth,
        rating: 4.9, // Default rating - could be calculated from feedback in the future
      },
      recentSupporters: recentSupporters,
      topSupporters: topSupporters,
      goal: {
        current: totalAmount,
        target: userPage.goal?.targetAmount || 1000
      }
    };
    
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}
