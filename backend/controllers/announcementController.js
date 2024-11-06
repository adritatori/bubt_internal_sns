// controllers/announcementController.js
const Announcement = require('../models/Announcement');
const User = require('../models/User');
const Notification = require('../models/Notifications');
const { deleteFile, getFileUrl } = require('../middleware/upload');

// Function to create notifications for target students
const createNotifications = async (announcement, targetStudents, req) => {
      if (targetStudents.length > 0) {
        await Notification.create(
          targetStudents.map(studentId => ({
            recipient: studentId,
            sender: req.user.id,
            type: 'announcement',
            announcement: announcement._id,
            title: `New Announcement: ${announcement.title}`,
            content: announcement.content
          }))
        );
      }
        };

const announcementController = {
  createAnnouncement: async (req, res) => {
    try {
      const {
        title,
        content,
        targetType,
        department,
        intake,
        section,
        specificStudentId
      } = req.body;

      // Verify teacher
      const teacher = await User.findById(req.user.id);
      if (teacher.role !== 'teacher') {
        if (req.file) await deleteFile(req.file.filename, 'announcement');
        return res.status(403).json({ msg: 'Only teachers can create announcements' });
      }

      // Create announcement object
      const newAnnouncement = new Announcement({
        teacher: req.user.id,
        title,
        content,
        targetType,
        department,
        intake,
        section,
        specificStudentId,
        image: req.file ? getFileUrl(req.file.filename, 'announcement') : null
      });

      // Save announcement
      const announcement = await newAnnouncement.save();

      // Get target students based on criteria
      let targetStudents = [];
      const baseQuery = { role: 'student', 'studentInfo.department': department };

      switch (targetType) {
        case 'all':
          targetStudents = await User.find(baseQuery).select('_id');
          break;

        case 'intake-section':
          targetStudents = await User.find({
            ...baseQuery,
            'studentInfo.intake': intake,
            'studentInfo.section': section
          }).select('_id');
          break;

        case 'intake-only':
          targetStudents = await User.find({
            ...baseQuery,
            'studentInfo.intake': intake
          }).select('_id');
          break;

        case 'specific-student':
          const student = await User.findOne({
            ...baseQuery,
            'studentInfo.studentId': specificStudentId
          }).select('_id');
          if (student) targetStudents = [student];
          break;
      }

      // Create notifications for target students
      createNotifications(announcement, targetStudents, req);

      // Populate teacher info and return
      await announcement.populate('teacher', 'name profileImage');
      
      res.json(announcement);
    } catch (err) {
      console.error('Create announcement error:', err);
      // Clean up uploaded file if there was an error
      if (req.file) await deleteFile(req.file.filename, 'announcement');
      res.status(500).json({
        msg: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },

  getAnnouncements: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      let query = {};

      if (user.role === 'student') {
        query = {
          $or: [
            { targetType: 'all', department: user.studentInfo.department },
            {
              targetType: 'intake-section',
              department: user.studentInfo.department,
              intake: user.studentInfo.intake,
              section: user.studentInfo.section
            },
            {
              targetType: 'intake-only',
              department: user.studentInfo.department,
              intake: user.studentInfo.intake
            },
            {
              targetType: 'specific-student',
              department: user.studentInfo.department,
              specificStudentId: user.studentInfo.studentId
            }
          ]
};
      } else if (user.role === 'teacher') {
        query = { teacher: user._id };
      }

      const announcements = await Announcement.find(query)
        .sort({ createdAt: -1 })
        .populate('teacher', 'name profileImage')
        .lean();

      const notifications = await Notification.find({
        recipient: user._id,
        type: 'announcement',
        announcement: { $in: announcements.map(a => a._id) }
      }).select('announcement read');

      // Add read status to announcements
      const announcementsWithReadStatus = announcements.map(announcement => ({
        ...announcement,
        isRead: notifications.some(
          notification => 
            notification.announcement.toString() === announcement._id.toString() && 
            notification.read
        )
      }));

      res.json(announcementsWithReadStatus);
    } catch (err) {
      console.error('Get announcements error:', err);
      res.status(500).json({
        msg: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },

  getTeacherAnnouncements: async (req, res) => {
    try {
      const announcements = await Announcement.find({ teacher: req.user.id })
        .sort({ createdAt: -1 })
        .populate('teacher', 'name profileImage');

      res.json(announcements);
    } catch (err) {
      console.error('Get teacher announcements error:', err);
      res.status(500).send('Server Error');
    }
  },

  deleteAnnouncement: async (req, res) => {
    try {
      const announcement = await Announcement.findById(req.params.id);
      
      if (!announcement) {
        return res.status(404).json({ msg: 'Announcement not found' });
      }

      // Verify ownership
      if (announcement.teacher.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized' });
      }

      // Delete image if exists
      if (announcement.image) {
        const filename = announcement.image.split('/').pop();
        await deleteFile(filename, 'announcement');
      }

      // Delete related notifications
      await Notification.deleteMany({ announcement: announcement._id });

      // Delete announcement
      await announcement.remove();
      
      res.json({ msg: 'Announcement removed' });
    } catch (err) {
      console.error('Delete announcement error:', err);
      res.status(500).send('Server Error');
    }
  },

  updateAnnouncement: async (req, res) => {
    try {
      const announcement = await Announcement.findById(req.params.id);
      
      if (!announcement) {
        if (req.file) await deleteFile(req.file.filename, 'announcement');
        return res.status(404).json({ msg: 'Announcement not found' });
      }

      // Verify ownership
      if (announcement.teacher.toString() !== req.user.id) {
        if (req.file) await deleteFile(req.file.filename, 'announcement');
        return res.status(403).json({ msg: 'Not authorized' });
      }

      // Update fields
      const updateFields = { ...req.body };
      
      // Handle image update
      if (req.file) {
        // Delete old image
        if (announcement.image) {
          const oldFilename = announcement.image.split('/').pop();
          await deleteFile(oldFilename, 'announcement');
        }
        updateFields.image = getFileUrl(req.file.filename, 'announcement');
      }

      // Update announcement
      const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
      ).populate('teacher', 'name profileImage');

      res.json(updatedAnnouncement);
    } catch (err) {
      console.error('Update announcement error:', err);
      if (req.file) await deleteFile(req.file.filename, 'announcement');
      res.status(500).send('Server Error');
    }
  }
};

module.exports = announcementController;