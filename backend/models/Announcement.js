// models/Announcement.js
const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['all', 'intake-section', 'intake-only', 'specific-student'], // Updated enum values
    required: true
  },
  department: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: function() {
      return this.targetType === 'intake-section';
    }
  },
  intake: {
    type: String,
    required: function() {
      return ['intake-section', 'intake-only'].includes(this.targetType);
    }
  },
  specificStudentId: {
    type: String,
    required: function() {
      return this.targetType === 'specific-student';
    }
  },
  image: {
    type: String
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
AnnouncementSchema.index({ teacher: 1, createdAt: -1 });
AnnouncementSchema.index({ department: 1, targetType: 1 });
AnnouncementSchema.index({ targetType: 1 });
AnnouncementSchema.index({ 'readBy.user': 1 });

// Add virtual for formatting date
AnnouncementSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Ensure virtuals are included in JSON
AnnouncementSchema.set('toJSON', { virtuals: true });
AnnouncementSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);