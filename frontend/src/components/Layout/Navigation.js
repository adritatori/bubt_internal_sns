// components/Navigation/Navigation.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  // Helper function to determine if link is active
  const isActive = (path) => location.pathname === path;

  // Navigation items based on user role
  const getNavLinks = () => {
    const commonLinks = [
      { to: "/", label: "Dashboard" },
      { to: "/profile", label: "Profile" },
      { to: "/notifications", label: "Notifications" },
      { to: "/search", label: "Search Users" }
    ];

    const roleSpecificLinks = {
      student: [
        { to: "/jobs", label: "View Jobs" },
        { to: "/achievements", label: "Achievements" }
      ],
      teacher: [
        { to: "/announcements", label: "Announcements" },
        { to: "/jobs", label: "View Jobs" },
        { to: "/jobs/post", label: "Post Job" },
        { to: "/job-matches", label: "View Matches" }
      ],
      alumni: [
        { to: "/jobs", label: "Manage Jobs" },
        { to: "/jobs/post", label: "Post Job" },
        { to: "/job-matches", label: "View Matches" }
      ]
    };

    return [
      ...commonLinks,
      ...(roleSpecificLinks[user?.role] || [])
    ];
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Career Hub
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center space-x-4">
            {getNavLinks().map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.to)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={logout}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/login')
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/register')
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;