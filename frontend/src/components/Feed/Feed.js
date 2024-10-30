import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';
import Comment from '../Comment/Comment';

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = useCallback(async () => {
    try {
      const res = await api.get(`/feed?page=${page}`);
      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setFeedItems(prevItems => [...prevItems, ...res.data]);
        setPage(prevPage => prevPage + 1);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (hasMore) {
        fetchFeed();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  if (loading && page === 1) {
    return <div>Loading feed...</div>;
  }

  const handleCommentAdded = (postId, newComment) => {
    setFeedItems(prevItems =>
      prevItems.map(item =>
        item._id === postId
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Feed</h2>
      {feedItems.map((item) => (
        <div key={item._id} className="bg-white shadow rounded-lg p-4 mb-4">
          {item.type === 'post' && (
            <div>
              <p className="font-semibold">{item.user.name}</p>
              <p>{item.content}</p>
              {item.attachments && item.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Attachments:</p>
                  {item.attachments.map((attachment, index) => (
                    <a key={index} href={attachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              )}
              <div className="mt-2 text-sm text-gray-500">
                <span>{new Date(item.createdAt).toLocaleString()}</span>
                <span className="ml-4">{item.likes.length} likes</span>
                <span className="ml-4">{item.comments.length} comments</span>
              </div>
            </div>
          )}
          {item.type === 'announcement' && (
            <div>
              <p className="font-semibold text-red-600">Announcement</p>
              <p className="font-semibold">{item.title}</p>
              <p>{item.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted by {item.user.name} on {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          )}
          {item.type === 'job' && (
            <div>
              <p className="font-semibold text-green-600">Job Posting</p>
              <p className="font-semibold">{item.title}</p>
              <p>{item.company}</p>
              <p>{item.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted by {item.user.name} on {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          )}
          <div className="mt-4">
            <h4 className="font-semibold">Comments</h4>
            {item.comments.map((comment) => (
              <div key={comment._id} className="mt-2">
                <p><strong>{comment.user.name}:</strong> {comment.content}</p>
              </div>
            ))}
            <Comment postId={item._id} onCommentAdded={(newComment) => handleCommentAdded(item._id, newComment)} />
          </div>
        </div>
      ))}
      {loading && <div>Loading more...</div>}
      {!hasMore && <div>No more posts to load</div>}
    </div>
  );
};

export default Feed;
