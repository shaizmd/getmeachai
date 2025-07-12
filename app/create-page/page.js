"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Save, Upload, User, MapPin, Globe, Target, Star, FileText, Camera, Link2, Hash, Heart } from 'lucide-react';

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    about: '',
    skills: '',
    location: '',
    profileImage: '',
    coverImage: '',
    links: {
      website: '',
      twitter: '',
      instagram: '',
      youtube: '',
      github: '',
      linkedin: ''
    },
    goal: {
      title: '',
      description: '',
      targetAmount: 1000,
      currentAmount: 0
    }
  });

  const categories = [
    'Technology', 'Art & Design', 'Music', 'Gaming', 'Education', 'Health & Fitness',
    'Food & Cooking', 'Travel', 'Business', 'Sports', 'Photography', 'Writing', 'Other'
  ];

  // Category mapping from display names to database values
  const categoryMapping = {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      router.push('/signin');
      return;
    }

    setLoading(true);
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.about) {
        alert('Please fill in all required fields: Title, Description, Category, and About section.');
        setLoading(false);
        return;
      }

      // Validate goal fields
      if (!formData.goal.title || !formData.goal.description) {
        alert('Please fill in the goal title and description.');
        setLoading(false);
        return;
      }

      const username = session.user.email?.split('@')[0];
      const pageData = {
        username,
        title: formData.title,
        description: formData.description,
        category: categoryMapping[formData.category] || 'other',
        about: formData.about,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        location: {
          city: formData.location.split(',')[0]?.trim() || 'Unknown',
          country: formData.location.split(',')[1]?.trim() || 'Unknown'
        },
        profileImage: formData.profileImage,
        coverImage: formData.coverImage,
        links: Object.entries(formData.links)
          .filter(([key, value]) => value.trim() !== '')
          .map(([name, url]) => ({ name, url })),
        goal: {
          title: formData.goal.title,
          description: formData.goal.description,
          targetAmount: parseInt(formData.goal.targetAmount) || 1000,
          currentAmount: parseInt(formData.goal.currentAmount) || 0
        }
      };

      const response = await fetch('/api/page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to create page');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Failed to create page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create Your Page</h1>
                <p className="text-orange-100">Set up your creator profile to start receiving support</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Basic Information</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., John's Creative Journey"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Brief description of what you do..."
                  required
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Profile Images</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                  <input
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
              </div>
            </div>

            {/* About & Skills */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>About & Skills</span>
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Tell your story, what you're passionate about..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="JavaScript, React, Design, Photography"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Goal */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Your Goal</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                  <input
                    type="text"
                    name="goal.title"
                    value={formData.goal.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Fund my next creative project"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Description</label>
                  <textarea
                    name="goal.description"
                    value={formData.goal.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe what you want to achieve..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ($)</label>
                  <input
                    type="number"
                    name="goal.targetAmount"
                    value={formData.goal.targetAmount}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Link2 className="h-5 w-5" />
                <span>Social Links</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="links.website"
                    value={formData.links.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="url"
                    name="links.twitter"
                    value={formData.links.twitter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="url"
                    name="links.instagram"
                    value={formData.links.instagram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                  <input
                    type="url"
                    name="links.youtube"
                    value={formData.links.youtube}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://youtube.com/c/yourchannel"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    name="links.github"
                    value={formData.links.github}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    name="links.linkedin"
                    value={formData.links.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Create Page</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
