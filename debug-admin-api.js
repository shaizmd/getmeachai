require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Import models
const Page = require('./models/Page.js').default;

async function testAdminAPI() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Test if kavyareddy page exists
    const userPage = await Page.findOne({ username: 'kavyareddy' });
    
    if (userPage) {
      console.log('✅ Found kavyareddy page:');
      console.log('Username:', userPage.username);
      console.log('Title:', userPage.title);
      console.log('Email:', userPage.email);
      console.log('Category:', userPage.category);
      console.log('Created:', userPage.createdAt);
    } else {
      console.log('❌ kavyareddy page not found');
      
      // Check all pages
      const allPages = await Page.find({});
      console.log('Available pages:', allPages.map(p => ({ username: p.username, email: p.email })));
    }
    
    // Test API endpoint manually
    console.log('\n🔍 Testing API endpoint...');
    console.log('Make sure to:');
    console.log('1. Be logged in with the same email as the page');
    console.log('2. Access: http://localhost:3000/api/admin/account');
    console.log('3. Check browser network tab for detailed error');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testAdminAPI();
