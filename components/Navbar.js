"use client";
import React, { useState, useEffect } from 'react';
import { Search, User, Menu, X, LogOut } from 'lucide-react';
import Logo from './Logo';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  // State Management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();

  // Effects
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Event Handlers
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Loading State - Prevent hydration mismatch
  if (!isMounted) {
    return (
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Match exact styling */}
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center group cursor-pointer">
                  <div className="w-16 h-16 transition-transform duration-200 hover:scale-110 mr-3">
                    <Logo />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    GetMeAChai
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links - Loading State */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <div className="w-16 h-6 bg-gray-100 rounded animate-pulse"></div>
                <div className="w-20 h-6 bg-gray-100 rounded animate-pulse"></div>
                <div className="w-12 h-6 bg-gray-100 rounded animate-pulse"></div>
                <div className="w-18 h-6 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Desktop Right Side - Loading State */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search placeholder */}
              <div className="w-64 h-10 bg-gray-100 rounded-full animate-pulse"></div>
              {/* Start Creating button placeholder */}
              <div className="w-28 h-10 bg-gray-100 rounded-full animate-pulse"></div>
              {/* Profile placeholder */}
              <div className="w-20 h-10 bg-gray-100 rounded-full animate-pulse"></div>
            </div>

            {/* Mobile Menu Button - Loading State */}
            <div className="md:hidden">
              <div className="w-10 h-10 bg-gray-100 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Main Navbar Component
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center group cursor-pointer">
                <div className="w-16 h-16 transition-transform duration-200 hover:scale-110 mr-3">
                  <Logo />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  GetMeAChai
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
              <Link 
                href="/discover" 
                className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-orange-50 cursor-pointer"
              >
                Discover
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-orange-50 cursor-pointer"
              >
                Dashboard
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-orange-50 cursor-pointer"
              >
                Pricing
              </Link>
              <Link 
                href="/resources" 
                className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-orange-50 cursor-pointer"
              >
                Resources
              </Link>
            </div>
          </div>

          {/* Desktop Right Side Controls */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search creators..."
                className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Start Creating Button */}
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 lg:px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer whitespace-nowrap">
              Start Creating
            </button>

            {/* Profile/Login Section */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors duration-200 min-w-0 cursor-pointer"
              >
                <User className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate max-w-[60px] lg:max-w-[80px]">
                  {session ? session.user?.name || 'Account' : 'Account'}
                </span>
              </button>
              
              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {session ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        Signed in as {session.user?.name}
                      </div>
                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/signin" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Sign In
                      </Link>
                      <Link 
                        href="/signup" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-500 p-2 rounded-md transition-colors duration-200 cursor-pointer"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          
          {/* Mobile Navigation Links */}
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/discover" 
              className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-50 transition-colors duration-200 cursor-pointer"
            >
              Discover
            </Link>
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-50 transition-colors duration-200 cursor-pointer"
            >
              Dashboard
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-50 transition-colors duration-200 cursor-pointer"
            >
              Pricing
            </Link>
            <Link 
              href="/resources" 
              className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-50 transition-colors duration-200 cursor-pointer"
            >
              Resources
            </Link>
          </div>

          {/* Mobile Search */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search creators..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="px-4 py-3 border-t border-gray-100 space-y-2">
            <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer">
              Start Creating
            </button>
            
            <div className="flex space-x-2">
              {session ? (
                <>
                  <div className="flex-1 text-center text-sm text-gray-600 px-4 py-2 truncate min-w-0">
                    Welcome, <span className="truncate max-w-[55px] inline-block">{session.user?.name}</span>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="flex-1 text-gray-700 hover:text-orange-500 px-4 py-2 rounded-full border border-gray-200 hover:border-orange-500 text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/signin"
                    className="flex-1 text-center text-gray-700 hover:text-orange-500 px-4 py-2 rounded-full border border-gray-200 hover:border-orange-500 text-sm font-medium transition-all duration-200 cursor-pointer"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/signup"
                    className="flex-1 text-center text-orange-500 hover:text-white px-4 py-2 rounded-full border border-orange-500 hover:bg-orange-500 text-sm font-medium transition-all duration-200 cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;