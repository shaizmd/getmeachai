"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Save, Upload, Plus, Trash2, Eye } from 'lucide-react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState({
    title: '',
    description: '',
    category: 'other',
    coverImage: '',
    profileImage: '',
    about: '',
    skills: [],
    location: {
      city: '',
      country: ''
    },
    recentUpdates: [],
    links: [],
    goal: {
      title: '',
      description: '',
      targetAmount: 1000,
      currentAmount: 0
    }
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/signin');
      return;
    }
    
    fetchPageData();
  }, [session, status]);

  const fetchPageData = async () => {
    try {
      const response = await fetch(`/api/page?username=${session.user.email?.split('@')[0]}`);
      if (response.ok) {
        const data = await response.json();
        setPageData(data.page);
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/page?username=${session.user.email?.split('@')[0]}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });
      
      if (response.ok) {
        alert('Page updated successfully!');
      } else {
        alert('Error updating page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    setPageData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index, value) => {
    setPageData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index) => {
    setPageData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addUpdate = () => {
    setPageData(prev => ({
      ...prev,
      recentUpdates: [...prev.recentUpdates, {
        title: '',
        description: '',
        date: new Date(),
        color: 'from-orange-500 to-pink-500'
      }]
    }));
  };

  const updateRecentUpdate = (index, field, value) => {
    setPageData(prev => ({
      ...prev,
      recentUpdates: prev.recentUpdates.map((update, i) => 
        i === index ? { ...update, [field]: value } : update
      )
    }));
  };

  const removeUpdate = (index) => {
    setPageData(prev => ({
      ...prev,
      recentUpdates: prev.recentUpdates.filter((_, i) => i !== index)
    }));
  };

  const addLink = () => {
    setPageData(prev => ({
      ...prev,
      links: [...prev.links, { name: '', url: '' }]
    }));
  };

  const updateLink = (index, field, value) => {
    setPageData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeLink = (index) => {
    setPageData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Your Page</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push(`/${session?.user?.email?.split('@')[0]}`)}
                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={pageData.title}
                    onChange={(e) => setPageData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={pageData.category}
                    onChange={(e) => setPageData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="art">Art</option>
                    <option value="tech">Technology</option>
                    <option value="writing">Writing</option>
                    <option value="music">Music</option>
                    <option value="education">Education</option>
                    <option value="gaming">Gaming</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="business">Business</option>
                    <option value="health">Health</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={pageData.description}
                    onChange={(e) => setPageData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    value={pageData.coverImage}
                    onChange={(e) => setPageData(prev => ({ ...prev, coverImage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                  <input
                    type="url"
                    value={pageData.profileImage}
                    onChange={(e) => setPageData(prev => ({ ...prev, profileImage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* About */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
              <textarea
                value={pageData.about}
                onChange={(e) => setPageData(prev => ({ ...prev, about: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Skills */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Skills</h2>
                <button
                  onClick={addSkill}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Skill</span>
                </button>
              </div>
              <div className="space-y-2">
                {pageData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={pageData.location.city}
                    onChange={(e) => setPageData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, city: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={pageData.location.country}
                    onChange={(e) => setPageData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, country: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Goal */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Current Goal</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={pageData.goal.title}
                    onChange={(e) => setPageData(prev => ({ 
                      ...prev, 
                      goal: { ...prev.goal, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Description</label>
                  <textarea
                    value={pageData.goal.description}
                    onChange={(e) => setPageData(prev => ({ 
                      ...prev, 
                      goal: { ...prev.goal, description: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ($)</label>
                  <input
                    type="number"
                    value={pageData.goal.targetAmount}
                    onChange={(e) => setPageData(prev => ({ 
                      ...prev, 
                      goal: { ...prev.goal, targetAmount: parseInt(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
