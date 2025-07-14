"use client";
import React from 'react';
import { Heart, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import Logo from './Logo';


const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-1">
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
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Empowering creators to build sustainable income through community support.
              Share your passion, get funded, and grow your creative journey.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-900 hover:text-gray-700 transition-colors duration-200 transform hover:scale-110">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors duration-200 transform hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-pink-500 hover:text-pink-600 transition-colors duration-200 transform hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-700 hover:text-blue-800 transition-colors duration-200 transform hover:scale-110">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center group">
                  <span>Discover Creators</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center group">
                  <span>Start Creating</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center group">
                  <span>How It Works</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center group">
                  <span>Success Stories</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center group">
                  <span>Pricing</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center group">
                  <span>Help Center</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center group">
                  <span>Creator Guide</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center group">
                  <span>Blog</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center group">
                  <span>API Documentation</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center group">
                  <span>Community</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Stay Connected</h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="h-4 w-4 mr-2 text-orange-500" />
                <span>hello@getmeachai.com</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="h-4 w-4 mr-2 text-orange-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-2 text-orange-500 mt-0.5" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h4 className="text-gray-900 font-medium mb-3 text-sm">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-l-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-sm font-medium rounded-r-full transition-all duration-200 transform hover:scale-105 cursor-pointer">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Active Creators</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$2M+</div>
              <div className="text-sm text-gray-600">Funds Raised</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">50K+</div>
              <div className="text-sm text-gray-600">Supporters</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">25+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <span>© {currentYear} GetMeAChai. All rights reserved.</span>
              <div className="hidden md:flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
                <span>for creators</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;