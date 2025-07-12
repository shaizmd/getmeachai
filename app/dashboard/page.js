"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Edit, Eye, BarChart3, Users, Coffee, Star, Settings, Plus, Globe } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasPage, setHasPage] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/signin');
      return;
    }
    
    checkUserPage();
  }, [session, status]);

  const checkUserPage = async () => {
    try {
      const username = session.user.email?.split('@')[0];
      
      // Check if user has a page
      const pageResponse = await fetch(`/api/page?username=${username}`);
      if (pageResponse.ok) {
        const pageData = await pageResponse.json();
        setPageData(pageData.page);
        setHasPage(true);
        
        // Fetch stats for the user
        const statsResponse = await fetch(`/api/profile?username=${username}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }
      } else {
        setHasPage(false);
      }
    } catch (error) {
      console.error('Error checking user page:', error);
      setHasPage(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = () => {
    router.push('/create-page');
  };

  const handleDiscoverPages = () => {
    router.push('/discover');
  };

  const handleViewProfile = () => {
    const username = session.user.email?.split('@')[0];
    router.push(`/${username}`);
  };

  const handleEditProfile = () => {
    router.push('/edit-page');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!hasPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to GetMeAChai!</h1>
            <p className="text-gray-600 mb-8">
              You don't have a creator page yet. Would you like to create one or explore existing creators?
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleCreatePage}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                <span>Create My Page</span>
              </button>
              
              <button
                onClick={handleDiscoverPages}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Globe className="h-5 w-5" />
                <span>Discover Creators</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Creator Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {session.user.name || session.user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleViewProfile}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span>View Profile</span>
              </button>
              <button
                onClick={handleEditProfile}
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Supporters</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalSupporters || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">${stats?.totalAmount || 0}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Coffee className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Goal Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pageData?.goal?.targetAmount ? 
                    Math.round(((pageData.goal.currentAmount || 0) / pageData.goal.targetAmount) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.rating || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={pageData?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face'} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pageData?.title}</h3>
                    <p className="text-gray-600">{pageData?.description}</p>
                    <p className="text-sm text-gray-500">{pageData?.category}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {pageData?.recentUpdates?.slice(0, 3).map((update, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 bg-gradient-to-r ${update.color} rounded-full mt-2`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{update.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(update.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Goal</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${pageData?.goal?.currentAmount || 0} / ${pageData?.goal?.targetAmount || 1000}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min(100, ((pageData?.goal?.currentAmount || 0) / (pageData?.goal?.targetAmount || 1000)) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{pageData?.goal?.title}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleViewProfile}
                  className="w-full flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Public Profile</span>
                </button>
                <button
                  onClick={handleEditProfile}
                  className="w-full flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleDiscoverPages}
                  className="w-full flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Globe className="h-4 w-4" />
                  <span>Discover Others</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
