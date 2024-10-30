import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data || err.message);
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No profile found</div>;

  const isOwnProfile = !id || id === user._id;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{profile.user.name}'s Profile</h1>
      {isOwnProfile && (
        <Link to="/edit-profile" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
          Edit Profile
        </Link>
      )}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Bio</h2>
          <p>{profile.bio}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          <ul className="list-disc list-inside">
            {profile.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        {profile.education && profile.education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Education</h2>
            {profile.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold">{edu.school}</h3>
                <p>{edu.degree} in {edu.fieldofstudy}</p>
                <p>{new Date(edu.from).getFullYear()} - {edu.to ? new Date(edu.to).getFullYear() : 'Present'}</p>
              </div>
            ))}
          </div>
        )}
        {profile.experience && profile.experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Experience</h2>
            {profile.experience.map((exp, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold">{exp.title} at {exp.company}</h3>
                <p>{new Date(exp.from).getFullYear()} - {exp.to ? new Date(exp.to).getFullYear() : 'Present'}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
