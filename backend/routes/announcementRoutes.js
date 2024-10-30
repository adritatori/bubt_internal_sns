const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const announcementController = require('../controllers/announcementController');

router.post('/', auth, announcementController.createAnnouncement);
router.get('/', auth, announcementController.getAnnouncements);

module.exports = router;
