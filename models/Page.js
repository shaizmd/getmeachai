import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  // Basic user information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // Profile information
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  category: {
    type: String,
    required: true,
    enum: ['art', 'tech', 'writing', 'music', 'education', 'gaming', 'lifestyle', 'business', 'health', 'other'],
    default: 'other'
  },
  
  // Images
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=400&fit=crop&crop=center'
  },
  
  profileImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face'
  },
  
  // About section
  about: {
    type: String,
    required: true
  },
  
  // Skills and expertise
  skills: [{
    type: String,
    trim: true
  }],
  
  // Location information
  location: {
    city: {
      type: String,
      default: 'Unknown'
    },
    country: {
      type: String,
      default: 'Unknown'
    }
  },
  
  // Recent updates/activity
  recentUpdates: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    color: {
      type: String,
      default: 'from-orange-500 to-pink-500'
    }
  }],
  
  // Social links
  links: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  
  // Current goal
  goal: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    targetAmount: {
      type: Number,
      default: 1000
    },
    currentAmount: {
      type: Number,
      default: 0
    }
  },
  
  // Page settings
  isActive: {
    type: Boolean,
    default: true
  },
  
  // SEO and metadata
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
pageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
pageSchema.index({ category: 1 });
pageSchema.index({ isActive: 1 });
pageSchema.index({ createdAt: -1 });

const Page = mongoose.models.Page || mongoose.model('Page', pageSchema);

export default Page;
