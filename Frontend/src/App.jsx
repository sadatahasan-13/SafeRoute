import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import RoutePlanner from './pages/RoutePlanner';
import LiveTracking from './pages/LiveTracking';
import ReportIncident from './pages/ReportIncident';
import SafetyFeed from './pages/SafetyFeed';
import EmergencyContacts from './pages/EmergencyContacts';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/planner" element={<RoutePlanner />} />
        <Route path="/tracking" element={<LiveTracking />} />
        <Route path="/report" element={<ReportIncident />} />
        <Route path="/feed" element={<SafetyFeed />} />
        <Route path="/safety-feed" element={<SafetyFeed />} />
        <Route path="/contacts" element={<EmergencyContacts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}