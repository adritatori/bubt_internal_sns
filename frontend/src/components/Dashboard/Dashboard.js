import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import PostCard from '../Posts/PostCard';
import AnnouncementCard from '../Posts/AnnouncementCard';
import api from '../../utils/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts and announcements in parallel
        const [postsRes, announcementsRes] = await Promise.all([
          api.get('/posts'),
          api.get('/announcements')
        ]);

        setPosts(postsRes.data);
        setAnnouncements(announcementsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error loading dashboard content');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'student' ? 'Student Dashboard' : 
           user?.role === 'teacher' ? 'Teacher Dashboard' : 
           'Alumni Dashboard'}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-600">No posts yet</p>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Announcements Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Announcements
            </h2>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-gray-600">No announcements</p>
              ) : (
                announcements.map(announcement => (
                  <AnnouncementCard 
                    key={announcement._id} 
                    announcement={announcement} 
                  />
                ))
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Links
            </h2>
            <div className="space-y-2">
              <a 
                href="/create-post" 
                className="block text-indigo-600 hover:text-indigo-800"
              >
                Create New Post
              </a>
              {user?.role === 'teacher' && (
                <a 
                  href="/announcements" 
                  className="block text-indigo-600 hover:text-indigo-800"
                >
                  Create Announcement
                </a>
              )}
              <a 
                href="/profile" 
                className="block text-indigo-600 hover:text-indigo-800"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
