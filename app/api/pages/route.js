import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectdb';
import Page from '@/models/Page';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    await connectDB();
    
    // Get all pages, sorted by creation date (newest first)
    const pages = await Page.find({}).sort({ createdAt: -1 }).limit(20);
    
    // Update goal amounts with real payment data
    const updatedPages = await Promise.all(
      pages.map(async (page) => {
        if (page.goal) {
          // Calculate total amount for this user from all paid payments
          const totalAmount = await Payment.aggregate([
            { $match: { to_user: page.username, status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]);
          
          const currentAmount = totalAmount.length > 0 ? totalAmount[0].total : 0;
          
          // Update the page's goal if it's different
          if (page.goal.currentAmount !== currentAmount) {
            page.goal.currentAmount = currentAmount;
            await page.save();
          }
        }
        return page;
      })
    );
    
    return NextResponse.json({
      success: true,
      pages: updatedPages,
      count: updatedPages.length
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}
