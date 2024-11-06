// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for better query performance
  },
  // Reference to the sender (can be teacher or student)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'announcement',
      'follow',
      'like',
      'comment',
      'achievement',
      'job',
      'post'
    ]
  },
  // Reference to different types of content based on notification type
  announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  },
  // Additional info
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  read: {
    type: Boolean,
    default: false,
    index: true // Add index for better query performance
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for better query performance
  },
  // Target info for specific notifications (e.g., department, intake, section)
  targetInfo: {
    department: String,
    intake: String,
    section: String
  }
});

// Add compound index for efficient querying
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

// Instance method to mark notification as read
NotificationSchema.methods.markAsRead = async function() {
  this.read = true;
  await this.save();
};

// Static method to create announcement notification
NotificationSchema.statics.createAnnouncementNotification = async function(
  recipients,
  sender,
  announcement,
  targetInfo = {}
) {
  const notifications = recipients.map(recipient => ({
    recipient,
    sender,
    type: 'announcement',
    announcement: announcement._id,
    title: `New Announcement: ${announcement.title}`,
    content: announcement.content?.substring(0, 100) + (announcement.content?.length > 100 ? '...' : ''),
    targetInfo
  }));

  return this.insertMany(notifications);
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ recipient: userId, read: false });
};

// Static method to mark all as read for a user
NotificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { recipient: userId, read: false },
    { $set: { read: true } }
  );
};
NotificationSchema.statics.createAnnouncementNotification = async function(
  recipients,
  sender,
  announcement,
  targetInfo = {}
) {
  const notifications = recipients.map(recipient => ({
    recipient,
    sender,
    type: 'announcement',
    announcement: announcement._id,
    title: `New Announcement: ${announcement.title}`,
    content: announcement.content?.substring(0, 100) + (announcement.content?.length > 100 ? '...' : ''),
    targetInfo
  }));

  return this.insertMany(notifications);
};
// Pre-save middleware to ensure only one reference field is set based on type
NotificationSchema.pre('save', function(next) {
  const referenceFields = ['announcement', 'post', 'job', 'achievement'];
  referenceFields.forEach(field => {
    if (field !== this.type && this[field]) {
      this[field] = undefined;
    }
  });
  next();
});

// Add virtual for time elapsed
NotificationSchema.virtual('timeElapsed').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Configure toJSON
NotificationSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;