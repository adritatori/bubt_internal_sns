import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const Notifications = () => {
  const { user } = useContext(AuthContext); // Add AuthContext
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Helper to get user's department based on role
  const getUserDepartment = (user) => {
    if (!user) return null;
    
    switch (user.role) {
      case 'student':
        return user.studentInfo?.department;
      case 'teacher':
        return user.teacherInfo?.department;
      case 'alumni':
        return user.alumniInfo?.department;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!user) return;

      try {
        setLoading(true);
        console.log('Fetching announcements from:', `${api.defaults.baseURL}/announcements`);
        const res = await api.get('/announcements');
        console.log('Raw announcements:', res.data);

        const userDepartment = getUserDepartment(user);
        console.log('User Department:', userDepartment);

        // Filter announcements based on department and target type
        const filteredAnnouncements = res.data.filter(announcement => {
          // First check if announcement is for the user's department
          if (announcement.department !== userDepartment) {
            return false;
          }

          // Then check target type and additional criteria
          switch (announcement.targetType) {
            case 'all':
              return true;

            case 'intake-section':
              return user.role === 'student' && 
                     announcement.intake === user.studentInfo?.intake &&
                     announcement.section === user.studentInfo?.section;

            case 'intake-only':
              return user.role === 'student' && 
                     announcement.intake === user.studentInfo?.intake;

            case 'specific-student':
              return user.role === 'student' && 
                     announcement.specificStudentId === user.studentInfo?.studentId;

            default:
              return false;
          }
        });

        console.log('Filtered announcements:', filteredAnnouncements);
        setAnnouncements(filteredAnnouncements);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        console.error('Error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        });
        setError('Error loading announcements');
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [user]); // Add user as dependency

  const openModal = (announcement) => {
    console.log('Opening modal for announcement:', announcement);
    setSelectedAnnouncement(announcement);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Remove any leading slashes
    let cleanPath = imagePath.replace(/^\/+/, '');
    
    // Remove 'api/' if it exists at the start
    cleanPath = cleanPath.replace(/^api\//, '');
    
    // Construct the full URL
    const fullUrl = `http://localhost:5000/${cleanPath}`;
    
    console.log('Constructed image URL:', {
      originalPath: imagePath,
      cleanPath: cleanPath,
      fullUrl: fullUrl
    });
    
    return fullUrl;
  };
  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Remove any leading slashes
    let cleanPath = imagePath.replace(/^\/+/, '');
    
    // Remove 'api/' if it exists at the start
    cleanPath = cleanPath.replace(/^api\//, '');
    
    // Construct the full URL
    const fullUrl = `http://localhost:5000/uploads/profiles/${cleanPath}`;
    
    console.log('Constructed image URL:', {
      originalPath: imagePath,
      cleanPath: cleanPath,
      fullUrl: fullUrl
    });
    
    return fullUrl;
  };
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-gray-600">
          Please log in to view announcements
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 text-blue-500 hover:text-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
          <p className="text-sm text-gray-600 mt-1">
            Department: {getUserDepartment(user)}
          </p>
        </div>

        {announcements.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No announcements for your department
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {announcements.map((announcement) => {
              const teacherImageUrl = getProfileImageUrl(announcement.teacher?.profileImage);
              const announcementImageUrl = getImageUrl(announcement.image);
              
              return (
                <div
                  key={announcement._id}
                  className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                  onClick={() => openModal(announcement)}
                >
                  <div className="flex items-start space-x-4">
                    {teacherImageUrl && (
                      <div className="relative w-12 h-12">
                        <img
                          src={teacherImageUrl}
                          alt="Teacher"
                          className="h-12 w-12 rounded-full object-cover"
                          onError={(e) => {
                            console.error('Teacher image failed to load:', teacherImageUrl);
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900">
                          {announcement.teacher?.name || 'Teacher'} posted an announcement
                        </p>
                        <span className="text-sm text-gray-500">
                          {new Date(announcement.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{announcement.title}</h4>
                          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                            {announcement.targetType}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1 line-clamp-2">
                          {announcement.content}
                        </p>
                        {announcementImageUrl && (
                          <div className="relative mt-2">
                            <img
                              src={announcementImageUrl}
                              alt="Announcement"
                              className="max-h-48 rounded-lg object-cover"
                              onError={(e) => {
                                console.error('Announcement image failed to load:', announcementImageUrl);
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={getProfileImageUrl(selectedAnnouncement.teacher?.profileImage) || "/default-avatar.png"}
                    alt="Teacher"
                    className="h-12 w-12 rounded-full object-cover"
                    onError={(e) => e.target.src = "/default-avatar.png"}
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedAnnouncement.teacher?.name || 'Teacher'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedAnnouncement.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-xl font-bold">{selectedAnnouncement.title}</h3>
                <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  {selectedAnnouncement.targetType}
                </span>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap mb-4">
                {selectedAnnouncement.content}
              </p>
              {selectedAnnouncement.image && (
                <img
                  src={getImageUrl(selectedAnnouncement.image)}
                  alt="Announcement"
                  className="w-full rounded-lg object-contain max-h-96"
                  onError={(e) => {
                    console.error('Modal announcement image failed to load:', 
                      getImageUrl(selectedAnnouncement.image));
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="mt-4 text-sm text-gray-500 space-y-1">
                <p>Department: {selectedAnnouncement.department}</p>
                {selectedAnnouncement.intake && <p>Intake: {selectedAnnouncement.intake}</p>}
                {selectedAnnouncement.section && <p>Section: {selectedAnnouncement.section}</p>}
                <p>Target Type: {selectedAnnouncement.targetType}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;