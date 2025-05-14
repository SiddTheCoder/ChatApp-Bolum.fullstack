import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { SocketProvider } from '../context/SocketContext';

const PrivateRoute = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/v1/user/get-current-user', {
          withCredentials: true,
        });
        setCurrentUser(response.data.data);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <SocketProvider value={currentUser}>
      <Outlet />
    </SocketProvider>
  );
};

export default PrivateRoute;
