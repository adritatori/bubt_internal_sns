// backend/routes/jobMatchingRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jobMatchingController = require('../controllers/jobMatchingController');

/**
 * @route   GET api/job-matching/:jobId/matches
 * @desc    Get matching students for a job
 * @access  Private
 */
router.get('/:jobId/matches', auth, jobMatchingController.matchStudentsWithJob);

/**
 * @route   GET api/job-matching/student/:studentId/matches
 * @desc    Get matching jobs for a student
 * @access  Private
 */
router.get('/student/:studentId/matches', auth, jobMatchingController.matchJobsWithStudent);

// Basic error handling for the matching service
router.use((err, req, res, next) => {
  console.error('Job Matching Error:', err);
  res.status(500).json({ 
    msg: 'Error in job matching service',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;