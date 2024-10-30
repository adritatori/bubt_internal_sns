const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');
const upload = require('../middleware/upload'); // Import the upload middleware

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, profileController.getCurrentProfile);

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, upload.single('profileImage'), profileController.createOrUpdateProfile);

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
