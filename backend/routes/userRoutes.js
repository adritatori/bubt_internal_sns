const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

console.log('User Controller:', userController);

router.get('/search', auth, userController.searchUsers);
router.put('/follow/:id', auth, userController.followUser);
router.get('/notifications', auth, userController.getNotifications);
router.put('/notifications/read', auth, userController.markNotificationsAsRead);

module.exports = router;
