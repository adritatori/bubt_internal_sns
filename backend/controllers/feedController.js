const Post = require('../models/Post');
const Announcement = require('../models/Announcement');
const Job = require('../models/Job');
const User = require('../models/User');

const feedController = {
  getFeed: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      // Get posts from followed users and self
      const followedUsers = [...user.following, req.user.id];
      const posts = await Post.find({ user: { $in: followedUsers } })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
          path: 'user',
          select: 'name profileImage role'
        })
        .populate({
          path: 'comments.user',
          select: 'name profileImage role'
        })
        .populate({
          path: 'likes',
          select: 'name profileImage'
        });

      // Get relevant announcements for the user
      const announcements = await Announcement.find({
        $or: [
          { targetType: 'all', department: user.studentInfo?.department || user.teacherInfo?.department || user.alumniInfo?.department },
          {
            targetType: 'intake-section',
            department: user.studentInfo?.department || user.teacherInfo?.department || user.alumniInfo?.department,
            intake: user.studentInfo?.intake || user.alumniInfo?.intake,
            section: user.studentInfo?.section || user.alumniInfo?.section
          },
          {
            targetType: 'intake-only',
            department: user.studentInfo?.department || user.teacherInfo?.department || user.alumniInfo?.department,
            intake: user.studentInfo?.intake || user.alumniInfo?.intake
          },
          {
            targetType: 'specific-student',
            specificStudentId: user.studentInfo?.studentId
          }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: 'teacher',
          select: 'name profileImage role'
        });

      // Combine and sort all items by date
      const feedItems = [...posts, ...announcements]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.json(feedItems);
    } catch (err) {
      console.error('Feed error:', err);
      res.status(500).json({ 
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
};

module.exports = feedController;