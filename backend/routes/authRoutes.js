const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
// Register route with file upload
router.post('/register', upload.single('profileImage'), authController.register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/me
// @desc    Get authenticated user
// @access  Private
router.get('/me', auth, authController.verifyToken);

module.exports = router;
