const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jobController = require('../controllers/jobController');

router.post('/', auth, jobController.createJob);
router.get('/', auth, jobController.getJobs);

module.exports = router;
