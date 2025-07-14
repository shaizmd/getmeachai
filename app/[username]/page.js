"use client";
import React, { useState, useEffect, use } from 'react';
import { Heart, Share2, Coffee, Users, Star, Check, MapPin, Calendar, Link as LinkIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ChaiButton from '@/components/ChaiButton';
import { formatUsername, isValidUsername } from '../../lib/userUtils';
import useDocumentTitle from '@/hooks/useDocumentTitle';

export default function UserProfilePage({ params }) {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState('$5');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [userExists, setUserExists] = useState(null); // null = checking, false = not found, true = found
  const [profileData, setProfileData] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  // Dynamic title based on page data
  useDocumentTitle(
    pageData ? `${pageData.title} (@${username}) - Support This Creator` : 
    username ? `@${username} - Creator Profile` : 
    'Creator Profile'
  );

  // Show authentication warning if not logged in
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  
  // Check if current user is viewing their own page
  const isOwnPage = username && session?.user?.email && 
    (session.user.email.split('@')[0].toLowerCase() === username.toLowerCase() ||
     session.user.name?.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') === username.toLowerCase());

  const predefinedAmounts = ['$3', '$5', '$10', '$25', '$50'];

  // Get creator-specific content from database or fallback to default
  const getCreatorContent = () => {
    if (pageData) {
      return {
        title: pageData.title,
        description: pageData.description,
        category: pageData.category,
        skills: pageData.skills,
        about: pageData.about,
        recentUpdates: pageData.recentUpdates,
        goalTitle: pageData.goal?.title || 'Creative Equipment Upgrade',
        goalDescription: pageData.goal?.description || 'Investing in better equipment and tools to create higher quality content.',
        links: pageData.links || [],
        coverImage: pageData.coverImage,
        profileImage: pageData.profileImage,
        location: pageData.location || { city: 'Unknown', country: 'Unknown' }
      };
    }
    
    // Fallback default content
    return {
      title: 'Creative Professional',
      description: 'Passionate creator sharing their work with the world',
      category: 'general',
      skills: ['Creative Work', 'Content Creation', 'Community Building'],
      about: `Hello! I'm a creative professional passionate about sharing my work and connecting with supporters. Your support helps me continue creating and sharing valuable content with the community.`,
      recentUpdates: [
        {
          title: 'New content published',
          description: 'Recently shared new creative work with the community.',
          date: '1 week ago',
          color: 'from-orange-500 to-pink-500'
        }
      ],
      goalTitle: 'Creative Equipment Upgrade',
      goalDescription: 'Investing in better equipment and tools to create higher quality content.',
      links: [
        { name: 'Portfolio', url: '#' },
        { name: 'Social Media', url: '#' }
      ],
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=400&fit=crop&crop=center',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      location: { city: 'Unknown', country: 'Unknown' }
    };
  };

  // Get creator-specific content
  const creatorContent = getCreatorContent();

  // Function to fetch page data from database
  const fetchPageData = async (username) => {
    try {
      const response = await fetch(`/api/page?username=${encodeURIComponent(username)}`);
      
      if (response.ok) {
        const data = await response.json();
        setPageData(data.page);
        return true;
      } else {
        console.error('Failed to fetch page data');
        return false;
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
      return false;
    }
  };

  // Function to fetch profile data from database
  const fetchProfileData = async (username) => {
    try {
      const response = await fetch(`/api/profile?username=${encodeURIComponent(username)}`);
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Function to check if user exists in our system
  const checkUserExists = async (username) => {
    try {
      const response = await fetch(`/api/check-user?username=${encodeURIComponent(username)}`);
      
      if (!response.ok) {
        console.error('Failed to check user existence:', response.statusText);
        // If API call fails, treat as user not found
        return false;
      }
      
      const result = await response.json();
      
      if (result.exists) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      // If there's an error, treat as user not found for security
      return false;
    }
  };

  // Unwrap params using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    const validateAndLoadUser = async () => {
      try {
        // Extract username from resolved params
        const extractedUsername = resolvedParams.username;
        
        // Check if username is valid using the validation function
        if (!isValidUsername(extractedUsername)) {
          setUserExists(false);
          return;
        }
        
        // Check if user exists in database
        const exists = await checkUserExists(extractedUsername);
        if (!exists) {
          setUserExists(false);
          return;
        }
        
        // User exists, proceed with loading
        setUserExists(true);
        setUsername(extractedUsername);
        
        // Fetch page data first
        const pageDataLoaded = await fetchPageData(extractedUsername);
        
        // Fetch profile data
        await fetchProfileData(extractedUsername);
        
        // If page data couldn't be loaded, we still allow the page to render with fallback content
        if (!pageDataLoaded) {
          console.warn('Page data not found, using fallback content');
        }
      } catch (error) {
        console.error('Error validating user:', error);
        setUserExists(false);
      } finally {
        setLoading(false);
      }
    };

    validateAndLoadUser();
  }, [resolvedParams, session]);

  // If user doesn't exist, trigger 404
  if (userExists === false) {
    notFound();
  }

  // Show loading state while checking username and fetching data
  if (userExists === null || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Cover Photo Section */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img 
          src={creatorContent.coverImage} 
          alt={`${username} cover photo`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=400&fit=crop&crop=center';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
      </div>

      {/* Profile Header Section */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 -mt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Profile Picture */}
            <div className="relative inline-block mb-6">
              <img 
                src={creatorContent.profileImage} 
                alt={username} 
                className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-xl"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face';
                }}
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-3 border-white"></div>
            </div>
            
            {/* Name and Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 px-4">{profileData?.user?.title || pageData?.title || username}</h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-4 px-4">{creatorContent.title}</p>
            
            {/* Location and Join Date */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 mb-6 px-4">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{creatorContent.location.city}, {creatorContent.location.country}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Joined {
                  profileData?.user?.createdAt ? 
                    new Date(profileData.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
                    pageData?.createdAt ? 
                      new Date(pageData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
                      'Recently'
                }</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm px-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-orange-600">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">{profileData?.stats?.totalSupporters || 0}</span>
                </div>
                <span className="text-gray-500">supporters</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-pink-600">
                  <Coffee className="h-4 w-4" />
                  <span className="font-semibold">${profileData?.stats?.totalAmount || 0}</span>
                </div>
                <span className="text-gray-500">raised</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-yellow-600">
                  <Star className="h-4 w-4" />
                  <span className="font-semibold">{profileData?.stats?.rating || '4.9'}</span>
                </div>
                <span className="text-gray-500">rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">About</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-4 sm:mb-6">
                  {creatorContent.description}
                </p>
                <div className="text-gray-600 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                  {creatorContent.about}
                </div>
              </div>
              
              {/* Skills/Tech Stack */}
              <div className="mt-6 sm:mt-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {(creatorContent.skills || []).map((skill, index) => (
                    <span key={index} className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Recent Updates</h2>
              <div className="space-y-4 sm:space-y-6">
                {(creatorContent.recentUpdates || []).map((update, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`w-3 h-3 bg-gradient-to-r ${update.color} rounded-full mt-2 flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold text-base sm:text-lg truncate sm:whitespace-normal">{update.title}</p>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">{update.description}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        {(() => {
                          if (update.date instanceof Date) {
                            return update.date.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            });
                          }
                          if (typeof update.date === 'string' && update.date.includes('ago')) {
                            return update.date;
                          }
                          try {
                            return new Date(update.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            });
                          } catch {
                            return update.date || 'Recently';
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {(creatorContent.links || []).map((link, index) => (
                  <a key={index} href={link.url} className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                    <span className="text-gray-900 font-medium text-sm sm:text-base truncate">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Support Section */}
          <div className="space-y-8">
            
            {/* Support Card - Only show if not own page */}
            {!isOwnPage && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Buy me a chai ☕</h2>
                <button className="text-gray-400 hover:text-orange-500 transition-colors duration-200 cursor-pointer p-1">
                  <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              {/* Amount Selection */}
              <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">Choose an amount</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        selectedAmount === amount
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Message */}
              <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Add a message (optional)</label>
                <textarea
                  placeholder="Say something nice..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                  rows="3"
                />
              </div>

              {/* Support Button */}
              {session ? (
                <ChaiButton 
                  amount={customAmount ? parseFloat(customAmount) : parseFloat(selectedAmount.replace('$', ''))}
                  message={message}
                  creatorName={username}
                  customClassName="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
                />
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <button 
                    onClick={() => setShowAuthWarning(true)}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Coffee className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Support Creator</span>
                  </button>
                  
                  {showAuthWarning && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 text-center">
                      <p className="text-orange-800 text-sm mb-2 sm:mb-3">
                        🔒 Please sign in to support this creator
                      </p>
                      <div className="space-y-2">
                        <button 
                          onClick={() => router.push('/signin')}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Sign In
                        </button>
                        <button 
                          onClick={() => router.push('/signup')}
                          className="w-full bg-white hover:bg-gray-50 text-orange-500 border border-orange-500 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Create Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4">
                🔒 Secure payment powered by <span className='font-bold'>Stripe</span>
              </p>
            </div>
            )}
            
            {/* Manage Page Button - Only show if own page */}
            {isOwnPage && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">This is your page</h2>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Manage your creator page and track your progress</p>
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Recent Supporters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Recent Supporters</h3>
              <div className="space-y-3 sm:space-y-4">
                {profileData?.recentSupporters?.length > 0 ? (
                  profileData.recentSupporters.map((supporter, index) => (
                    <div key={index} className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-bold flex-shrink-0">
                        {supporter.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{supporter.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500">${supporter.amount} • {new Date(supporter.date).toLocaleDateString()}</p>
                        {supporter.message && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate sm:whitespace-normal">"{supporter.message}"</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <Coffee className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                    <p className="text-gray-500 text-sm sm:text-base">No supporters yet</p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">Be the first to support this creator!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Goal */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Current Goal</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-medium text-gray-900 truncate pr-2">{creatorContent.goalTitle}</span>
                  <span className="text-base sm:text-lg font-bold text-gray-900 flex-shrink-0">
                    ${pageData?.goal?.currentAmount || profileData?.goal?.current || 0} / ${pageData?.goal?.targetAmount || profileData?.goal?.target || 1000}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 h-2.5 sm:h-3 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min(100, ((pageData?.goal?.currentAmount || profileData?.goal?.current || 0) / (pageData?.goal?.targetAmount || profileData?.goal?.target || 1000)) * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm text-gray-600">
                    {Math.round(((pageData?.goal?.currentAmount || profileData?.goal?.current || 0) / (pageData?.goal?.targetAmount || profileData?.goal?.target || 1000)) * 100)}% complete
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    ${Math.max(0, (pageData?.goal?.targetAmount || profileData?.goal?.target || 1000) - (pageData?.goal?.currentAmount || profileData?.goal?.current || 0))} to go
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                  {creatorContent.goalDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}