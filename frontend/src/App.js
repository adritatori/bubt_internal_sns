import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Main Components
import Dashboard from './components/Dashboard/Dashboard';
import Layout from './components/Layout/Layout';

// Profile Components
import UserProfile from './components/Profile/UserProfile';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';

// Post Components
import CreatePost from './components/Posts/CreatePost';

// Job Components
import JobBoard from './components/Jobs/JobBoard';
import JobPosting from './components/JobPosting/JobPosting';
import JobMatchesPage from './components/Jobs/JobMatches'

// Role-specific Components
import TeacherAnnouncements from './components/Teacher/TeacherAnnouncements';
import Achievement from './components/Achievement/Achievement';

// Utility Components
import Notification from './components/Notification/Notification';
import UserSearch from './components/UserSearch/UserSearch';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private Routes - General */}
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              
              {/* Profile Routes */}
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/profile/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
              <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
              
              {/* Post Routes */}
              <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
              
              {/* Job Routes */}
              <Route path="/jobs" element={<PrivateRoute><JobBoard /></PrivateRoute>} />
<Route path="/jobs/post" element={<PrivateRoute><JobPosting /></PrivateRoute>} />
<Route path="/job-matches" element={<PrivateRoute><JobMatchesPage /></PrivateRoute>} />
              
              {/* Role-specific Routes */}
              <Route path="/announcements" element={
                <PrivateRoute>
                  <TeacherAnnouncements />
                </PrivateRoute>
              } />
              <Route path="/achievements" element={
                <PrivateRoute>
                  <Achievement />
                </PrivateRoute>
              } />
              
              {/* Utility Routes */}
              <Route path="/notifications" element={<PrivateRoute><Notification /></PrivateRoute>} />
              <Route path="/search" element={<PrivateRoute><UserSearch /></PrivateRoute>} />
            </Routes>
          </Layout>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;