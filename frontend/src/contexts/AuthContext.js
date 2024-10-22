import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., by checking localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to validate the token here
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('Logging in with data:', userData);
    setUser({
      token: userData.token,
      role: userData.role
    });
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
