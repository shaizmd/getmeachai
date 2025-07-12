"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Github, Eye, EyeOff, ArrowRight, Coffee, Heart } from 'lucide-react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleGoogleSignIn = async () => {
    try {
      toast.info('Redirecting to Google...', {
        position: "top-right",
        autoClose: 2000,
      });
      
      await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: true 
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Google sign in failed. Please try again.', {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      toast.info('Redirecting to GitHub...', {
        position: "top-right",
        autoClose: 2000,
      });
      
      await signIn('github', { 
        callbackUrl: '/dashboard',
        redirect: true 
      });
    } catch (error) {
      console.error('GitHub sign in error:', error);
      toast.error('GitHub sign in failed. Please try again.', {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    toast.info('Signing you in...', {
      position: "top-right",
      autoClose: 2000,
    });

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password. Please try again.', {
          position: "top-right",
          autoClose: 4000,
        });
      } else if (result?.ok) {
        toast.success('Sign in successful! Redirecting to dashboard...', {
          position: 'top-right',
          autoClose: 3000,
        });
        
        // Redirect to dashboard after successful signin
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Signin error:', error);
      toast.error('Network error. Please try again.', {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(249, 115, 22, 0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-4 md:left-10 animate-bounce hidden sm:block">
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-4 shadow-lg">
          <Coffee className="h-4 w-4 md:h-6 md:w-6 text-orange-500" />
        </div>
      </div>
      
      <div className="absolute top-32 right-4 md:right-16 animate-pulse hidden sm:block">
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-4 shadow-lg">
          <Heart className="h-4 w-4 md:h-6 md:w-6 text-pink-500" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome back to <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">GetMeAChai</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to continue your journey
            </p>
          </div>

          {/* Sign In Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8">
            {/* Social Login Buttons */}
            <div className="space-y-4 mb-6">
              <button 
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-full text-gray-700 font-medium hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button 
                onClick={handleGitHubSignIn}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-full text-gray-700 font-medium hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <Github className="w-5 h-5 mr-3" />
                Continue with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="button"
                onClick={handleEmailSignIn}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign In
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default SignInPage;