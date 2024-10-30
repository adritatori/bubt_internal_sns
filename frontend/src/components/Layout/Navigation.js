import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">UniSocial</Link>
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-blue-200">Feed</Link>
            <Link to="/profile" className="text-white hover:text-blue-200">Profile</Link>
            <Link to="/create-post" className="text-white hover:text-blue-200">Create Post</Link>
            {user.role === 'student' && (
              <Link to="/achievements" className="text-white hover:text-blue-200">Achievements</Link>
            )}
            {user.role === 'teacher' && (
              <Link to="/announcements" className="text-white hover:text-blue-200">Announcements</Link>
            )}
            {user.role === 'alumni' && (
              <Link to="/job-posting" className="text-white hover:text-blue-200">Post Job</Link>
            )}
            <Link to="/notifications" className="text-white hover:text-blue-200">Notifications</Link>
            <Link to="/search" className="text-white hover:text-blue-200">Search Users</Link>
            <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-white hover:text-blue-200">Login</Link>
            <Link to="/register" className="text-white hover:text-blue-200">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
