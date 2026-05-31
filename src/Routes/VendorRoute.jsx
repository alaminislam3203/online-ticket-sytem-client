import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Navigate } from 'react-router';

const VendorRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // token থেকে role বের করো
  const token = localStorage.getItem('token');
  let role = user.role;

  if (!role && token) {
    try {
      role = JSON.parse(atob(token.split('.')[1])).role;
    } catch {
      role = null;
    }
  }

  if (role !== 'vendor') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default VendorRoute;
