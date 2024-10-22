const Profile = require('../models/Profile');

module.exports = async function(req, res, next) {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      console.log('No profile found, creating one for user:', req.user.id);
      profile = new Profile({
        user: req.user.id,
        department: 'Not specified'
      });
      await profile.save();
      console.log('Default profile created:', profile);
    }
    
    req.profile = profile;
    next();
  } catch (err) {
    console.error('Error in ensureProfile middleware:', err);
    res.status(500).send('Server Error');
  }
};

