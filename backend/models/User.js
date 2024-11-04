// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'teacher', 'alumni']
  },
  profileImage: {
    type: String,
    default: 'default.jpg'
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['follow', 'like', 'comment', 'announcement'],
      required: true
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    announcement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Announcement'
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  studentInfo: {
    studentId: { type: String, default: '' },
    intake: { type: String, default: '' },
    section: { type: String, default: '' },
    department: { type: String, default: '' },
    passingYear: { type: Number, default: null }
  },
  teacherInfo: {
    teacherCode: { type: String, default: '' },
    department: { type: String, default: '' }
  },
  alumniInfo: {
    id: { type: String, default: '' },
    section: { type: String, default: '' },
    intake: { type: String, default: '' },
    department: { type: String, default: '' },
    passingYear: { type: Number, default: null }
  }
});

// Create text indexes
UserSchema.index({ name: 'text', email: 'text' });

// Pre-remove hook
UserSchema.pre('remove', async function(next) {
  try {
    const Profile = mongoose.model('Profile');
    await Profile.findOneAndRemove({ user: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);