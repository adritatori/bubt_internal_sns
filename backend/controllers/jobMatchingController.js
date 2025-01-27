// backend/controllers/jobMatchingController.js
const Job = require('../models/Job');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { batchCalculateSimilarity } = require('../utils/modelUtils');
const mongoose = require('mongoose');

const jobMatchingController = {
  matchStudentsWithJob: async (req, res) => {
    try {
      const { jobId } = req.params;
      console.log(`Job ID received: ${jobId}`);

      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ error: "Invalid Job ID" });
      }

      const job = await Job.findById(jobId)
        .populate('user', 'name email profileImage');

      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }

      // Get all profiles and populate user data
      const studentProfiles = await Profile.find()
        .populate({
          path: 'user',
          match: { role: 'student' },
          select: 'name email profileImage role'
        });

      // Filter out profiles where user is null (not a student)
      const validStudentProfiles = studentProfiles.filter(profile => profile.user !== null);

      // Prepare job context
      const jobContext = `
        Title: ${job.title}
        Description: ${job.description}
        Required Skills: ${job.requiredSkills?.join(', ') || ''}
        Job Type: ${job.type}
      `.trim();

      // Prepare student profiles for matching
      const profilesForMatching = validStudentProfiles.map(profile => `
        Bio: ${profile.bio || ''}
        Department: ${profile.department || ''}
        Skills: ${profile.skills?.join(', ') || ''}
        Student ID: ${profile.studentInfo?.studentId || ''}
        Batch: ${profile.studentInfo?.batch || ''}
        CGPA: ${profile.studentInfo?.cgpa || ''}
      `.trim());

      const similarities = await batchCalculateSimilarity(jobContext, profilesForMatching);

      // Create matches with complete profile information
      const matches = similarities
        .map((sim, index) => ({
          student: {
            _id: validStudentProfiles[index].user._id,
            name: validStudentProfiles[index].user.name,
            email: validStudentProfiles[index].user.email,
            profileImage: validStudentProfiles[index].user.profileImage,
            department: validStudentProfiles[index].department,
            skills: validStudentProfiles[index].skills || [],
            studentInfo: validStudentProfiles[index].studentInfo || {},
            bio: validStudentProfiles[index].bio || ''
          },
          matchScore: sim.similarity
        }))
        .filter(match => match.matchScore > 0.2)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

      res.json(matches);
    } catch (error) {
      console.error("Error in matchStudentsWithJob:", error);
      res.status(500).json({ 
        msg: "Server Error", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  },

  matchJobsWithStudent: async (req, res) => {
    try {
      const { studentId } = req.params;

      // Find profile by user ID and populate user data
      const studentProfile = await Profile.findOne({ 
        user: studentId 
      }).populate('user', 'name email profileImage role');

      if (!studentProfile || !studentProfile.user) {
        return res.status(404).json({ msg: 'Student profile not found' });
      }

      const activeJobs = await Job.find({ status: 'open' })
        .populate('user', 'name email profileImage');

      // Prepare student context with complete profile information
      const studentContext = `
        Bio: ${studentProfile.bio || ''}
        Department: ${studentProfile.department || ''}
        Skills: ${studentProfile.skills?.join(', ') || ''}
        Student ID: ${studentProfile.studentInfo?.studentId || ''}
        Batch: ${studentProfile.studentInfo?.batch || ''}
        CGPA: ${studentProfile.studentInfo?.cgpa || ''}
      `.trim();

      const jobContexts = activeJobs.map(job => `
        Title: ${job.title}
        Description: ${job.description}
        Required Skills: ${job.requiredSkills.join(', ')}
        Job Type: ${job.type}
      `.trim());

      const similarities = await batchCalculateSimilarity(studentContext, jobContexts);

      const matches = similarities
        .map((sim, index) => ({
          job: {
            _id: activeJobs[index]._id,
            title: activeJobs[index].title,
            company: activeJobs[index].company,
            type: activeJobs[index].type,
            requiredSkills: activeJobs[index].requiredSkills,
            description: activeJobs[index].description,
            user: activeJobs[index].user
          },
          matchScore: sim.similarity
        }))
        .filter(match => match.matchScore > 0.6)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

      res.json(matches);
    } catch (err) {
      console.error('Error in matchJobsWithStudent:', err);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
};

module.exports = jobMatchingController;