import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await request.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Secure user-page lookup: Only allow access to pages owned by the authenticated user
    let userPage = null;
    
    // Method 1: Try to find by username derived from session name
    if (session.user.name) {
      const derivedUsername = session.user.name.toLowerCase().replace(/\s+/g, '');
      userPage = await Page.findOne({ username: derivedUsername });
    }
    
    // Method 2: If user has a specific mapping (you can add more mappings here)
    const userPageMappings = {
      'shaizmuhammed2005@gmail.com': 'mohammedshaiz', // Add mapping if page exists
      // Add more mappings as needed
    };
    
    if (!userPage && session.user.email && userPageMappings[session.user.email]) {
      userPage = await Page.findOne({ username: userPageMappings[session.user.email] });
    }

    if (!userPage) {
      return NextResponse.json({ 
        error: 'Access denied. You can only withdraw from your own page.',
        message: 'You must have a page created with a username that matches your login credentials to access withdrawals.'
      }, { status: 403 });
    }

    // In a real application, you would:
    // 1. Create a withdrawal request record
    // 2. Integrate with payment processor (Stripe Connect, PayPal, etc.)
    // 3. Handle bank account verification
    // 4. Process the actual withdrawal

    // For now, we'll just simulate the withdrawal request
    // console.log(`Withdrawal request: $${amount} for user ${userPage.username}`);

    // You could create a Withdrawal model to track withdrawal requests
    // const withdrawal = new Withdrawal({
    //   userId: userPage._id,
    //   amount: amount,
    //   status: 'pending',
    //   requestedAt: new Date()
    // });
    // await withdrawal.save();

    return NextResponse.json({
      message: 'Withdrawal request submitted successfully',
      amount: amount,
      status: 'pending',
      estimatedProcessingTime: '3-5 business days'
    });

  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json(
      { error: 'Failed to process withdrawal request' },
      { status: 500 }
    );
  }
}
