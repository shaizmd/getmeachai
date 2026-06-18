"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, Coffee, Heart, ArrowLeft, RefreshCw, Users } from 'lucide-react';

const Custom404Page = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [steamAnimation] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const popularCreators = [
    { name: 'Priya Sharma', category: 'Digital Art' },
    { name: 'Rahul Kumar', category: 'Tech Tutorials' },
    { name: 'Ananya Patel', category: 'Travel Stories' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
              4
              <span className="relative inline-block">
                <Coffee
                  className={`inline-block w-20 h-20 md:w-24 md:h-24 text-orange-500 transform transition-all duration-500 ${
                    isAnimating ? 'rotate-12 scale-110' : ''
                  }`}
                />
                {steamAnimation && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-gradient-to-t from-orange-300 to-transparent rounded-full animate-pulse"></div>
                      <div className="w-1 h-6 bg-gradient-to-t from-orange-300 to-transparent rounded-full animate-pulse delay-150"></div>
                      <div className="w-1 h-4 bg-gradient-to-t from-orange-300 to-transparent rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                )}
              </span>
              4
            </div>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <Heart className="absolute top-1/4 left-1/4 w-6 h-6 text-pink-400 animate-bounce" style={{ animationDelay: '0s' }} />
              <Heart className="absolute top-1/3 right-1/4 w-4 h-4 text-orange-400 animate-bounce" style={{ animationDelay: '1s' }} />
              <Heart className="absolute bottom-1/3 left-1/3 w-5 h-5 text-pink-300 animate-bounce" style={{ animationDelay: '2s' }} />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Oops! This page seems to have gone for a chai break
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you might have mistyped the URL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 bg-white text-gray-700 hover:text-orange-500 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-orange-500 hover:bg-orange-50"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-white text-gray-700 hover:text-orange-500 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-orange-500 hover:bg-orange-50"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Looking for something specific?</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search creators, categories..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/discover?search=${e.target.value}`;
                  }
                }}
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center space-x-2">
              <Users className="h-5 w-5 text-orange-500" />
              <span>Popular Creators</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {popularCreators.map((creator) => (
                <div key={creator.name} className="group cursor-pointer">
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg p-4 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                      {creator.name.split(' ').map((namePart) => namePart[0]).join('')}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{creator.name}</h4>
                    <p className="text-xs text-white/80">{creator.category}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.location.href = '/discover'}
              className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors duration-200"
            >
              View All Creators
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Still having trouble?{' '}
              <Link href="/contact" className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom404Page;
