import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const PostCard = ({ post, onPostUpdate }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id));
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleLike = async () => {
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      setLikes(res.data);
      setIsLiked(!isLiked);
      if (onPostUpdate) onPostUpdate();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, { content: newComment });
      setComments(res.data);
      setNewComment('');
      if (onPostUpdate) onPostUpdate();
    } catch (err) {
      console.error('Error commenting:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* Post Header */}
      <div className="flex items-center space-x-3">
        <Link to={`/profile/${post.user._id}`}>
          <img
            src={getProfileImageUrl(post.user.profileImage)}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link to={`/profile/${post.user._id}`} className="font-semibold hover:underline">
            {post.user.name}
          </Link>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()} • {post.user.role}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div>
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        {post.attachments && post.attachments.map((attachment, index) => (
          <img
            key={index}
            src={getImageUrl(attachment)}
            alt={`Attachment ${index + 1}`}
            className="mt-2 rounded-lg max-h-96 w-full object-cover"
            onError={(e) => {
              console.error(`Failed to load image: ${attachment}`);
              e.target.style.display = 'none';
            }}
          />
        ))}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${isLiked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
        >
          <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="pt-4 space-y-4">
          <form onSubmit={handleComment} className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Posting...' : 'Comment'}
            </button>
          </form>

          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment._id} className="flex space-x-3">
                <Link to={`/profile/${comment.user._id}`}>
                  <img
                    src={getProfileImageUrl(comment.user.profileImage)}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </Link>
                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                  <Link to={`/profile/${comment.user._id}`} className="font-semibold hover:underline">
                    {comment.user.name}
                  </Link>
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;