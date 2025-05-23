import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatApp from './components/ChatApp';
import Login from './pages/Login';
import Register from './pages/Register';
import Lander from './pages/Lander';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './private/PrivateRoute';
import RandomPageError from './pages/RandomPageError'
import SettingLayout from './pages/SettingLayout';
import ProfileSettings from './pages/setting-pages/ProfileSettings';
import AccountSettings from './pages/setting-pages/AccountSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lander />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} >
            <Route path="chat/:friendId" element={<ChatApp />} />
            </Route>
        </Route>
        <Route path="/:username" element={<UserProfile />} />
        <Route path="/settings" element={<SettingLayout />}>
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="account" element={<AccountSettings />} />
      </Route>
        <Route path="*" element={<RandomPageError />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
