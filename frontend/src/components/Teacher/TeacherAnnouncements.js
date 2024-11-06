import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const TeacherAnnouncements = () => {
  // Remove unused 'user' variable
  // const { user } = useContext(AuthContext); 

  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetType: 'all',
    department: '',
    intake: '',
    section: '',
    specificStudentId: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const getImageUrl = (imagePath, type = '') => {
    if (!imagePath) return null;
    
    // Remove any leading slashes and 'api/' if present
    let cleanPath = imagePath.replace(/^\/+/, '').replace(/^api\//, '');
    
    // Base URL
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Construct the full URL based on image type
    if (type === 'profile') {
      return `${baseUrl}/uploads/profiles/${cleanPath}`;
    } else if (type === 'announcement') {
      return `${baseUrl}/uploads/announcements/${cleanPath}`;
    } else {
      return `${baseUrl}/${cleanPath}`; // Default path
    }
  };


  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements/teacher');
      setAnnouncements(res.data);
    } catch (err) {
      setError('Error fetching announcements');
    }
  };

  // Function to get recipient IDs based on target type
  const getRecipientIds = (announcement) => {
    if (announcement.targetType === 'all') {
      // Fetch all student IDs
      return []; // Implement this logic, for example, by making a call to your API 
    } else if (announcement.targetType === 'intake-section') {
      // Fetch student IDs for specific intake and section
      return []; // Implement this logic
    } else if (announcement.targetType === 'intake-only') {
      // Fetch student IDs for specific intake
      return []; // Implement this logic
    } else if (announcement.targetType === 'specific-student') {
      return [announcement.specificStudentId]; // Return an array with only the specific student ID
    }
    return [];
  };

  // Function to create announcement notifications
  const handleCreateAnnouncement = async (announcementId, recipientIds, targetInfo) => {
    try {
      // Implement logic to create notifications
      await api.post('/notifications/announcements', {
        announcementId,
        recipientIds,
        targetInfo 
      });
    } catch (err) {
      console.error('Error creating notification:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('targetType', formData.targetType);
      formDataToSend.append('department', formData.department);
      
      if (formData.targetType !== 'all') {
        formDataToSend.append('intake', formData.intake);
      }
      
      if (formData.targetType === 'intake-section') {
        formDataToSend.append('section', formData.section);
      }
      
      if (formData.targetType === 'specific-student') {
        formDataToSend.append('specificStudentId', formData.specificStudentId);
      }
  
      // Append image if exists
      if (formData.image) {
        formDataToSend.append('announcementImage', formData.image);
      }
  
      const res = await api.post('/announcements', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // After creating announcement, get recipient IDs and create notifications
      const recipientIds = getRecipientIds(res.data); 
      await handleCreateAnnouncement(res.data._id, recipientIds, formData); // Wait for the notification to be created

      // Update announcements list with new announcement
      setAnnouncements([res.data, ...announcements]);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        targetType: 'all',
        department: '',
        intake: '',
        section: '',
        specificStudentId: '',
        image: null
      });
  
      // Optional: Show success message
      // You need to implement this or remove it
      // setSuccess('Announcement created successfully!'); 
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating announcement');
    }
    setLoading(false);
  };

  // Function to get recipient IDs based on target type
  
  // Function to create announcement notifications
  

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Create Announcement</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Type</label>
            <select
  value={formData.targetType}
  onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  required
>
  <option value="all">All Students</option>
  <option value="intake-section">Specific Intake & Section</option>
  <option value="intake-only">Specific Intake Only</option>
  <option value="specific-student">Specific Student</option>
</select>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {formData.targetType !== 'all' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Intake</label>
              <input
                type="text"
                value={formData.intake}
                onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          {formData.targetType === 'intake-section' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          {formData.targetType === 'specific-student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Student ID</label>
              <input
                type="text"
                value={formData.specificStudentId}
                onChange={(e) => setFormData({ ...formData, specificStudentId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create Announcement'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold p-6 border-b">Your Announcements</h3>
        <div className="divide-y divide-gray-200">
          {announcements.map(announcement => (
            <div key={announcement._id} className="p-6">
              <h4 className="text-lg font-medium">{announcement.title}</h4>
              {announcement.content && (
                <p className="mt-2 text-gray-600">{announcement.content}</p>
              )}
             {announcement.image && (
                    <div className="mt-4">
                      <img
                        src={getImageUrl(announcement.image, 'announcement')}
                        alt="Announcement"
                        className="max-h-64 w-full rounded-lg object-cover"
                        onError={(e) => {
                          console.error('Announcement image failed to load:', announcement.image);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
              <div className="mt-2 text-sm text-gray-500">
                <p>Target: {announcement.targetType}</p>
                <p>Department: {announcement.department}</p>
                {announcement.intake && <p>Intake: {announcement.intake}</p>}
                {announcement.section && <p>Section: {announcement.section}</p>}
                <p>Posted: {new Date(announcement.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherAnnouncements;