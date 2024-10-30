import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const SinglePost = () => {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${postId}`);
      setPost(res.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching post');
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPost({ ...post, likes: res.data });
    } catch (err) {
      setError('Error liking post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/posts/${postId}/comment`, { content: comment });
      setPost({ ...post, comments: res.data });
      setComment('');
    } catch (err) {
      setError('Error adding comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${postId}`);
        navigate('/');
      } catch (err) {
        setError('Error deleting post');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <div>
        <div>
          <img 
            src={post.user.profileImage || '/default-avatar.png'} 
            alt={post.user.name} 
          />
          <h3>{post.user.name}</h3>
          <p>{new Date(post.createdAt).toLocaleString()}</p>
        </div>

        <p>{post.content}</p>
        
        {post.attachments && post.attachments.map((attachment, index) => (
          <img 
            key={index} 
            src={`/uploads/${attachment}`} 
            alt={`Attachment ${index + 1}`} 
          />
        ))}

        {post.user._id === user.id && (
          <button onClick={handleDelete}>Delete Post</button>
        )}

        <div>
          <button onClick={handleLike}>
            {post.likes.includes(user.id) ? 'Unlike' : 'Like'} ({post.likes.length})
          </button>
        </div>

        <form onSubmit={handleComment}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit">Comment</button>
        </form>

        <div>
          {post.comments.map(comment => (
            <div key={comment._id}>
              <img 
                src={comment.user.profileImage || '/default-avatar.png'} 
                alt={comment.user.name} 
              />
              <strong>{comment.user.name}</strong>
              <p>{comment.content}</p>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;