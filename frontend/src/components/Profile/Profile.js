import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Token:', localStorage.getItem('token')); // Add this line
        console.log('Fetching profile...');
        const res = await api.get('/profile/me');
        console.log('Profile response:', res.data);
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.msg : 'Failed to fetch profile. Please try again.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <div>
      <h2>{profile.user.name}'s Profile</h2>
      <p>Department: {profile.department}</p>
      <p>Bio: {profile.bio}</p>
      {/* Add more profile fields as needed */}
    </div>
  );
};

export default Profile;
