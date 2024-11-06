import React from 'react';
import { Link } from 'react-router-dom';

const AnnouncementCard = ({ announcement }) => {

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
  return (
    <div className="bg-indigo-50 rounded-lg shadow p-4 border-l-4 border-indigo-600">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={getProfileImageUrl(announcement.teacher.profileImage) || "/default-avatar.png"}
            alt={announcement.teacher.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <Link 
              to={`/profile/${announcement.teacher._id}`}
              className="font-semibold text-gray-900 hover:underline"
            >
              {announcement.teacher.name}
            </Link>
            <p className="text-sm text-gray-600">
              {new Date(announcement.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="text-sm text-indigo-600 font-medium">
          {announcement.type === 'department' ? 'Department Announcement' : 'Course Announcement'}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {announcement.title}
        </h3>
        <p className="text-gray-700">
          {announcement.content}
        </p>
        {announcement.attachment && (
          <a
            href={announcement.attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>View Attachment</span>
          </a>
        )}
      </div>

      {announcement.targetGroups && (
        <div className="mt-4 flex flex-wrap gap-2">
          {announcement.targetGroups.map(group => (
            <span 
              key={group}
              className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
            >
              {group}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;