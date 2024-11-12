import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import UserProfile from './components/Profile/UserProfile';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import CreatePost from './components/Posts/CreatePost';
import TeacherAnnouncements from './components/Teacher/TeacherAnnouncements';
import JobBoard from './components/Jobs/JobBoard';
import JobPosting from './components/JobPosting/JobPosting'
import Achievement from './components/Achievement/Achievement';
import Notification from './components/Notification/Notification';
import UserSearch from './components/UserSearch/UserSearch';
import PrivateRoute from './components/routing/PrivateRoute';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/profile/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route
              path="/edit-profile"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              }
            />
            <Route
              path="/announcements"
              element={
                <PrivateRoute>
                  <TeacherAnnouncements />
                </PrivateRoute>
              }
            />
      
<Route
  path="/jobs"
  element={
    <PrivateRoute>
      <JobBoard />
    </PrivateRoute>
  }
/>

<Route
  path="/jobs/post"
  element={
    <PrivateRoute>
      <JobPosting />
    </PrivateRoute>
  }
/>
            <Route
              path="/achievements"
              element={
                <PrivateRoute>
                  <Achievement />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notification />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <UserSearch />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
