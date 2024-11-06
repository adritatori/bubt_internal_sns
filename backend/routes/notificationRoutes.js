const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Debug route
router.get('/test', (req, res) => {
  res.json({ message: 'Notification routes are working' });
});

// Get all notifications
router.get('/', auth, notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', auth, notificationController.markAsRead);

// Get unread count
router.get('/unread-count', auth, notificationController.getUnreadCount);

// Create announcement notifications
router.post('/announcements', auth, notificationController.createAnnouncementNotifications);

module.exports = router;