const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    default: 'Not specified'
  },
  bio: {
    type: String
  }
}, { 
  collection: 'profiles',
  timestamps: true 
});

module.exports = mongoose.model('Profile', ProfileSchema);
