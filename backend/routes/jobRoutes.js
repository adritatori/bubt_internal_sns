// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jobController = require('../controllers/jobController');
const jobMatchingController = require('../controllers/jobMatchingController');

// @route   POST api/jobs
// @desc    Create a new job
// @access  Private (Alumni only)
router.post('/', auth, jobController.createJob);

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Private
router.get('/', auth, jobController.getJobs);

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const job = await jobController.getJob(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/jobs/:jobId/matches
// @desc    Get matching students for a job
// @access  Private
router.get('/:jobId/matches', auth, jobMatchingController.matchStudentsWithJob);

// @route   PUT api/jobs/:jobId/apply
// @desc    Apply for a job
// @access  Private (Students only)
router.put('/:jobId/apply', auth, async (req, res) => {
    try {
        const job = await jobController.applyForJob(req.params.jobId, req.user.id);
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   PUT api/jobs/:jobId/status
// @desc    Update candidate status
// @access  Private (Alumni only)
router.put('/:jobId/status', auth, async (req, res) => {
    try {
        const { candidateId, status } = req.body;
        const job = await jobController.updateCandidateStatus(
            req.params.jobId,
            candidateId,
            status
        );
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;