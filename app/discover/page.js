"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Users, MapPin, Star, Heart, Coffee, Eye, Filter, Grid, List, RefreshCw } from 'lucide-react';
import useDocumentTitle from '@/hooks/useDocumentTitle';

export default function Discover() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Dynamic title based on search/filter state
  const getPageTitle = () => {
    if (searchTerm && selectedCategory && selectedCategory !== 'All') {
      return `"${searchTerm}" in ${selectedCategory} - Discover Creators`;
    } else if (searchTerm) {
      return `"${searchTerm}" - Search Results`;
    } else if (selectedCategory && selectedCategory !== 'All') {
      return `${selectedCategory} Creators - Discover`;
    } else {
      return 'Discover Creators - Find Amazing People to Support';
    }
  };

  useDocumentTitle(getPageTitle(), [searchTerm, selectedCategory]);

  const categories = [
    'All', 'Technology', 'Art & Design', 'Music', 'Gaming', 'Education', 'Health & Fitness',
    'Food & Cooking', 'Travel', 'Business', 'Sports', 'Photography', 'Writing', 'Other'
  ];

  // Category mapping from display names to database values
  const categoryMapping = {
    'All': '',
    'Technology': 'tech',
    'Art & Design': 'art',
    'Music': 'music',
    'Gaming': 'gaming',
    'Education': 'education',
    'Health & Fitness': 'health',
    'Food & Cooking': 'lifestyle',
    'Travel': 'lifestyle',
    'Business': 'business',
    'Sports': 'lifestyle',
    'Photography': 'art',
    'Writing': 'writing',
    'Other': 'other'
  };

  // Reverse mapping for display
  const categoryDisplayMap = {
    'tech': 'Technology',
    'art': 'Art & Design',
    'music': 'Music',
    'gaming': 'Gaming',
    'education': 'Education',
    'health': 'Health & Fitness',
    'lifestyle': 'Lifestyle',
    'business': 'Business',
    'writing': 'Writing',
    'other': 'Other'
  };

  useEffect(() => {
    fetchPages();
    
    // Auto-refresh every 30 seconds to keep goal amounts up-to-date
    const interval = setInterval(fetchPages, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterPages();
  }, [pages, searchTerm, selectedCategory, session]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages);
      } else {
        console.error('Failed to fetch pages');
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPages = () => {
    let filtered = pages;

    // Exclude current user's own page
    if (session?.user?.email) {
      const currentUsername = session.user.email.split('@')[0];
      filtered = filtered.filter(page => page.username !== currentUsername);
    }

    if (searchTerm) {
      filtered = filtered.filter(page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      const dbCategory = categoryMapping[selectedCategory];
      filtered = filtered.filter(page => page.category === dbCategory);
    }

    setFilteredPages(filtered);
  };

  const handlePageClick = (username) => {
    router.push(`/${username}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Discovering amazing creators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Discover Amazing Creators</h1>
            <p className="text-xl text-orange-100 mb-8">
              Support creators and help them achieve their goals
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search creators, categories, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/20 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-70 focus:bg-white shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  (selectedCategory === category || (selectedCategory === '' && category === 'All'))
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchPages}
              disabled={loading}
              className="p-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 cursor-pointer transition-colors"
              title="Refresh goal amounts"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredPages.length === 0 ? (
              'No creators found'
            ) : (
              <>
                Showing {filteredPages.length} creator{filteredPages.length !== 1 ? 's' : ''}
                {session?.user?.email && (
                  <span className="ml-1">(excluding your own page)</span>
                )}
              </>
            )}
          </div>
          {filteredPages.length > 0 && (
            <div className="text-sm text-gray-500">
              {searchTerm && `Search: "${searchTerm}"`}
              {searchTerm && selectedCategory && ' • '}
              {selectedCategory && selectedCategory !== 'All' && `Category: ${selectedCategory}`}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredPages.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No creators found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredPages.map((page) => (
              <div
                key={page.username}
                onClick={() => handlePageClick(page.username)}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  viewMode === 'list' ? 'flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6' : 'overflow-hidden'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Cover Image */}
                    <div className="h-48 relative">
                      <img
                        src={page.coverImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'}
                        alt={page.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {categoryDisplayMap[page.category] || page.category}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={page.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'}
                          alt={page.title}
                          className="w-12 h-12 rounded-full"
                          loading="lazy"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{page.title}</h3>
                          <p className="text-sm text-gray-600">@{page.username}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-2">{page.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        {page.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{page.location.city}, {page.location.country}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>4.8</span>
                        </div>
                      </div>
                      
                      {/* Goal Progress */}
                      {page.goal && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Goal Progress</span>
                            <span className="text-sm font-medium">
                              ${page.goal.currentAmount || 0} / ${page.goal.targetAmount}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min(100, ((page.goal.currentAmount || 0) / page.goal.targetAmount) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">Support</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">View Profile</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={page.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'}
                        alt={page.title}
                        className="w-16 h-16 rounded-full mx-auto sm:mx-0"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 sm:mb-0">{page.title}</h3>
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium mx-auto sm:mx-0 w-fit">
                          {categoryDisplayMap[page.category] || page.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 text-sm sm:text-base">{page.description}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 space-y-1 sm:space-y-0">
                          <span>@{page.username}</span>
                          {page.location && (
                            <div className="flex items-center justify-center sm:justify-start space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{page.location.city}, {page.location.country}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-center sm:justify-start space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>4.8</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center sm:justify-end space-x-2">
                          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">Support</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm">View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}