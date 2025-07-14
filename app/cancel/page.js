"use client";
import React from 'react';
import { XCircle, Coffee, Heart, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import useDocumentTitle from '@/hooks/useDocumentTitle';

export default function Cancel() {
  useDocumentTitle('Payment Canceled - Support Creators Another Time');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          
          {/* Cancel Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-10 w-10 text-white" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <Coffee className="absolute top-2 left-4 w-6 h-6 text-orange-400 animate-pulse opacity-50" />
              <Heart className="absolute top-4 right-2 w-5 h-5 text-pink-400 animate-pulse opacity-50" />
              <Heart className="absolute bottom-2 left-2 w-4 h-4 text-purple-400 animate-pulse opacity-50" />
            </div>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Payment Canceled 😢
          </h1>
          
          <p className="text-gray-600 text-lg mb-6">
            No worries! Your payment was canceled and no charges were made. You can try again anytime.
          </p>

          {/* Encouragement Message */}
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800">
              💡 <strong>Did you know?</strong> Even small contributions make a big difference to creators!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => window.history.back()}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
            
            <Link 
              href="/"
              className="w-full bg-white text-gray-700 hover:text-orange-500 px-6 py-3 rounded-full font-semibold transition-all duration-200 border border-gray-200 hover:border-orange-500 hover:bg-orange-50 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            
            <Link 
              href="/discover"
              className="w-full bg-white text-gray-700 hover:text-orange-500 px-6 py-3 rounded-full font-semibold transition-all duration-200 border border-gray-200 hover:border-orange-500 hover:bg-orange-50 flex items-center justify-center space-x-2"
            >
              <Coffee className="h-4 w-4" />
              <span>Discover Creators</span>
            </Link>
          </div>

          {/* Additional Message */}
          <p className="text-sm text-gray-500 mt-6">
            Questions? <Link href="/contact" className="text-orange-500 hover:text-orange-600 font-medium">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
