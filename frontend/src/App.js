import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile/Profile';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
