// models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  requiredSkills: [{
    type: String,
    required: true
  }],
  preferredSkills: [{
    type: String
  }],
  // New fields for job details
  education: {
    type: String,
    required: true,
    enum: ['Bachelors', 'Masters', 'PhD', 'Any']
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['Entry Level', 'Mid Level', 'Senior Level']
  },
  salary: {
    range: {
      min: Number,
      max: Number
    },
    type: String, // monthly, yearly
    negotiable: Boolean
  },
  matchedCandidates: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    matchScore: {
      total: Number,
      skillsMatch: Number,
      educationMatch: Number,
      achievementsMatch: Number
    },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected', 'hired'],
      default: 'pending'
    },
    appliedDate: Date
  }],
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract', 'remote'],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'draft'],
    default: 'open'
  },
  applicationDeadline: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better search performance
JobSchema.index({ 
  title: 'text', 
  description: 'text', 
  company: 'text',
  requiredSkills: 'text'
});

// Update timestamp on save
JobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', JobSchema);