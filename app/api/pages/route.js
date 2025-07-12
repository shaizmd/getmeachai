import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectdb';
import Page from '@/models/Page';

export async function GET() {
  try {
    await connectDB();
    
    // Get all pages, sorted by creation date (newest first)
    const pages = await Page.find({}).sort({ createdAt: -1 }).limit(20);
    
    return NextResponse.json({
      success: true,
      pages: pages,
      count: pages.length
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}
