import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, PhoneCall, Eye, EyeOff, Navigation, AlertTriangle, Users } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP UTILITY BANNER */}
      <div style={{ backgroundColor: '#00b4d8', padding: '8px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#ffffff', fontWeight: '500' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} /> Dhaka, Bangladesh
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneCall size={14} /> Helpline: 999
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>support@saferoute.com</span>
          <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold' }}>
            Back to Home
          </Link>
        </div>
      </div>

      {/* 2. SPLIT SCREEN AUTH CONTAINER */}
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
            <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {authMethod === 'email' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@saferoute.com"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }}
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
                    placeholder="+880 1700-000000"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }}
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
                    placeholder="••••••••••••"
                    style={{ width: '100%', padding: '12px 40px 12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }}
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
                  onClick={() => setIsSignUp(!isSignUp)} 
                  style={{ color: '#00b4d8', textDecoration: 'underline', fontWeight: '700', cursor: 'pointer' }}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </span> instead.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{ backgroundColor: '#00b4d8', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', marginTop: '10px' }}
              >
                {isSignUp ? 'Create Account' : 'Sign in'}
              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}