import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/users/notifications');
      setNotifications(res.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching notifications');
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await api.put('/users/notifications/read');
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    } catch (err) {
      setError('Error marking notifications as read');
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case 'follow':
        return (
          <Link to={`/profile/${notification.fromUser._id}`}>
            {notification.fromUser.name} started following you
          </Link>
        );
      case 'like':
        return (
          <Link to={`/posts/${notification.post._id}`}>
            {notification.fromUser.name} liked your post
          </Link>
        );
      case 'comment':
        return (
          <Link to={`/posts/${notification.post._id}`}>
            {notification.fromUser.name} commented on your post
          </Link>
        );
      case 'announcement':
        return (
          <div>
            New announcement: {notification.announcement.title}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div>
        <h2>Notifications</h2>
        <button onClick={markAsRead}>Mark All as Read</button>
      </div>

      <div>
        {notifications.map(notification => (
          <div 
            key={notification._id} 
            style={{ 
              backgroundColor: notification.read ? 'white' : '#f0f0f0'
            }}
          >
            {renderNotificationContent(notification)}
            <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;