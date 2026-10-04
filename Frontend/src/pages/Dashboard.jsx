import React from 'react';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    user = {};
  }
  const isAdmin = user.role === 'admin' || user.email === 'admin@saferoute.bd';

  if (isAdmin) {
    return <AdminDashboard />;
  }
  return <UserDashboard />;
}