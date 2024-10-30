import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    department: '',
    bio: '',
    // Student fields
    intake: '',
    section: '',
    semester: '',
    // Teacher fields
    designation: '',
    expertise: [],
    // Alumni fields
    graduationYear: '',
    currentCompany: '',
    currentDesignation: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          profileData.append(key, formData[key]);
        }
      });
      if (profilePicture) {
        profileData.append('profilePicture', profilePicture);
      }

      await api.post('/profile/complete', profileData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error completing profile:', err);
    }
  };

  // Render different forms based on step
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h3>Basic Information</h3>
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            />
            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
            <input
              type="file"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
            <button onClick={() => setStep(2)}>Next</button>
          </div>
        );
      case 2:
        return (
          <div>
            <h3>Role Specific Information</h3>
            {/* Render fields based on user role */}
            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={handleSubmit}>Complete Profile</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>
      {renderStep()}
    </div>
  );
};

export default ProfileCompletion;