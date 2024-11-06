import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    content: '',
    postType: 'regular',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate content
      if (!formData.content.trim()) {
        setError('Content is required');
        return;
      }

      // Create FormData object
      const postData = new FormData();
      postData.append('content', formData.content);
      postData.append('postType', formData.postType);

      // Append each file
      if (files.length > 0) {
        files.forEach(file => {
          postData.append('attachments', file);
        });
      }

      // Log FormData contents for debugging
      for (let pair of postData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Make API request
      const response = await api.post('/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted);
        },
      });

      console.log('Post created successfully:', response.data);
      setSuccess(true);

      // Reset form
      setFormData({
        content: '',
        postType: 'regular',
      });
      setFiles([]);

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      
      setError(
        err.response?.data?.message || 
        'Error creating post. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file size and type
    const validFiles = selectedFiles.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type);
      
      if (!isValidSize) {
        setError(`File ${file.name} is too large. Maximum size is 5MB`);
      }
      if (!isValidType) {
        setError(`File ${file.name} is not a supported type. Supported types: JPEG, PNG, GIF, PDF`);
      }
      
      return isValidSize && isValidType;
    });

    setFiles(validFiles);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Post created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows="4"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="postType" className="block text-sm font-medium text-gray-700">
            Post Type
          </label>
          <select
            id="postType"
            value={formData.postType}
            onChange={(e) => setFormData({ ...formData, postType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={loading}
          >
            <option value="regular">Regular</option>
            <option value="academic">Academic</option>
            {user?.role === 'alumni' && <option value="job">Job Posting</option>}
            {user?.role === 'teacher' && <option value="announcement">Announcement</option>}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Attachments {files.length > 0 && `(${files.length} files selected)`}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/jpeg,image/png,image/gif,application/pdf"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Supported file types: JPEG, PNG, GIF, PDF. Maximum size: 5MB per file.
          </p>
          {files.length > 0 && (
            <ul className="mt-2 text-sm text-gray-500">
              {files.map((file, index) => (
                <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;