
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import NavBar from './NavBar';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
