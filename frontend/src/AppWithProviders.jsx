// AppWithProviders.jsx
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import App from './App';

const AppWithSocket = () => {
  const { currentUser } = useAuth();

  // Render socket only when user is logged in
  return currentUser ? (
    <SocketProvider value={currentUser}>
      <App />
    </SocketProvider>
  ) : (
    <App />
  );
};

const AppWithProviders = () => (
  <AuthProvider>
    <AppWithSocket />
  </AuthProvider>
);

export default AppWithProviders;
