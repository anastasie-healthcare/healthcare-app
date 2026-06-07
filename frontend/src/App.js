import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/register';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;