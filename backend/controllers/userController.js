// controllers/userController.js
const mongoose = require('mongoose');
const User = mongoose.model('User');

const userController = {
  searchUsers: async (req, res) => {
    try {
      const searchTerm = req.query.term;
      
      if (!searchTerm) {
        return res.json([]);
      }

      const users = await User.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        ]
      })
      .select('name email role profileImage followers')
      .limit(10);

      // Add isFollowing status and format response
      const currentUserId = req.user.id;
      const formattedUsers = users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isFollowing: user.followers.includes(currentUserId)
      }));

      res.json(formattedUsers);
    } catch (err) {
      console.error('Error searching users:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  },

  followUser: async (req, res) => {
    try {
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);

      if (!userToFollow || !currentUser) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const isFollowing = userToFollow.followers.includes(req.user.id);

      if (isFollowing) {
        // Unfollow
        userToFollow.followers = userToFollow.followers.filter(
          id => id.toString() !== req.user.id
        );
        currentUser.following = currentUser.following.filter(
          id => id.toString() !== req.params.id
        );
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
        success: true,
        isFollowing: !isFollowing
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
  }, 
  getUserInfo: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select('-password')
        .populate('followers', '_id')
        .populate('following', '_id');
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Return followers as array of IDs
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        followers: user.followers.map(follower => follower._id.toString()), // Convert to string
        following: user.following.map(following => following._id.toString()),
        createdAt: user.createdAt
      });
    } catch (err) {
      console.error('Error getting user info:', err.message);
      res.status(500).send('Server Error');
    }
  }
  
};

module.exports = userController;