import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default Dashboard;