require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const jobRoutes = require('./routes/jobRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const feedRoutes = require('./routes/feedRoutes');
const notificationRoutes = require('./routes/notificationRoutes');


const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/feed', feedRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));