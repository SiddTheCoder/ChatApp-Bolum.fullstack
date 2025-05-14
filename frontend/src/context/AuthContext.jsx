// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get('/api/v1/user/get-current-user', {
          withCredentials: true,
        });
        setCurrentUser(res.data.data);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
