import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }
    
    // Find the page data for the user
    const pageData = await Page.findOne({ 
      username: username.toLowerCase(),
      isActive: true 
    });
    
    if (!pageData) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    // Return the page data
    return NextResponse.json({
      success: true,
      page: pageData
    });
    
  } catch (error) {
    console.error('Error fetching page data:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const pageData = await request.json();
    
    // Validate required fields
    if (!pageData.username || !pageData.title || !pageData.description || !pageData.category || !pageData.about) {
      return NextResponse.json({ 
        error: 'Username, title, description, category, and about are required' 
      }, { status: 400 });
    }
    
    // Check if page already exists
    const existingPage = await Page.findOne({ 
      username: pageData.username.toLowerCase() 
    });
    
    if (existingPage) {
      return NextResponse.json({ 
        error: 'Page already exists for this username' 
      }, { status: 409 });
    }
    
    // Create new page
    const newPage = new Page({
      ...pageData,
      username: pageData.username.toLowerCase(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newPage.save();
    
    return NextResponse.json({
      success: true,
      page: newPage
    });
    
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const urlUsername = searchParams.get('username');
    const updateData = await request.json();
    const username = urlUsername || updateData.username;
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Update the page data
    const updatedPage = await Page.findOneAndUpdate(
      { username: username.toLowerCase() },
      { ...updateData, username: username.toLowerCase(), updatedAt: new Date() },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({
      success: true,
      page: updatedPage
    });
    
  } catch (error) {
    console.error('Error updating page data:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
