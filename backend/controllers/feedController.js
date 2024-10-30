const Post = require('../models/Post');
const Announcement = require('../models/Announcement');
const Job = require('../models/Job');
const User = require('../models/User');

const feedController = {
  getFeed: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      // Get posts from followed users
      const followedUsers = user.following;
      const posts = await Post.find({ user: { $in: followedUsers } })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', ['name', 'profileImage']);

      // Get relevant announcements
      const announcements = await Announcement.find({
        $or: [
          { department: user.department },
          { targetGroups: user.batch }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', ['name', 'profileImage']);

      // Get recent job postings
      const jobs = await Job.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', ['name', 'profileImage']);

      // Combine and sort all items
      const feedItems = [...posts, ...announcements, ...jobs]
        .sort((a, b) => b.createdAt - a.createdAt);

      res.json(feedItems);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
};

module.exports = feedController;
