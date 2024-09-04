import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/university-logo.png" alt="University Logo" className="h-10 w-auto mr-4" />
            <h1 className="text-2xl font-bold text-gray-900">University SNS</h1>
          </div>
          {user && (
            <nav className="flex items-center">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
              <button onClick={handleLogout} className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500">
          © 2024 University SNS. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;