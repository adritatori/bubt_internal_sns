import React, { useState } from 'react';
import api from '../../utils/api';
import './ProfileImage.css';

const ProfileImage = ({ currentImage, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        onImageUpdate(response.data.profilePicture);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="profile-image-container">
      <img
        src={`${process.env.REACT_APP_API_URL}/profile/image/${currentImage || 'default.jpg'}`}
        alt="Profile"
        className="profile-image"
      />
      
      <div className="image-upload-wrapper">
        <label className="image-upload-label">
          {uploading ? 'Uploading...' : 'Change Photo'}
          <input
            type="file"
            className="image-upload-input"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
          />
        </label>
        
        {uploading && (
          <div className="upload-progress">
            <div 
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        
        {error && <div className="upload-error">{error}</div>}
      </div>
    </div>
  );
};

export default ProfileImage;
