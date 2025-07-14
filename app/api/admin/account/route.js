import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Page from '@/models/Page';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // console.log('🔍 Session user:', session.user);
    
    // Secure user-page lookup: Only allow access to pages owned by the authenticated user
    let userPage = null;
    
    // Method 1: Try to find by username derived from session name
    if (session.user.name) {
      const derivedUsername = session.user.name.toLowerCase().replace(/\s+/g, '');
      userPage = await Page.findOne({ username: derivedUsername });
    //   console.log('👤 Search by derived username (' + derivedUsername + ') result:', userPage ? 'Found' : 'Not found');
    }
    
    // Method 2: If user has a specific mapping (you can add more mappings here)
    // For example, if user email is shaizmuhammed2005@gmail.com, map to specific username
    const userPageMappings = {
      'shaizmuhammed2005@gmail.com': 'mohammedshaiz', // Add mapping if page exists
      // Add more mappings as needed
    };
    
    if (!userPage && session.user.email && userPageMappings[session.user.email]) {
      userPage = await Page.findOne({ username: userPageMappings[session.user.email] });
    //   console.log('🔗 Search by email mapping result:', userPage ? 'Found' : 'Not found');
    }

    if (!userPage) {
      // Debug: List all pages to help troubleshooting
      const allPages = await Page.find({}).select('username title');
    //   console.log('📋 Available pages:', allPages);
      
      return NextResponse.json({ 
        error: 'Access denied. You can only access admin panel for your own page.',
        message: 'You must have a page created with a username that matches your login credentials to access the admin panel.',
        debug: {
          sessionUser: session.user,
          suggestion: 'Create a page with a username that matches your login name, or contact support if you believe this is an error.',
          availablePages: allPages.map(p => ({ username: p.username, title: p.title }))
        }
      }, { status: 403 });
    }

    const username = userPage.username;

    // Get all payments for this user
    const allPayments = await Payment.find({ 
      to_user: username 
    }).sort({ createdAt: -1 });

    const paidPayments = allPayments.filter(p => p.status === 'paid');
    const pendingPayments = allPayments.filter(p => p.status === 'pending');

    // Calculate stats
    const totalEarnings = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const availableBalance = totalEarnings * 0.95; // 5% platform fee
    const pendingCount = pendingPayments.length;

    // Format payments data
    const paymentsData = allPayments.map(payment => ({
      _id: payment._id,
      name: payment.name,
      email: payment.email,
      amount: payment.amount,
      message: payment.message,
      status: payment.status,
      trans_id: payment.trans_id,
      createdAt: payment.createdAt
    }));

    return NextResponse.json({
      username: userPage.username,
      email: session.user.email, // Use session email since page doesn't have email field
      category: userPage.category,
      createdAt: userPage.createdAt,
      isActive: userPage.isActive,
      goal: {
        title: userPage.goal.title,
        description: userPage.goal.description,
        targetAmount: userPage.goal.targetAmount,
        currentAmount: userPage.goal.currentAmount
      },
      totalEarnings,
      availableBalance,
      pendingCount,
      payments: paymentsData
    });

  } catch (error) {
    console.error('Error fetching admin account data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin account data' },
      { status: 500 }
    );
  }
}
