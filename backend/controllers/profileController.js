const Profile = require('../models/Profile');
const User = require('../models/User');
const { deleteFile } = require('../middleware/upload');

const profileController = {
  // Create or update user profile
  createOrUpdateProfile: async (req, res) => {
    try {
      // Parse JSON strings if they come as strings
      const {
        bio,
        department,
        skills,
        socialLinks,
        studentInfo,
        teacherInfo,
        alumniInfo
      } = req.body;

      // Find existing profile or create new one
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        profile = new Profile({ user: req.user.id });
      }

      // Update basic fields
      profile.bio = bio || profile.bio;
      profile.department = department || profile.department;

      // Handle skills (array or comma-separated string)
      if (skills) {
        profile.skills = Array.isArray(skills) 
          ? skills 
          : skills.split(',').map(skill => skill.trim());
      }

      // Handle social links
      if (socialLinks) {
        try {
          profile.socialLinks = typeof socialLinks === 'string' 
            ? JSON.parse(socialLinks)
            : socialLinks;
        } catch (err) {
          console.error('Error parsing social links:', err);
        }
      }

      // Handle role-specific information
      if (studentInfo) {
        try {
          profile.studentInfo = typeof studentInfo === 'string'
            ? JSON.parse(studentInfo)
            : studentInfo;
        } catch (err) {
          console.error('Error parsing student info:', err);
        }
      }

      if (teacherInfo) {
        try {
          profile.teacherInfo = typeof teacherInfo === 'string'
            ? JSON.parse(teacherInfo)
            : teacherInfo;
        } catch (err) {
          console.error('Error parsing teacher info:', err);
        }
      }

      if (alumniInfo) {
        try {
          profile.alumniInfo = typeof alumniInfo === 'string'
            ? JSON.parse(alumniInfo)
            : alumniInfo;
        } catch (err) {
          console.error('Error parsing alumni info:', err);
        }
      }

      // Handle profile image upload
      if (req.file) {
        // If there's an existing profile image, delete it
        if (profile.profileImage) {
          await deleteFile(profile.profileImage);
        }
        profile.profileImage = req.file.filename;
      }

      // Save the profile
      const savedProfile = await profile.save();

      // Update user's profile image reference
      if (req.file) {
        await User.findByIdAndUpdate(req.user.id, {
          profileImage: req.file.filename
        });
      }

      // Populate user information and return
      await savedProfile.populate('user', ['name', 'email', 'role']);
      res.json(savedProfile);

    } catch (err) {
      console.error('Profile save error:', err);
      res.status(500).json({ 
        error: 'Server Error', 
        message: err.message 
      });
    }
  },

  // Get current user's profile
  getCurrentProfile: async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'email', 'role', 'profileImage']);

      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }

      res.json(profile);
    } catch (err) {
      console.error('Get profile error:', err);
      res.status(500).json({ 
        error: 'Server Error',
        message: err.message 
      });
    }
  },

  // Get all profiles
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await Profile.find()
        .populate('user', ['name', 'email', 'role', 'profileImage']);
      res.json(profiles);
    } catch (err) {
      console.error('Get all profiles error:', err);
      res.status(500).json({ 
        error: 'Server Error',
        message: err.message 
      });
    }
  },

  // Get profile by user ID
  getProfileByUserId: async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'email', 'role', 'profileImage']);

      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }

      res.json(profile);
    } catch (err) {
      console.error('Get profile by ID error:', err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Profile not found' });
      }
      res.status(500).json({ 
        error: 'Server Error',
        message: err.message 
      });
    }
  },

  // Delete profile and user
  deleteProfile: async (req, res) => {
    try {
      // Get profile to access image filename
      const profile = await Profile.findOne({ user: req.user.id });
      
      if (profile && profile.profileImage) {
        // Delete profile image file
        await deleteFile(profile.profileImage);
      }

      // Remove profile
      await Profile.findOneAndRemove({ user: req.user.id });
      
      // Remove user
      await User.findOneAndRemove({ _id: req.user.id });

      res.json({ msg: 'User and profile deleted successfully' });
    } catch (err) {
      console.error('Delete profile error:', err);
      res.status(500).json({ 
        error: 'Server Error',
        message: err.message 
      });
    }
  }
};

module.exports = profileController;