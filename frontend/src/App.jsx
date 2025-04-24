import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatApp from './components/ChatApp';
import Login from './pages/Login';
import Register from './pages/Register';
import Lander from './pages/Lander';
import Home from './pages/Home';
import PrivateRoute from './private/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lander />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
