import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RoutePlanner from './pages/RoutePlanner';
import ReportIncident from './pages/ReportIncident';
import SafetyFeed from './pages/SafetyFeed';
import EmergencyContacts from './pages/EmergencyContacts';

export default function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/planner" element={<RoutePlanner />} />
        <Route path="/report" element={<ReportIncident />} />
        <Route path="/feed" element={<SafetyFeed />} />
        <Route path="/safety-feed" element={<SafetyFeed />} />
        <Route path="/contacts" element={<EmergencyContacts />} />
      </Routes>
    </Router>
  );
}