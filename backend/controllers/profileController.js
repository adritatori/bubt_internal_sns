const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user.id);
    let profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'role']);
    
    if (!profile) {
      console.log('No profile found, creating one for user:', req.user.id);
      profile = new Profile({
        user: req.user.id,
        department: 'Not specified'
      });
      await profile.save();
    }

    console.log('Profile found or created:', profile);
    res.json(profile);
  } catch (err) {
    console.error('Error fetching/creating profile:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
