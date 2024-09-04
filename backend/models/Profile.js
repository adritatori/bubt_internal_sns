const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String
  },
  department: {
    type: String,
    required: true
  },
  // Fields specific to user roles
  teacherCode: {
    type: String
  },
  classId: {
    type: String
  },
  intake: {
    type: String
  },
  section: {
    type: String
  },
  passingYear: {
    type: Number
  },
  // Common fields
  skills: [String],
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    from: Date,
    to: Date
  }],
  social: {
    twitter: String,
    facebook: String,
    linkedin: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);