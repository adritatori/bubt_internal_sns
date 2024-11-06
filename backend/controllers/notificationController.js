const Notification = require('../models/Notifications');
const User = require('../models/User');
const Announcement = require('../models/Announcement'); // Assuming you have an Announcement model

const notificationController = {
  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find({ recipient: req.user.id })
        .populate({
          path: 'announcement', 
          populate: {
            path: 'teacher',
            select: 'name profileImage'
          }
        })
        .sort('-createdAt');
  
      res.json(notifications);
    } catch (err) {
      console.error('Get notifications error:', err);
      res.status(500).send('Server Error');
    }
  },

  markAsRead: async (req, res) => {
    try {
      const notification = await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          recipient: req.user.id
        },
        { read: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ msg: 'Notification not found' });
      }

      res.json(notification);
    } catch (err) {
      console.error('Mark as read error:', err);
      res.status(500).send('Server Error');
    }
  },

  getUnreadCount: async (req, res) => {
    try {
      const count = await Notification.countDocuments({
        recipient: req.user.id,
        read: false
      });

      res.json({ count });
    } catch (err) {
      console.error('Get unread count error:', err);
      res.status(500).send('Server Error');
    }
  },

  // Add a function to create notifications for announcements
  createAnnouncementNotifications: async (req, res) => {
    try {
      const { recipientIds, announcementId, targetInfo } = req.body; 
      const sender = await User.findById(req.user.id);

      // Ensure the sender is a teacher
      if (sender.role !== 'teacher') {
        return res.status(403).json({ msg: 'Only teachers can send announcements' });
      }

      // Find the announcement
      const announcement = await Announcement.findById(announcementId);
      if (!announcement) {
        return res.status(404).json({ msg: 'Announcement not found' });
      }

      // Create notifications for each recipient
      const notifications = await Notification.createAnnouncementNotification(
        recipientIds,
        sender._id,
        announcement,
        targetInfo
      );
      res.json({ message: 'Notifications created successfully', notifications });
    } catch (err) {
      console.error('Create announcement notifications error:', err);
      res.status(500).send('Server Error');
    }
  }
};

module.exports = notificationController;