// backend/controllers/jobMatchingController.js
const Job = require('../models/Job');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { batchCalculateSimilarity } = require('../utils/modelUtils');

const matchStudentsWithJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId)
      .populate('user', 'name email profileImage');

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Get all students with their profiles
    const students = await User.find({ role: 'student' })
      .populate({
        path: 'profile',
        select: 'skills bio achievements studentInfo'
      });

    // Prepare job context
    const jobContext = `
      ${job.title}
      ${job.description}
      ${job.requiredSkills.join(' ')}
      ${job.type}
    `;

    // Prepare student profiles for matching
    const studentProfiles = students.map(student => `
      ${student.profile?.skills?.join(' ') || ''}
      ${student.profile?.bio || ''}
      ${student.profile?.achievements?.join(' ') || ''}
      ${student.studentInfo?.department || ''}
    `);

    // Get similarity scores
    const similarities = await batchCalculateSimilarity(jobContext, studentProfiles);

    // Prepare matches
    const matches = similarities
      .map((sim, index) => ({
        student: {
          _id: students[index]._id,
          name: students[index].name,
          email: students[index].email,
          profileImage: students[index].profileImage,
          department: students[index].studentInfo?.department,
          skills: students[index].profile?.skills || [],
          achievements: students[index].profile?.achievements || []
        },
        matchScore: sim.similarity
      }))
      .filter(match => match.matchScore > 0.6)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    res.json(matches);
  } catch (err) {
    console.error('Error in matchStudentsWithJob:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

const matchJobsWithStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Get student details
    const student = await User.findById(studentId)
      .populate({
        path: 'profile',
        select: 'skills bio achievements studentInfo'
      });

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Get all active jobs
    const activeJobs = await Job.find({ status: 'open' })
      .populate('user', 'name email profileImage');

    // Prepare student profile for matching
    const studentContext = `
      ${student.profile?.skills?.join(' ') || ''}
      ${student.profile?.bio || ''}
      ${student.profile?.achievements?.join(' ') || ''}
      ${student.studentInfo?.department || ''}
    `;

    // Prepare job descriptions for matching
    const jobContexts = activeJobs.map(job => `
      ${job.title}
      ${job.description}
      ${job.requiredSkills.join(' ')}
      ${job.type}
    `);

    // Get similarity scores
    const similarities = await batchCalculateSimilarity(studentContext, jobContexts);

    // Prepare matches
    const matches = similarities
      .map((sim, index) => ({
        job: {
          _id: activeJobs[index]._id,
          title: activeJobs[index].title,
          company: activeJobs[index].company,
          type: activeJobs[index].type,
          requiredSkills: activeJobs[index].requiredSkills,
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
};

module.exports = {
  matchStudentsWithJob,
  matchJobsWithStudent
};