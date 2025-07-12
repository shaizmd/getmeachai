import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectdb';
import Page from '@/models/Page';

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
    
    // Check if user exists in database
    const user = await Page.findOne({ username: username.toLowerCase() });
    
    if (user) {
      return NextResponse.json({
        exists: true,
        user: user
      });
    } else {
      return NextResponse.json({
        exists: false
      });
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    return NextResponse.json(
      { error: 'Failed to check user existence' },
      { status: 500 }
    );
  }
}
