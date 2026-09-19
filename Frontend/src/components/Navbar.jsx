import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  LayoutDashboard, 
  Route, 
  Rss, 
  Phone, 
  LogOut,
  LogIn
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Route Planner', path: '/planner', icon: Route },
    { name: 'Community Feed', path: '/feed', icon: Rss },
    { name: 'Emergency', path: '/contacts', icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('show_welcome_popup');
      navigate('/auth');
    }
  };

  return (
    <header style={{ width: '100%', fontFamily: 'system-ui, -apple-system, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000 }}>

      
      {/* 1. TOP UTILITY BANNER (Cyan #00b4d8) */}
      <div style={{ backgroundColor: '#00b4d8', padding: '6px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#ffffff', fontWeight: '600' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={13} /> Dhaka Traffic & Security Control
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <PhoneCall size={13} /> National Helpline: 999 | BD Police Command
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>support@saferoute.bd</span>
          <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>Back to Home</Link>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ backgroundColor: '#e0f2fe', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={26} color="#00b4d8" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '19px', fontWeight: '900', color: '#00b4d8', letterSpacing: '-0.5px', lineHeight: 1 }}>SAFEROUTE</span>
            <span style={{ fontSize: '8px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '3px' }}>NIGHT COMMUTE SAFETY</span>
          </div>
        </div>

        {/* Clean Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: active ? '800' : '600',
                  color: active ? '#00b4d8' : '#64748b',
                  backgroundColor: active ? '#f0f9ff' : 'transparent',
                  textDecoration: 'none',
                  borderBottom: active ? '2px solid #00b4d8' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} color={active ? '#00b4d8' : '#64748b'} />
                {link.name}
              </Link>
            );
          })}

          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 8px' }} />

          {/* Auth Action: Sign out if logged in, Sign in if logged out */}
          {token ? (
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                color: '#00b4d8',
                padding: '8px 14px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={14} color="#00b4d8" /> Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              style={{
                backgroundColor: '#00b4d8',
                border: 'none',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '12px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,180,216,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <LogIn size={14} color="#ffffff" /> Sign in
            </Link>
          )}
        </div>

      </div>

    </header>
  );
}