const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Controller functions
const profileController = {
  // Create or update user profile
  createOrUpdateProfile: async (req, res) => {
    const {
      bio,
      department,
      skills,
      socialLinks,
      studentInfo,
      teacherInfo,
      alumniInfo
    } = req.body;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        profile = new Profile({ user: req.user.id });
      }

      // Update common fields
      profile.bio = bio;
      profile.department = department;
      profile.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
      profile.socialLinks = socialLinks;

      // Handle profile picture upload
      if (req.file) {
        profile.profileImage = req.file.path; // Save the path of the uploaded image
      }

      // Update role-specific information
      if (alumniInfo) {
        profile.alumniInfo = alumniInfo;
      }
      if (studentInfo) {
        profile.studentInfo = studentInfo;
      }
      if (teacherInfo) {
        profile.teacherInfo = teacherInfo;
      }

      const savedProfile = await profile.save();
      res.json(savedProfile);
    } catch (err) {
      console.error('Error saving profile:', err);
      res.status(500).json({ error: 'Server Error', details: err.message });
    }
  },

  // Get current user's profile
  getCurrentProfile: async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'role']);
      
      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },

  // Get all profiles
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'email', 'role']);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },

  // Get profile by user ID
  getProfileByUserId: async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'email', 'role']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      if (err.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'Profile not found' });
      }
      res.status(500).send('Server Error');
    }
  },

  // Delete profile and user
  deleteProfile: async (req, res) => {
    try {
      // Remove profile
      await Profile.findOneAndRemove({ user: req.user.id });
      // Remove user
      await User.findOneAndRemove({ _id: req.user.id });

      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
};

module.exports = profileController;
