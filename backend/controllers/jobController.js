const Job = require('../models/Job');
const User = require('../models/User');

const jobController = {
  createJob: async (req, res) => {
    try {
      const { title, company, location, description, requirements, type } = req.body;
      const user = await User.findById(req.user.id);
      if (user.role !== 'alumni') {
        return res.status(403).json({ msg: 'Only alumni can post jobs' });
      }
      const newJob = new Job({
        user: req.user.id,
        title,
        company,
        location,
        description,
        requirements,
        type
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
        .populate('user', ['name', 'profileImage']);
      res.json(jobs);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
};

module.exports = jobController;
