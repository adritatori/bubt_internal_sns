const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const announcementController = require('../controllers/announcementController');

// @route   POST api/announcements
// @desc    Create new announcement
// @access  Private (Teachers only)
router.post('/',
  auth,
  upload.single('announcementImage'),
  announcementController.createAnnouncement
);

// @route   GET api/announcements
// @desc    Get all relevant announcements
// @access  Private
router.get('/',
  auth,
  announcementController.getAnnouncements
);

// @route   GET api/announcements/teacher
// @desc    Get teacher's announcements
// @access  Private (Teachers only)
router.get('/teacher',
  auth,
  announcementController.getTeacherAnnouncements
);

// @route   DELETE api/announcements/:id
// @desc    Delete an announcement
// @access  Private (Teachers only)
router.delete('/:id',
  auth,
  announcementController.deleteAnnouncement
);

// @route   PATCH api/announcements/:id
// @desc    Update an announcement
// @access  Private (Teachers only)
router.patch('/:id',
  auth,
  upload.single('announcementImage'),
  announcementController.updateAnnouncement
);

module.exports = router;