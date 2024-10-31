const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');  // Updated import
const profileController = require('../controllers/profileController');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, profileController.getCurrentProfile);

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', [
  auth,
  upload.single('profileImage'),
  (err, req, res, next) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          error: 'File too large',
          message: 'Profile image must be less than 5MB' 
        });
      }
      return res.status(400).json({ 
        error: 'Upload error',
        message: err.message 
      });
    }
    next();
  }
], profileController.createOrUpdateProfile);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', profileController.getAllProfiles);

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', profileController.getProfileByUserId);

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, profileController.deleteProfile);

module.exports = router;