import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>No profile found. Please create your profile.</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Bio: {profile.bio}</p>
      <p>Department: {profile.department}</p>
      {user?.role === 'teacher' && (
        <p>Teacher Code: {profile.teacherCode}</p>
      )}
      {(user?.role === 'student' || user?.role === 'alumni') && (
        <>
          <p>Class ID: {profile.classId}</p>
          <p>Intake: {profile.intake}</p>
          <p>Section: {profile.section}</p>
        </>
      )}
      {user?.role === 'alumni' && (
        <p>Passing Year: {profile.passingYear}</p>
      )}
      <p>Skills: {profile.skills?.join(', ')}</p>
    </div>
  );
};

export default Profile;