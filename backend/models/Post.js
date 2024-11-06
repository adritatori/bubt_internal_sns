const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  postType: {
    type: String,
    enum: ['regular', 'academic', 'job', 'announcement'],
    default: 'regular'
  },
  attachments: [{
    type: String // Store file paths
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better performance
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);