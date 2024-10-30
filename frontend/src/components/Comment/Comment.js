import React, { useState } from 'react';
import api from '../../utils/api';

const Comment = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/posts/${postId}/comment`, { content });
      setContent('');
      onCommentAdded(res.data);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
        rows="2"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Post Comment
      </button>
    </form>
  );
};

export default Comment;
