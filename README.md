# BUBT Internal Social Network System (University SNS)

A full-stack social networking platform designed specifically for Bangladesh University of Business and Technology (BUBT) community. This platform connects students, teachers, and alumni with features for academic collaboration, AI-powered job matching, announcements, and professional networking.

## Features

### Core Social Features
- **User Authentication** - JWT-based secure login/registration with role-based access (Student, Teacher, Alumni)
- **Social Feed** - Personalized feed based on followed users
- **Posts & Interactions** - Create posts with attachments, like, and comment
- **User Profiles** - Comprehensive profiles with role-specific information
- **Follow System** - Follow/unfollow users for networking
- **User Search** - Discover and connect with other users

### Role-Specific Features

#### Students
- Track CGPA and academic information
- Browse and apply for job opportunities
- AI-powered job matching based on skills
- Receive targeted announcements
- Showcase achievements

#### Teachers
- Create and manage targeted announcements
- Target announcements by department, intake, section, or specific students
- Track announcement read status
- Share academic content

#### Alumni
- Post job opportunities
- Connect with current students
- Share professional experiences
- Mentor and network

### AI-Powered Job Matching
- **BERT-based semantic similarity** using Sentence Transformers
- Intelligent matching of student profiles with job requirements
- Skill-weighted scoring system (3x weight for skills, 2x for experience)
- Multiple similarity metrics (cosine similarity, Euclidean distance, hybrid)
- Confidence levels (high/medium/low) for matches

### Additional Features
- **Real-time Notifications** - Socket.io powered notifications for follows, likes, comments, announcements, and jobs
- **Achievements System** - Track academic, extracurricular, and professional achievements
- **File Management** - Profile images, post attachments, and announcement images
- **Security** - Rate limiting, Helmet.js, CORS, password hashing

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Security:** Helmet, CORS, bcryptjs, express-rate-limit

### Machine Learning Service
- **Language:** Python 3
- **Framework:** Flask
- **NLP Model:** Sentence Transformers (paraphrase-MiniLM-L6-v2)
- **Libraries:** NumPy, PyTorch

### Frontend
- **Framework:** React 18
- **UI Library:** Material-UI (MUI)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Real-time:** Socket.io-client
- **Icons:** Lucide React

## Project Structure

```
bubt_internal_sns/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   ├── controllers/                 # Business logic layer
│   │   ├── authController.js        # Authentication logic
│   │   ├── userController.js        # User management
│   │   ├── postController.js        # Post CRUD operations
│   │   ├── profileController.js     # Profile management
│   │   ├── announcementController.js# Teacher announcements
│   │   ├── jobController.js         # Job posting management
│   │   ├── jobMatchingController.js # AI job matching
│   │   ├── achievementController.js # Achievement tracking
│   │   ├── notificationController.js# Notification system
│   │   └── feedController.js        # User feed logic
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js                  # User schema with roles
│   │   ├── Post.js                  # Posts with comments/likes
│   │   ├── Profile.js               # Extended user profiles
│   │   ├── Job.js                   # Job postings
│   │   ├── Announcement.js          # Teacher announcements
│   │   ├── Achievement.js           # User achievements
│   │   └── Notifications.js         # Notification schema
│   ├── routes/                      # API route definitions
│   ├── middleware/                  # Express middleware
│   │   ├── auth.js                  # JWT verification
│   │   ├── upload.js                # Multer configuration
│   │   └── profile.js               # Profile middleware
│   ├── services/
│   │   ├── bert_service.py          # Python ML service
│   │   └── requirements.txt         # Python dependencies
│   ├── uploads/                     # File storage
│   ├── server.js                    # Main Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/                # Login, Register
│   │   │   ├── Dashboard/           # Main dashboard
│   │   │   ├── Profile/             # User profiles
│   │   │   ├── Posts/               # Post management
│   │   │   ├── Feed/                # User feed
│   │   │   ├── Jobs/                # Job board
│   │   │   ├── JobPosting/          # Create job posts
│   │   │   ├── Teacher/             # Announcement management
│   │   │   ├── Achievement/         # Achievements display
│   │   │   ├── Notifications/       # Notification center
│   │   │   ├── UserSearch/          # User discovery
│   │   │   └── Layout/              # Navigation & layout
│   │   ├── contexts/                # React contexts
│   │   │   ├── AuthContext.js       # Auth state management
│   │   │   └── NotificationContext.js
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # Entry point
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **Python 3.8+** with pip
- **npm** or **yarn**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bubt_internal_sns.git
cd bubt_internal_sns
```

### 2. Backend Setup

```bash
cd backend

# Install Node.js dependencies
npm install

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install Python dependencies
cd services
pip install -r requirements.txt
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/university_sns
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

### 5. Database Setup

Ensure MongoDB is running on your system:

```bash
# On Windows (if installed as service)
net start MongoDB

# On Linux
sudo systemctl start mongod

# On Mac (with Homebrew)
brew services start mongodb-community
```

## Running the Application

### Start Backend (Express + Python ML Service)

```bash
cd backend
npm start
```

This command uses `concurrently` to start both:
- Express.js server on port 5000
- Python BERT service on port 5001

**Or start services separately:**

```bash
# Start Node.js server only
npm run start-node

# Start Python ML service only
npm run start-python
```

### Start Frontend

```bash
cd frontend
npm start
```

The React application will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/comment` - Comment on post
- `DELETE /api/posts/:id` - Delete post

### Jobs
- `POST /api/jobs` - Create job posting
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:jobId/apply` - Apply for job
- `GET /api/job-matching/:jobId/matches` - Get AI-matched students

### Announcements
- `POST /api/announcements` - Create announcement (Teachers)
- `GET /api/announcements` - Get relevant announcements
- `GET /api/announcements/teacher` - Get teacher's announcements
- `DELETE /api/announcements/:id` - Delete announcement

### Profile
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile` - Update profile

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/read` - Mark as read

## Usage

### Registration
1. Navigate to `/register`
2. Select your role (Student/Teacher/Alumni)
3. Fill in role-specific information
4. Upload profile picture (optional)
5. Submit registration

### For Students
- **Feed**: View posts from followed users on dashboard
- **Jobs**: Browse job opportunities in the Jobs section
- **Job Matching**: Use AI-powered matching to find relevant jobs
- **Profile**: Update skills, CGPA, and bio to improve job matches
- **Announcements**: Receive targeted announcements from teachers

### For Teachers
- **Announcements**: Create targeted announcements for specific groups
- **Posts**: Share academic content and resources
- **Profile**: Display courses, office hours, and research interests

### For Alumni
- **Job Posting**: Post job opportunities for students
- **Networking**: Connect with current students and other alumni
- **Mentorship**: Share professional experiences and guidance

## Database Models

### User
- Basic info (name, email, password)
- Role-specific data (student ID, teacher code, etc.)
- Followers/Following relationships
- Notifications array

### Post
- Content with attachments
- Post types (regular, academic, job, announcement)
- Likes and comments
- Timestamps

### Job
- Job details (title, company, location, description)
- Requirements and required skills
- Salary information
- Application deadline
- Status (open/closed/draft)

### Announcement
- Title and content
- Target audience configuration
- Read tracking
- Image support

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Helmet.js** - HTTP header security
- **CORS** - Cross-Origin Resource Sharing configuration
- **File Validation** - Image type and size restrictions (5MB limit)
- **Input Validation** - Server-side validation for all inputs

## Screenshots

*Add screenshots of your application here*

- Login Page
- Dashboard/Feed
- User Profile
- Job Board
- Job Matching Results
- Announcement Creation
- Notifications Panel

## Future Enhancements

- Real-time chat functionality
- Mobile application (React Native)
- Advanced analytics dashboard
- Resume builder integration
- Video conferencing for interviews
- Alumni mentorship program management
- Event management system
- Group discussions and forums

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Authors

**Final Year Project**
Bangladesh University of Business and Technology (BUBT)

---

## Acknowledgments

- BUBT Faculty and Staff
- Open source community
- Hugging Face for Sentence Transformers
- Material-UI and Tailwind CSS teams

---

**Note:** This project was developed as a Final Year Software Project to demonstrate full-stack development skills, AI/ML integration, and modern web application architecture.
