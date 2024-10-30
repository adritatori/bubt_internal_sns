const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const achievementController = require('../controllers/achievementController');

router.post('/', auth, achievementController.addAchievement);
router.get('/', auth, achievementController.getAchievements);

module.exports = router;
