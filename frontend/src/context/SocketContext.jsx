import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const SocketContext = createContext();

export const SocketProvider = ({ children, value: currentUser }) => {
  const navigate = useNavigate()
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [ready, setReady] = useState(false); // controls render timing

  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io('http://localhost:3000', {
      transports: ['websocket'],
      withCredentials: true,
      query: { userId: currentUser._id },
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      newSocket.emit('register-user', currentUser._id);
      setIsConnected(true);
      setReady(true);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket connect error:', err);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from socket');
      setIsConnected(false);
    });

    return () => {
  if (socketRef.current && currentUser) {
    socketRef.current.disconnect();
  }
};
  }, [currentUser]);

  const value = {
    socket: socketRef.current,
    isConnected,
  };

  // Redirect
  if (!currentUser) {
    navigate('/user/login')
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
