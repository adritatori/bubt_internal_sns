import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

// Initialize context with default values
export const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  loading: true,
  fetchNotifications: () => {},
  markAsRead: () => {},
  createAnnouncementNotification: () => {}
});

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching notifications...');
      const res = await api.get('/notifications');
      console.log('Notifications response:', res.data);
      setNotifications(res.data);
      setUnreadCount(res.data.filter(notif => !notif.read).length);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      setError('Failed to fetch notifications');
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const createAnnouncementNotification = async (announcementId, recipientIds, targetInfo) => {
    try {
      const res = await api.post('/notifications/announcements', {
        recipientIds,
        announcementId,
        targetInfo
      });
      await fetchNotifications();
      console.log('Notification created:', res);
    } catch (err) {
      console.error('Error creating notification:', err);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    createAnnouncementNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};