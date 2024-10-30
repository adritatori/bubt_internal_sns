import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [postType, setPostType] = useState('regular');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    formData.append('postType', postType);
    files.forEach(file => formData.append('attachments', file));

    try {
      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setContent('');
      setFiles([]);
      setPostType('regular');
      setError('');
      // You might want to add some feedback to the user here
    } catch (err) {
      setError('Error creating post. Please try again.');
      console.error('Error creating post:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="postType" className="block text-sm font-medium text-gray-700">Post Type</label>
          <select
            id="postType"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="regular">Regular</option>
            <option value="academic">Academic</option>
            {user.role === 'alumni' && <option value="job">Job Posting</option>}
            {user.role === 'teacher' && <option value="announcement">Announcement</option>}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="files" className="block text-sm font-medium text-gray-700">Attachments</label>
          <input
            type="file"
            id="files"
            onChange={(e) => setFiles(Array.from(e.target.files))}
            multiple
            className="mt-1 block w-full"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
