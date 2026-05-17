import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BookSession from './pages/BookSession';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import AdminCourses from './pages/AdminCourses';
import AdminBookingData from './pages/AdminBookingData';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Logout from './pages/Logout';

import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/book/:id" element={<BookSession />} />
        <Route path="/bookings" element={<BookingHistory />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/bookings" element={<AdminBookingData />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
    </AppProvider>
  );
}
