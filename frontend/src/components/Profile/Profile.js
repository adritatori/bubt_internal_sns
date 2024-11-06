import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { 
  User, Mail, Briefcase, Building2, 
  GraduationCap, BookOpen, Clock, 
  Github, Linkedin, Globe, Edit2,
  Award
} from 'lucide-react';
import api from '../../utils/api';



export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const profileImageUrl = user.profileImage 
  ? `http://localhost:5000/uploads/profiles/${user.profileImage}`
  : '/api/placeholder/128/128';
  console.log(profileImageUrl)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Profile Not Found</h2>
        <p className="mt-4 text-gray-600">Create your profile to get started!</p>
        <Link to="/edit-profile" className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Create Profile
        </Link>
      </div>
    );
  }

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
              alt={user.name}
              className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
              onError={(e) => {
                e.target.src = '/api/placeholder/128/128';
              }}
            />
            </div>
            <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left flex-grow">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
            </div>
            <Link
              to="/edit-profile"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Bio Section */}
        <div className="px-6 py-4 border-t border-gray-100">
          <p className="text-gray-700 leading-relaxed">{profile.bio || 'No bio provided'}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Basic Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <Mail className="w-5 h-5 mr-3 text-blue-500" />
              <span>{user.email}</span>
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
            {profile.skills.map((skill, index) => (
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
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Details
          </h2>
          {user.role === 'student' && profile.studentInfo && (
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

          {user.role === 'teacher' && profile.teacherInfo && (
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

          {user.role === 'alumni' && profile.alumniInfo && (
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
            {profile.socialLinks.linkedin && (
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
            {profile.socialLinks.github && (
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
            {profile.socialLinks.website && (
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
}