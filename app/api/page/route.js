import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const EDITABLE_PAGE_FIELDS = [
  'title',
  'description',
  'category',
  'coverImage',
  'profileImage',
  'about',
  'skills',
  'location',
  'recentUpdates',
  'links',
  'seo',
  'isActive',
];

function getSessionUsername(session) {
  const email = session?.user?.email;
  return email ? email.split('@')[0].toLowerCase() : null;
}

function getEditablePageData(pageData) {
  const editableData = {};

  for (const field of EDITABLE_PAGE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(pageData, field)) {
      editableData[field] = pageData[field];
    }
  }

  if (pageData.goal && typeof pageData.goal === 'object') {
    editableData.goal = {
      title: pageData.goal.title,
      description: pageData.goal.description,
      targetAmount: pageData.goal.targetAmount,
    };
  }

  return editableData;
}

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
    const session = await getServerSession(authOptions);
    const username = getSessionUsername(session);

    if (!username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const pageData = await request.json();
    const editableData = getEditablePageData(pageData);
    
    // Validate required fields
    if (!editableData.title || !editableData.description || !editableData.category || !editableData.about) {
      return NextResponse.json({ 
        error: 'Title, description, category, and about are required'
      }, { status: 400 });
    }
    
    // Check if page already exists
    const existingPage = await Page.findOne({ 
      username,
    });
    
    if (existingPage) {
      return NextResponse.json({ 
        error: 'Page already exists for this username' 
      }, { status: 409 });
    }
    
    // Create new page
    const newPage = new Page({
      ...editableData,
      username,
      goal: editableData.goal
        ? { ...editableData.goal, currentAmount: 0 }
        : editableData.goal,
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
    const session = await getServerSession(authOptions);
    const username = getSessionUsername(session);

    if (!username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const updateData = await request.json();
    const editableData = getEditablePageData(updateData);

    const existingPage = await Page.findOne({ username });

    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    if (editableData.goal) {
      editableData.goal = {
        ...existingPage.goal.toObject(),
        ...editableData.goal,
        currentAmount: existingPage.goal.currentAmount,
      };
    }

    Object.assign(existingPage, editableData);
    existingPage.username = username;
    existingPage.updatedAt = new Date();
    const updatedPage = await existingPage.save();
    
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
