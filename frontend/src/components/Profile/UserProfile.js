import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { 
  User, Mail, Briefcase, Building2, 
  GraduationCap, BookOpen, Clock, 
  Github, Linkedin, Globe,
  Award
} from 'lucide-react';
import api from '../../utils/api';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProfileAndUserData();
    }
  }, [id]);
 
  const handleFollowToggle = async () => {
    try {
      const res = await api.put(`/users/follow/${id}`);
      
      // Update isFollowing directly from response
      setIsFollowing(res.data.isFollowing);
      
      // Update follower count based on response
      setFollowerCount(prev => res.data.isFollowing ? prev + 1 : prev - 1);
      
      // Update userInfo to match response
      setUserInfo(prev => ({
        ...prev,
        isFollowing: res.data.isFollowing,
        followers: res.data.isFollowing 
          ? [...prev.followers, user._id]
          : prev.followers.filter(id => id !== user._id)
      }));
    } catch (err) {
      console.error('Error toggling follow:', err);
      setError('Failed to update follow status');
    }
  };
  
  // In your fetchProfileAndUserData function:
  const fetchProfileAndUserData = async () => {
    try {
      setLoading(true);
      
      const [profileRes, userRes] = await Promise.all([
        api.get(`/profile/user/${id}`),
        api.get(`/users/${id}/info`)
      ]);
  
      setProfile(profileRes.data);
      setUserInfo(userRes.data);
      setIsFollowing(userRes.data.isFollowing); // This will now work correctly
      setFollowerCount(userRes.data.followers.length);
      setFollowingCount(userRes.data.following.length);
      
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to fetch profile information');
    } finally {
      setLoading(false);
    }
  }
  

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 text-center p-4">
      {error}
      <button 
        onClick={fetchProfileAndUserData} 
        className="ml-4 text-blue-500 hover:text-blue-700"
      >
        Try Again
      </button>
    </div>
  );
  
  if (!profile || !userInfo) return <div className="text-center p-4">No profile found</div>;
  const profileImageUrl = userInfo.profileImage 
  ? `http://localhost:5000/uploads/profiles/${userInfo.profileImage}`
  : '/api/placeholder/128/128';
  console.log(profileImageUrl)
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="relative -top-12 w-32 h-32">
              
              <img
              src={profileImageUrl}
              alt={userInfo.name}
              className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
              onError={(e) => {
                e.target.src = '/api/placeholder/128/128';
              }}
            />
            </div>
            <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left flex-grow">
              <h1 className="text-3xl font-bold text-gray-900">{userInfo.name}</h1>
              <p className="text-gray-600">{userInfo.role?.charAt(0).toUpperCase() + userInfo.role?.slice(1)}</p>
            </div>
            {user._id !== id && (
              <button
                onClick={handleFollowToggle}
                className={`
                  px-6 py-2 rounded-full font-semibold transition-colors duration-200
                  ${isFollowing
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }
                `}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="px-6 py-4 border-t border-gray-100">
          <p className="text-gray-700 leading-relaxed">{profile.bio || 'No bio provided'}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{followerCount}</div>
          <div className="text-gray-600">Followers</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{followingCount}</div>
          <div className="text-gray-600">Following</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{profile.posts?.length || 0}</div>
          <div className="text-gray-600">Posts</div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <Mail className="w-5 h-5 mr-3 text-blue-500" />
              <span>{userInfo.email}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Building2 className="w-5 h-5 mr-3 text-blue-500" />
              <span>{profile.department || 'No department specified'}</span>
            </div>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Role-Specific Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {userInfo.role?.charAt(0).toUpperCase() + userInfo.role?.slice(1)} Details
          </h2>
          {userInfo.role === 'student' && profile.studentInfo && (
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <User className="w-5 h-5 mr-3 text-blue-500" />
                <span>Student ID: {profile.studentInfo.studentId}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <GraduationCap className="w-5 h-5 mr-3 text-blue-500" />
                <span>Batch: {profile.studentInfo.batch}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Award className="w-5 h-5 mr-3 text-blue-500" />
                <span>CGPA: {profile.studentInfo.cgpa}</span>
              </div>
            </div>
          )}

          {userInfo.role === 'teacher' && profile.teacherInfo && (
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Briefcase className="w-5 h-5 mr-3 text-blue-500" />
                <span>Designation: {profile.teacherInfo.designation}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                <span>Courses: {profile.teacherInfo.courses.join(', ')}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-blue-500" />
                <span>Office Hours: {profile.teacherInfo.officeHours}</span>
              </div>
            </div>
          )}

          {userInfo.role === 'alumni' && profile.alumniInfo && (
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <GraduationCap className="w-5 h-5 mr-3 text-blue-500" />
                <span>Graduated: {profile.alumniInfo.graduationYear}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Building2 className="w-5 h-5 mr-3 text-blue-500" />
                <span>Company: {profile.alumniInfo.currentCompany}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Briefcase className="w-5 h-5 mr-3 text-blue-500" />
                <span>Role: {profile.alumniInfo.jobTitle}</span>
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Social Links</h2>
          <div className="space-y-3">
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
              >
                <Linkedin className="w-5 h-5 mr-3" />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
              >
                <Github className="w-5 h-5 mr-3" />
                <span>GitHub Profile</span>
              </a>
            )}
            {profile.socialLinks?.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
              >
                <Globe className="w-5 h-5 mr-3" />
                <span>Personal Website</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;