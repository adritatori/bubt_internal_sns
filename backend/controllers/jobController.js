// controllers/jobController.js
const Job = require('../models/Job');

const jobController = {
    createJob: async (req, res) => {
        try {
            const newJob = new Job({
                user: req.user.id,
                ...req.body
            });
            
            const job = await newJob.save();
            res.json(job);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    getJobs: async (req, res) => {
        try {
            const jobs = await Job.find()
                .sort({ createdAt: -1 })
                .populate('user', 'name email profileImage');
            res.json(jobs);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    getJob: async (jobId) => {
        try {
            const job = await Job.findById(jobId)
                .populate('user', 'name email profileImage')
                .populate('matchedCandidates.student', 'name email profileImage');
            return job;
        } catch (err) {
            throw new Error('Error fetching job');
        }
    },

    applyForJob: async (jobId, userId) => {
        try {
            const job = await Job.findById(jobId);
            if (!job) {
                throw new Error('Job not found');
            }

            // Check if already applied
            const alreadyApplied = job.matchedCandidates.some(
                candidate => candidate.student.toString() === userId
            );

            if (alreadyApplied) {
                throw new Error('Already applied to this job');
            }

            // Add application
            job.matchedCandidates.push({
                student: userId,
                status: 'pending',
                appliedDate: Date.now()
            });

            await job.save();
            return job;
        } catch (err) {
            throw new Error(err.message);
        }
    },

    updateCandidateStatus: async (jobId, candidateId, newStatus) => {
        try {
            const job = await Job.findById(jobId);
            if (!job) {
                throw new Error('Job not found');
            }

            const candidateIndex = job.matchedCandidates.findIndex(
                candidate => candidate.student.toString() === candidateId
            );

            if (candidateIndex === -1) {
                throw new Error('Candidate not found');
            }

            job.matchedCandidates[candidateIndex].status = newStatus;
            await job.save();
            return job;
        } catch (err) {
            throw new Error(err.message);
        }
    }
};

module.exports = jobController;