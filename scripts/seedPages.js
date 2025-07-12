import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Import the Page model
import Page from '../models/Page.js';

// MongoDB connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Creator profiles data
const creatorProfiles = [
  {
    username: 'priyasharma',
    title: 'Digital Artist & UI Designer',
    description: 'Creating stunning digital illustrations and modern UI designs',
    category: 'art',
    coverImage: 'https://images.unsplash.com/photo-1558655146-364adaf25c34?w=1200&h=400&fit=crop&crop=center',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face',
    about: `Hey there! I'm Priya, a passionate digital artist and UI designer based in Mumbai. I specialize in creating beautiful illustrations, modern UI designs, and brand identities that tell stories and connect with people.

My journey started with traditional art, but I fell in love with digital creation tools and the endless possibilities they offer. I love experimenting with vibrant colors, unique compositions, and creating designs that inspire and delight.

Your support helps me continue creating art tutorials, design resources, and original artwork that I share with the community. I'm currently working on a comprehensive UI design course and building a library of free design resources for fellow creators.`,
    skills: ['Digital Art', 'UI/UX Design', 'Illustrations', 'Figma', 'Adobe Creative Suite', 'Procreate'],
    location: {
      city: 'Mumbai',
      country: 'India'
    },
    recentUpdates: [
      {
        title: 'Released new UI Kit for mobile apps',
        description: 'Just launched a comprehensive UI kit with 50+ screens and components for mobile app designers.',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        color: 'from-pink-500 to-purple-500'
      },
      {
        title: 'Digital Art Tutorial Series',
        description: 'Started a new tutorial series covering digital painting techniques and color theory.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        color: 'from-orange-500 to-pink-500'
      },
      {
        title: 'Client Project Showcase',
        description: 'Completed a brand identity project for a sustainable fashion startup.',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        color: 'from-purple-500 to-blue-500'
      }
    ],
    links: [
      { name: 'Behance Portfolio', url: 'https://behance.net/priyasharma' },
      { name: 'Instagram Art', url: 'https://instagram.com/priyasharma_art' },
      { name: 'Design Resources', url: 'https://priyasharma.design' },
      { name: 'YouTube Tutorials', url: 'https://youtube.com/@priyasharma' }
    ],
    goal: {
      title: 'New iPad Pro for Better Artwork',
      description: 'Help me upgrade to an iPad Pro with Apple Pencil for creating more detailed and professional digital artwork.',
      targetAmount: 1200,
      currentAmount: 340
    }
  },
  {
    username: 'rahulkumar',
    title: 'Full Stack Developer & Educator',
    description: 'Building modern web applications and sharing coding knowledge',
    category: 'tech',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=400&fit=crop&crop=center',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    about: `Hi! I'm Rahul, a full-stack developer from Bangalore with a passion for creating amazing web applications and teaching others to code. I specialize in the MERN stack and love building scalable, user-friendly applications.

I've been coding for over 6 years and have worked with startups and enterprises to build everything from simple websites to complex web applications. My goal is to make coding accessible to everyone through tutorials, open-source projects, and mentorship.

Your support helps me create more educational content, maintain open-source projects, and dedicate time to helping fellow developers grow their skills. I'm currently working on a comprehensive React course and building developer tools for the community.`,
    skills: ['React', 'Node.js', 'TypeScript', 'Next.js', 'MongoDB', 'AWS'],
    location: {
      city: 'Bangalore',
      country: 'India'
    },
    recentUpdates: [
      {
        title: 'Open-sourced React Component Library',
        description: 'Released a collection of 30+ reusable React components with TypeScript support.',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        color: 'from-blue-500 to-cyan-500'
      },
      {
        title: 'Next.js 15 Tutorial Series',
        description: 'Started a comprehensive tutorial series covering all the new features in Next.js 15.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        color: 'from-green-500 to-blue-500'
      },
      {
        title: 'Mentorship Program Launch',
        description: 'Launched a free mentorship program for aspiring developers.',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        color: 'from-purple-500 to-pink-500'
      }
    ],
    links: [
      { name: 'GitHub Profile', url: 'https://github.com/rahulkumar' },
      { name: 'YouTube Channel', url: 'https://youtube.com/@rahulkumar' },
      { name: 'Dev Blog', url: 'https://rahulkumar.dev' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/rahulkumar' }
    ],
    goal: {
      title: 'High-End Development Setup',
      description: 'Upgrading my development environment with better hardware and software licenses to create more quality content.',
      targetAmount: 2500,
      currentAmount: 890
    }
  },
  {
    username: 'ananyapatel',
    title: 'Travel Blogger & Content Writer',
    description: 'Exploring the world and sharing stories that inspire wanderlust',
    category: 'writing',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=400&fit=crop&crop=center',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
    about: `Namaste! I'm Ananya, a travel blogger and content writer based in Delhi. I'm passionate about exploring diverse cultures, hidden gems, and sharing stories that inspire others to travel and discover the world's beauty.

My journey started with a solo backpacking trip across Southeast Asia, and I've been documenting my adventures ever since. I focus on sustainable travel, cultural immersion, and budget-friendly tips that make travel accessible to everyone.

Your support helps me continue exploring new destinations, creating detailed travel guides, and sharing authentic stories from around the world. I'm currently working on a travel guidebook series and building a platform for responsible tourism.`,
    skills: ['Travel Writing', 'Content Creation', 'Photography', 'Social Media', 'Storytelling', 'SEO'],
    location: {
      city: 'Delhi',
      country: 'India'
    },
    recentUpdates: [
      {
        title: 'Rajasthan Travel Guide Published',
        description: 'Completed a comprehensive guide to exploring Rajasthan on a budget with local insights.',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        color: 'from-yellow-500 to-orange-500'
      },
      {
        title: 'Solo Female Travel Safety Series',
        description: 'Published a series of articles on solo female travel safety and empowerment.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        color: 'from-pink-500 to-red-500'
      },
      {
        title: 'Sustainable Travel Workshop',
        description: 'Conducted a workshop on sustainable and responsible travel practices.',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        color: 'from-green-500 to-teal-500'
      }
    ],
    links: [
      { name: 'Travel Blog', url: 'https://ananyapatel.blog' },
      { name: 'Instagram Travel', url: 'https://instagram.com/ananyapatel_travels' },
      { name: 'YouTube Vlogs', url: 'https://youtube.com/@ananyapatel' },
      { name: 'Travel Guides', url: 'https://guides.ananyapatel.blog' }
    ],
    goal: {
      title: 'Travel Documentation Equipment',
      description: 'Investing in professional camera gear and editing software to create higher quality travel content.',
      targetAmount: 1800,
      currentAmount: 650
    }
  },
  {
    username: 'arjunsingh',
    title: 'Independent Musician & Songwriter',
    description: 'Creating soulful melodies and acoustic covers that touch hearts',
    category: 'music',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop&crop=center',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    about: `Hey music lovers! I'm Arjun, an independent musician and songwriter from Pune. I create soulful acoustic music that blends Indian classical influences with contemporary sounds. My passion lies in creating music that tells stories and connects with people's emotions.

I've been playing guitar for over 8 years and have been writing original songs that reflect life experiences, love, and the beauty of everyday moments. I also create acoustic covers of popular songs with my own unique twist.

Your support helps me continue creating original music, investing in better recording equipment, and sharing my passion for music with the world. I'm currently working on my debut album and planning live performances across India.`,
    skills: ['Acoustic Guitar', 'Songwriting', 'Music Production', 'Vocals', 'Music Theory', 'Live Performance'],
    location: {
      city: 'Pune',
      country: 'India'
    },
    recentUpdates: [
      {
        title: 'New Original Song Released',
        description: 'Released "Monsoon Dreams" - an acoustic ballad about love and longing during the rainy season.',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        color: 'from-indigo-500 to-purple-500'
      },
      {
        title: 'Acoustic Cover Series',
        description: 'Started a weekly series of acoustic covers featuring Bollywood classics with modern arrangements.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        color: 'from-orange-500 to-yellow-500'
      },
      {
        title: 'Live Performance Announcement',
        description: 'Announced upcoming live performances at cafes and music venues in Pune.',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        color: 'from-pink-500 to-red-500'
      }
    ],
    links: [
      { name: 'Spotify', url: 'https://spotify.com/artist/arjunsingh' },
      { name: 'YouTube Music', url: 'https://youtube.com/@arjunsinghmusic' },
      { name: 'Instagram Music', url: 'https://instagram.com/arjunsingh_music' },
      { name: 'SoundCloud', url: 'https://soundcloud.com/arjunsingh' }
    ],
    goal: {
      title: 'Home Recording Studio Setup',
      description: 'Building a professional home recording studio to create high-quality music and collaborate with other artists.',
      targetAmount: 3000,
      currentAmount: 1250
    }
  },
  {
    username: 'kavyareddy',
    title: 'Traditional Artist & Cultural Preservationist',
    description: 'Bringing Indian culture to life through traditional paintings and art',
    category: 'art',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop&crop=center',
    profileImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&h=120&fit=crop&crop=face',
    about: `Vanakkam! I'm Kavya, a traditional artist from Chennai dedicated to preserving and promoting Indian cultural heritage through art. I specialize in traditional Indian painting styles including Madhubani, Tanjore, and Miniature paintings.

My journey began learning from my grandmother, who was a skilled traditional artist. I've spent years studying different regional art forms and their cultural significance. My mission is to keep these beautiful traditions alive while making them accessible to younger generations.

Your support helps me continue creating traditional artwork, conducting workshops to teach these art forms, and documenting the stories behind each painting style. I'm currently working on a series showcasing the diversity of Indian folk art traditions.`,
    skills: ['Traditional Painting', 'Madhubani Art', 'Tanjore Painting', 'Miniature Art', 'Cultural Research', 'Art Education'],
    location: {
      city: 'Chennai',
      country: 'India'
    },
    recentUpdates: [
      {
        title: 'Madhubani Art Workshop Series',
        description: 'Conducted a series of workshops teaching traditional Madhubani painting techniques to art enthusiasts.',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        color: 'from-red-500 to-pink-500'
      },
      {
        title: 'Cultural Heritage Exhibition',
        description: 'Participated in a cultural heritage exhibition showcasing traditional art from South India.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        color: 'from-yellow-500 to-orange-500'
      },
      {
        title: 'Art Documentation Project',
        description: 'Started documenting the stories and techniques behind traditional Indian art forms.',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        color: 'from-purple-500 to-indigo-500'
      }
    ],
    links: [
      { name: 'Art Gallery', url: 'https://kavyareddy.art' },
      { name: 'Cultural Blog', url: 'https://blog.kavyareddy.art' },
      { name: 'Instagram Art', url: 'https://instagram.com/kavyareddy_art' },
      { name: 'Workshop Schedule', url: 'https://workshops.kavyareddy.art' }
    ],
    goal: {
      title: 'Traditional Art Materials & Workshop Space',
      description: 'Investing in authentic traditional art materials and setting up a dedicated workshop space for teaching.',
      targetAmount: 2000,
      currentAmount: 780
    }
  },
  {
    username: 'vikramjoshi',
    title: 'AI Researcher & Technology Educator',
    description: 'Making artificial intelligence accessible through research and education',
    category: 'tech',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=400&fit=crop&crop=center',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face',
    about: `Hello! I'm Vikram, an AI researcher and educator from Hyderabad passionate about making artificial intelligence accessible to everyone. I work on cutting-edge AI research while dedicating time to education and knowledge sharing.

My expertise spans machine learning, deep learning, and natural language processing. I believe AI should be democratized and understandable to people from all backgrounds, not just those with advanced technical degrees.

Your support helps me continue my research, create educational content, and develop open-source AI tools that benefit the community. I'm currently working on a comprehensive AI course series and researching applications of AI in solving real-world problems.`,
    skills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow', 'Research', 'Technical Writing'],
    location: {
      city: 'Hyderabad',
      country: 'India'
    },
    recentUpdates: [
      {
        title: 'Open-Source AI Model Released',
        description: 'Released a lightweight AI model for image classification that runs on mobile devices.',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        color: 'from-cyan-500 to-blue-500'
      },
      {
        title: 'AI Ethics Research Paper',
        description: 'Published a research paper on ethical considerations in AI development and deployment.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        color: 'from-green-500 to-cyan-500'
      },
      {
        title: 'Machine Learning Bootcamp',
        description: 'Conducted a free ML bootcamp for students and professionals looking to enter the field.',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        color: 'from-purple-500 to-pink-500'
      }
    ],
    links: [
      { name: 'Research Papers', url: 'https://scholar.google.com/citations?user=vikramjoshi' },
      { name: 'GitHub Projects', url: 'https://github.com/vikramjoshi' },
      { name: 'AI Blog', url: 'https://vikramjoshi.ai' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/vikramjoshi' }
    ],
    goal: {
      title: 'AI Research Computing Resources',
      description: 'Upgrading computing infrastructure to conduct more advanced AI research and experiments.',
      targetAmount: 5000,
      currentAmount: 2100
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Page.deleteMany({});
    console.log('Cleared existing page data');
    
    // Insert new data
    const insertedPages = await Page.insertMany(creatorProfiles);
    console.log(`Successfully inserted ${insertedPages.length} creator pages`);
    
    // Display summary
    insertedPages.forEach(page => {
      console.log(`✓ ${page.username} - ${page.title}`);
    });
    
    console.log('\nDatabase seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding script
seedDatabase();
