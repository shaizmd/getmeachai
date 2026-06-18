"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Coffee, 
  Heart, 
  Users, 
  TrendingUp, 
  Star, 
  Play, 
  ChevronRight, 
  Check, 
  ArrowRight,
  Zap,
  Shield,
  Globe,
  DollarSign,
  MessageSquare,
  Gift
} from 'lucide-react';

const MainContent = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    creators: 0,
    supporters: 0,
    raised: 0
  });

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animate stats on mount
  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => {
      setAnimatedStats({
        creators: 50000,
        supporters: 2000000,
        raised: 15000000
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [isMounted]);

  // Testimonial rotation
  useEffect(() => {
    if (!isMounted) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isMounted]);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      content: "GetMeAChai has completely transformed how I connect with my audience. The support means everything!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Alex Rodriguez",
      role: "Podcaster",
      content: "Simple, elegant, and effective. My listeners love how easy it is to show their support.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Maya Patel",
      role: "Artist",
      content: "The community features help me stay connected with my biggest supporters. It's amazing!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];

  // Handle authentication before navigation
  const handleBuyMeAChai = () => {
    if (status === 'loading') return; // Don't navigate while loading
    
    // Always navigate to discover page
    router.push('/discover');
  };

  const handleStartYourPage = () => {
    if (status === 'loading') return; // Don't navigate while loading
    
    if (!session) {
      // User not authenticated, redirect to sign up
      router.push('/signup');
    } else {
      // User authenticated, redirect to dashboard or profile setup
      router.push('/dashboard');
    }
  };

  const features = [
    {
      icon: <Coffee className="h-6 w-6" />,
      title: "Accept Support",
      description: "Receive one-time support or recurring monthly contributions from your fans"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Engage Fans",
      description: "Send updates, exclusive content, and personal messages to your supporters"
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: "Offer Rewards",
      description: "Create membership tiers with exclusive perks and benefits"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Track Growth",
      description: "Monitor your progress with detailed analytics and insights"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing with instant transfers"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Reach",
      description: "Accept support from fans worldwide in multiple currencies"
    }
  ];

  

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(249, 115, 22, 0.1) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 text-orange-600 text-sm font-medium mb-8 animate-pulse">
              <Zap className="h-4 w-4 mr-2" />
              Join 50,000+ creators earning with GetMeAChai
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Fund your creative
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> passion</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Accept support from your fans and turn your creativity into a sustainable income. 
              Simple, beautiful, and built for creators.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleBuyMeAChai}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Coffee className="inline-block mr-2 h-7 w-7" />
                Buy me a Chai
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </button>
              
              <button className="flex items-center text-gray-700 hover:text-orange-500 px-6 py-4 rounded-full border-2 border-gray-200 hover:border-orange-500 text-lg font-medium transition-all duration-200 hover:bg-orange-50 cursor-pointer">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
          <div className="absolute top-20 left-4 md:left-10 animate-bounce hidden sm:block">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-4 shadow-lg">
            <Coffee className="h-4 w-4 md:h-8 md:w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="absolute top-32 right-4 md:right-16 animate-pulse hidden sm:block">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-4 shadow-lg">
            <Heart className="h-4 w-4 md:h-8 md:w-8 text-pink-500" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {animatedStats.creators.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Active Creators</div>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {animatedStats.supporters.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Happy Supporters</div>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${animatedStats.raised.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Raised for Creators</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed to help you build, engage, and monetize your creative community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <div className="bg-gradient-to-br from-orange-100 to-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <div className="text-orange-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Get started in
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> 3 simple steps</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-200">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your Page</h3>
              <p className="text-gray-600">Set up your personalized support page in minutes with our easy-to-use tools</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-200">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Share With Fans</h3>
              <p className="text-gray-600">Share your page across social media, your website, or anywhere you connect with fans</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-200">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Receive Support</h3>
              <p className="text-gray-600">Start receiving support from your fans and turn your passion into income</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Loved by
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> creators worldwide</span>
            </h2>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                &ldquo;{testimonials[currentTestimonial].content}&rdquo;
              </blockquote>
              
              <div className="flex items-center">
                <img 
                  src={testimonials[currentTestimonial].avatar} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer ${
                    index === currentTestimonial ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
     

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to turn your passion into income?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of creators who are already earning with GetMeAChai
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleStartYourPage}
              className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg cursor-pointer"
            >
              Start Your Page Now
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </button>
            
            <button 
              onClick={handleBuyMeAChai}
              className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 cursor-pointer"
            >
              Support a Creator
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
