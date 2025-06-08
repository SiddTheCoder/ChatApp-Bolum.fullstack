import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { SocketProvider } from '../context/SocketContext';
import LoaderModal from '../components/LoaderModal';

const PrivateRoute = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('https://chatapp-bolum-backend.onrender.com/api/v1/user/get-current-user', {
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
    return <LoaderModal />;
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
