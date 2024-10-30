import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{user.name}'s Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Department:</strong> {profile.department}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
      
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Skills</h3>
        <ul className="list-disc list-inside">
          {profile.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Social Links</h3>
        {Object.entries(profile.socialLinks).map(([platform, link]) => (
          link && (
            <p key={platform}>
              <strong>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong>{' '}
              <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
            </p>
          )
        ))}
      </div>

      {user.role === 'student' && profile.studentInfo && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Student Information</h3>
          <p><strong>Student ID:</strong> {profile.studentInfo.studentId}</p>
          <p><strong>Batch:</strong> {profile.studentInfo.batch}</p>
          <p><strong>CGPA:</strong> {profile.studentInfo.cgpa}</p>
        </div>
      )}

      {user.role === 'teacher' && profile.teacherInfo && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Teacher Information</h3>
          <p><strong>Designation:</strong> {profile.teacherInfo.designation}</p>
          <p><strong>Courses:</strong> {profile.teacherInfo.courses.join(', ')}</p>
          <p><strong>Research Interests:</strong> {profile.teacherInfo.researchInterests.join(', ')}</p>
          <p><strong>Office Hours:</strong> {profile.teacherInfo.officeHours}</p>
        </div>
      )}

      {user.role === 'alumni' && profile.alumniInfo && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Alumni Information</h3>
          <p><strong>Graduation Year:</strong> {profile.alumniInfo.graduationYear}</p>
          <p><strong>Current Company:</strong> {profile.alumniInfo.currentCompany}</p>
          <p><strong>Job Title:</strong> {profile.alumniInfo.jobTitle}</p>
        </div>
      )}

      <div className="mt-6">
        <Link to="/edit-profile" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
