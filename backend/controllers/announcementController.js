const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Announcement = require('../models/Announcement');


// Middleware to check if user is a teacher
const isTeacher = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'teacher') {
      return res.status(403).json({ msg: 'Not authorized as teacher' });
    }
    next();
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @route   POST api/announcements
// @desc    Create an announcement
// @access  Private (Teachers only)
router.post('/', [auth, isTeacher], async (req, res) => {
  try {
    const { title, content, targetGroups, department } = req.body;

    const newAnnouncement = new Announcement({
      teacher: req.user.id,
      title,
      content,
      targetGroups: targetGroups || [],
      department
    });

    const announcement = await newAnnouncement.save();
    await announcement.populate('teacher', ['name', 'profileImage']);
    
    res.json(announcement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/announcements
// @desc    Get announcements (filtered by department/group for students)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let query = {};

    if (user.role === 'student') {
      query = {
        $or: [
          { department: user.department },
          { targetGroups: user.group }
        ]
      };
    }

    const announcements = await Announcement.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .populate('teacher', ['name', 'profileImage']);
    
    res.json(announcements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/announcements/:id
// @desc    Delete an announcement
// @access  Private (Teachers only)
router.delete('/:id', [auth, isTeacher], async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }

    // Check ownership
    if (announcement.teacher.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await announcement.remove();
    res.json({ msg: 'Announcement removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const announcementController = {
  createAnnouncement: async (req, res) => {
    try {
      const { title, content, department, targetGroups } = req.body;
      const user = await User.findById(req.user.id);
      if (user.role !== 'teacher') {
        return res.status(403).json({ msg: 'Only teachers can create announcements' });
      }
      const newAnnouncement = new Announcement({
        user: req.user.id,
        title,
        content,
        department,
        targetGroups
      });
      const announcement = await newAnnouncement.save();
      res.json(announcement);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },

  getAnnouncements: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      let query = {};
      if (user.role === 'student') {
        query = {
          $or: [
            { department: user.department },
            { targetGroups: user.batch }
          ]
        };
      }
      const announcements = await Announcement.find(query)
        .sort({ createdAt: -1 })
        .populate('user', ['name', 'profileImage']);
      res.json(announcements);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },

  deleteAnnouncement: async (req, res) => {
    try {
      const announcement = await Announcement.findById(req.params.id);
      
      if (!announcement) {
        return res.status(404).json({ msg: 'Announcement not found' });
      }

      // Check ownership
      if (announcement.teacher.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      await announcement.remove();
      res.json({ msg: 'Announcement removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
};

console.log('Exporting announcementController:', announcementController);
module.exports = announcementController;

// You can add more controller functions here as needed
