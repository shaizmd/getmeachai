"use client";
import React, { useEffect, useState } from 'react';
import { CheckCircle, Coffee, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import useDocumentTitle from '@/hooks/useDocumentTitle';

export default function Success() {
  useDocumentTitle('Payment Successful - Thank You for Your Support');
  
  const [sessionId, setSessionId] = useState('');
  const [donationData, setDonationData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = urlParams.get('session_id');
    
    if (sessionIdFromUrl) {
      setSessionId(sessionIdFromUrl);
      
      // Extract donation data from URL params
      const amount = urlParams.get('amount');
      const creatorName = urlParams.get('creator');
      const message = urlParams.get('message');
      
      if (amount && creatorName) {
        setDonationData({
          amount: parseFloat(amount),
          creatorName,
          message: message || '',
          sessionId: sessionIdFromUrl
        });
        
        // Save payment to database
        savePaymentToDatabase(sessionIdFromUrl);
      }
    }
  }, []);

  // Function to save payment to database
  const savePaymentToDatabase = async (sessionId) => {
    try {
      const response = await fetch('/api/save-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Failed to save payment:', result.error);
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  // Function to handle viewing dashboard with donation data
  const handleViewDashboard = () => {
    // Redirect to dashboard with success parameter
    window.location.href = '/dashboard?payment_success=true';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <Coffee className="absolute top-2 left-4 w-6 h-6 text-orange-400 animate-bounce" style={{ animationDelay: '0s' }} />
              <Heart className="absolute top-4 right-2 w-5 h-5 text-pink-400 animate-bounce" style={{ animationDelay: '1s' }} />
              <Heart className="absolute bottom-2 left-2 w-4 h-4 text-purple-400 animate-bounce" style={{ animationDelay: '2s' }} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-gray-600 text-lg mb-6">
            Thank you for your generous support! Your chai has been delivered to the creator.
          </p>

          {/* Session ID */}
          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-500 mb-1">Transaction ID:</p>
              <p className="text-xs text-gray-700 font-mono break-all">{sessionId}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleViewDashboard}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>View Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <Link 
              href="/"
              className="w-full bg-white text-gray-700 hover:text-orange-500 px-6 py-3 rounded-full font-semibold transition-all duration-200 border border-gray-200 hover:border-orange-500 hover:bg-orange-50 flex items-center justify-center space-x-2"
            >
              <span>Back to Home</span>
            </Link>
            
            <Link 
              href="/discover"
              className="w-full bg-white text-gray-700 hover:text-orange-500 px-6 py-3 rounded-full font-semibold transition-all duration-200 border border-gray-200 hover:border-orange-500 hover:bg-orange-50 flex items-center justify-center space-x-2"
            >
              <Coffee className="h-4 w-4" />
              <span>Discover More Creators</span>
            </Link>
          </div>

          {/* Additional Message */}
          <p className="text-sm text-gray-500 mt-6">
            Your support helps creators continue doing what they love! ☕
          </p>
        </div>
      </div>
    </div>
  );
}
