const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');

const authController = {
  
    register: async (req, res) => {
      try {
        console.log('Received form data:', req.body);
        console.log('Request file:', req.file);
  
        // Parse JSON data from request body
        const { name, email, password, role } = req.body;
        let studentInfo, teacherInfo, alumniInfo;
  
        try {
          if (req.body.studentInfo) studentInfo = JSON.parse(req.body.studentInfo);
          if (req.body.teacherInfo) teacherInfo = JSON.parse(req.body.teacherInfo);
          if (req.body.alumniInfo) alumniInfo = JSON.parse(req.body.alumniInfo);
        } catch (error) {
          console.error('Error parsing role info:', error);
          return res.status(400).json({ msg: 'Invalid role information format' });
        }
  
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ msg: 'User already exists' });
        }
  
        // Role-specific validation
        if (role === 'student' && studentInfo) {
          user = await User.findOne({ 'studentInfo.studentId': studentInfo.studentId });
          if (user) {
            return res.status(400).json({ msg: 'Student ID already exists' });
          }
        } else if (role === 'teacher' && teacherInfo) {
          user = await User.findOne({ 'teacherInfo.teacherCode': teacherInfo.teacherCode });
          if (user) {
            return res.status(400).json({ msg: 'Teacher Code already exists' });
          }
        } else if (role === 'alumni' && alumniInfo) {
          user = await User.findOne({ 'alumniInfo.id': alumniInfo.id });
          if (user) {
            return res.status(400).json({ msg: 'Alumni ID already exists' });
          }
        }
  
        // Handle profile image
        let profileImagePath = 'default.jpg'; // Default image
        if (req.file) {
          profileImagePath = req.file.filename;
          console.log('Profile image saved as:', profileImagePath);
        }
  
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        // Create new user
        user = new User({
          name,
          email,
          password: hashedPassword,
          role,
          profileImage: profileImagePath,
          ...(role === 'student' && { studentInfo }),
          ...(role === 'teacher' && { teacherInfo }),
          ...(role === 'alumni' && { alumniInfo })
        });
  
        // Save user first
        await user.save();
  
        // Create corresponding profile
        const profileData = {
          user: user._id,
          profileImage: profileImagePath,
          department: role === 'student' ? studentInfo?.department :
                     role === 'teacher' ? teacherInfo?.department :
                     role === 'alumni' ? alumniInfo?.department : '',
          ...(role === 'student' && {
            studentInfo: {
              studentId: studentInfo?.studentId || '',
              batch: studentInfo?.intake || '',
              cgpa: 0
            }
          }),
          ...(role === 'teacher' && {
            teacherInfo: {
              designation: teacherInfo?.designation || '',
              courses: [],
              researchInterests: [],
              officeHours: ''
            }
          }),
          ...(role === 'alumni' && {
            alumniInfo: {
              graduationYear: alumniInfo?.passingYear || null,
              currentCompany: '',
              jobTitle: ''
            }
          })
        };
  
        const profile = new Profile(profileData);
        await profile.save();
  
        // Generate JWT token
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({ 
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: profileImagePath
              }
            });
          }
        );
  
      } catch (err) {
        console.error('Registration error:', err);
        // If there was an error, attempt to clean up any partially created data
        if (err.user) {
          await User.findByIdAndRemove(err.user._id);
        }
        res.status(500).json({
          error: 'Server Error',
          message: process.env.NODE_ENV === 'development' ? err.message : 'Registration failed'
        });
      }
    },

  // Login user
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: user.id
        }
};

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  // Verify token and get user
  verifyToken: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) { // Check if user is null
        return res.status(401).json({ msg: 'Unauthorized' });
      }
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
};

module.exports = authController;
