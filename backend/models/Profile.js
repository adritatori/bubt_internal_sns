const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: 'Not specified'
  },
  skills: {
    type: [String],
    default: []
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  studentInfo: {
    studentId: { type: String, default: '' },
    batch: { type: String, default: '' },
    cgpa: { type: Number, default: 0 }
  },
  teacherInfo: {
    designation: { type: String, default: '' },
    courses: { type: [String], default: [] },
    researchInterests: { type: [String], default: [] },
    officeHours: { type: String, default: '' }
  },
  alumniInfo: {
    graduationYear: { type: Number, default: null },
    currentCompany: { type: String, default: '' },
    jobTitle: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);
// Add index for faster lookups
ProfileSchema.index({ user: 1 });

// Add validation to ensure one profile per user
ProfileSchema.index({ user: 1 }, { unique: true });