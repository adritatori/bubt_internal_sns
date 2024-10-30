import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div>
      <Navigation />
      <main className="container mx-auto mt-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
