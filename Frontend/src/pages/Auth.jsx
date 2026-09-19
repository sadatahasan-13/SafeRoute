import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Navigation, AlertTriangle, Users } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
    const payload = isSignUp
      ? {
          name,
          email: authMethod === 'email' ? email : undefined,
          phone: authMethod === 'phone' ? phone : undefined,
          password,
        }
      : {
          email: authMethod === 'email' ? email : undefined,
          phone: authMethod === 'phone' ? phone : undefined,
          password,
        };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      // Store authenticated session
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Mark that user just signed in so popup shows only once
      sessionStorage.setItem('show_welcome_popup', 'true');

      navigate('/dashboard');
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Cannot connect to backend server. Please make sure server.js is running on port 5000.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      
      {/* SPLIT SCREEN AUTH CONTAINER */}
      <div style={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap' }}>
        
        {/* LEFT SIDE: Branding, Visual Illustration & Feature Highlights */}
        <div style={{ flex: '1 1 500px', backgroundColor: '#f1f5f9', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #e2e8f0' }}>
          
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <ShieldCheck size={36} color="#00b4d8" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#00b4d8', letterSpacing: '-0.5px', lineHeight: 1 }}>SAFEROUTE</span>
              <span style={{ fontSize: '9px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>NIGHT COMMUTE SAFETY</span>
            </div>
          </div>

          {/* Central Feature Showcase Illustration Box */}
          <div style={{ margin: '40px 0', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '36px 24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', maxWidth: '420px', margin: '0 auto' }}>
              <div style={{ backgroundColor: 'rgba(0, 180, 216, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <Navigation size={32} color="#00b4d8" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Smart Nighttime Commute</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                Access crowd-sourced risk intelligence, safe lighting scores, and emergency contact dispatching.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#00b4d8', fontWeight: '700' }}>
                  <AlertTriangle size={14} /> Hazard Reports
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#00b4d8', fontWeight: '700' }}>
                  <Users size={14} /> Live Guardians
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            &copy; {new Date().getFullYear()} SafeRoute Night Navigation. All rights reserved.
          </p>
        </div>

        {/* RIGHT SIDE: Authentication Form Panel */}
        <div style={{ flex: '1 1 500px', backgroundColor: '#ffffff', padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                Welcome to SafeRoute !!
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                An intelligent night commute and safety dispatch platform
              </p>
            </div>

            {/* Email / Phone Method Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '28px' }}>
              <button
                onClick={() => setAuthMethod('email')}
                style={{
                  paddingBottom: '10px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  fontSize: '14px',
                  fontWeight: authMethod === 'email' ? '700' : '500',
                  color: authMethod === 'email' ? '#00b4d8' : '#94a3b8',
                  borderBottom: authMethod === 'email' ? '2px solid #00b4d8' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Email
              </button>
              <button
                onClick={() => setAuthMethod('phone')}
                style={{
                  paddingBottom: '10px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  fontSize: '14px',
                  fontWeight: authMethod === 'phone' ? '700' : '500',
                  color: authMethod === 'phone' ? '#00b4d8' : '#94a3b8',
                  borderBottom: authMethod === 'phone' ? '2px solid #00b4d8' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Phone
              </button>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Error Alert */}
              {error && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', color: '#b91c1c', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name field when registering */}
              {isSignUp && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tanvir Ahmed"
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      backgroundColor: '#ffffff', 
                      color: '#0f172a', 
                      border: '1.5px solid #cbd5e1', 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      outline: 'none', 
                      boxSizing: 'border-box' 
                    }}
                  />
                </div>
              )}

              {authMethod === 'email' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@saferoute.com"
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      backgroundColor: '#ffffff', 
                      color: '#0f172a', 
                      border: '1.5px solid #cbd5e1', 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      outline: 'none', 
                      boxSizing: 'border-box' 
                    }}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      backgroundColor: '#ffffff', 
                      color: '#0f172a', 
                      border: '1.5px solid #cbd5e1', 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      outline: 'none', 
                      boxSizing: 'border-box' 
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    style={{ 
                      width: '100%', 
                      padding: '12px 40px 12px 14px', 
                      backgroundColor: '#ffffff', 
                      color: '#0f172a', 
                      border: '1.5px solid #cbd5e1', 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      outline: 'none', 
                      boxSizing: 'border-box' 
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Keep Signed In & Forgot Password */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#00b4d8' }} /> Keep me signed in
                </label>
                <a href="#forgot" style={{ color: '#00b4d8', textDecoration: 'none', fontWeight: '600' }}>
                  Forgot password?
                </a>
              </div>

              {/* Sign Up Switcher */}
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {isSignUp ? 'Already have an account? ' : 'First time here? '}
                <span 
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
                  style={{ color: '#00b4d8', textDecoration: 'underline', fontWeight: '700', cursor: 'pointer' }}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </span> instead.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{ 
                  backgroundColor: loading ? '#94a3b8' : '#00b4d8', 
                  color: '#ffffff', 
                  border: 'none', 
                  padding: '14px', 
                  borderRadius: '8px', 
                  fontWeight: '800', 
                  fontSize: '14px', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  marginTop: '10px',
                  boxShadow: '0 4px 14px rgba(0, 180, 216, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Sign up' : 'Sign in')}
              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}