const User = require('../models/User');

const userController = {
  searchUsers: async (req, res) => {
    try {
      const searchTerm = req.query.q;
      const users = await User.find(
        { $text: { $search: searchTerm } },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .select('-password');
      
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },

  followUser: async (req, res) => {
    try {
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);

      if (userToFollow.followers.includes(req.user.id)) {
        // Unfollow
        userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.user.id);
        currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
      } else {
        // Follow
        userToFollow.followers.push(req.user.id);
        currentUser.following.push(req.params.id);
        
        // Add notification
        userToFollow.notifications.unshift({
          type: 'follow',
          fromUser: req.user.id
        });
      }

      await userToFollow.save();
      await currentUser.save();

      res.json({
        followers: userToFollow.followers,
        following: currentUser.following
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },

  getNotifications: async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .populate('notifications.fromUser', ['name', 'profileImage'])
        .populate('notifications.post', ['content'])
        .populate('notifications.announcement', ['title']);
      
      res.json(user.notifications);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },

  markNotificationsAsRead: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      user.notifications = user.notifications.map(notification => ({
        ...notification.toObject(),
        read: true
      }));
      
      await user.save();
      res.json(user.notifications);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
};

module.exports = userController;