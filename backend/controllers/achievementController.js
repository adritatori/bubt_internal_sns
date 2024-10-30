const Achievement = require('../models/Achievement');
const User = require('../models/User');

const achievementController = {
  addAchievement: async (req, res) => {
    try {
      const { title, description, date, type } = req.body;
      const user = await User.findById(req.user.id);
      if (user.role !== 'student') {
        return res.status(403).json({ msg: 'Only students can add achievements' });
      }
      const newAchievement = new Achievement({
        user: req.user.id,
        title,
        description,
        date,
        type
      });
      const achievement = await newAchievement.save();
      res.json(achievement);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },

  getAchievements: async (req, res) => {
    try {
      const achievements = await Achievement.find({ user: req.user.id })
        .sort({ date: -1 });
      res.json(achievements);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
};

module.exports = achievementController;
