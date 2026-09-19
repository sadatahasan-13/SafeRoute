import React, { useState } from 'react';
import { 
  Bell, Mail, Calendar, User, Search, Settings, 
  LayoutDashboard, FileText, BarChart2, MessageSquare, 
  MapPin, Link2, HelpCircle, ChevronRight, LogOut 
} from 'lucide-react';

export default function MetronicProfileSettings() {
  const [activeTab, setActiveTab] = useState('personal');
  const [activeMenu, setActiveMenu] = useState('account');

  // Form State initialized with values matching the Metronic template
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    mobileNumber: '+1 646 580 DEMO (6284)',
    interests: 'Design, Web etc.',
    occupation: 'Web Developer',
    about: 'We are KeenThemes!!!',
    websiteUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#eef2f5', fontFamily: '"Open Sans", sans-serif, system-ui', color: '#595d6e' }}>
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside style={{ width: '220px', backgroundColor: '#2c3542', color: '#8896a5', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        
        {/* Brand Header */}
        <div style={{ height: '54px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#212833' }}>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#e74c3c', letterSpacing: '1px' }}>
            METRONIC
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', cursor: 'pointer' }}>
            <span style={{ width: '16px', height: '2px', backgroundColor: '#8896a5' }}></span>
            <span style={{ width: '16px', height: '2px', backgroundColor: '#8896a5' }}></span>
            <span style={{ width: '16px', height: '2px', backgroundColor: '#8896a5' }}></span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav style={{ padding: '10px 0', flexGrow: 1 }}>
          {[
            { label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
            { label: 'Menu Location', icon: <MapPin size={15} /> },
            { label: 'Menu Link', icon: <Link2 size={15} /> },
            { label: 'Posts', icon: <FileText size={15} /> },
            { label: 'Settings', icon: <Settings size={15} /> },
            { label: 'Messages', icon: <MessageSquare size={15} /> },
            { label: 'Analytics', icon: <BarChart2 size={15} /> },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                fontSize: '13px',
                color: '#8896a5',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#242c37')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header Navigation Bar */}
        <header style={{ height: '54px', backgroundColor: '#2c3542', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 24px', gap: '16px' }}>
          
          {/* Notification Badges */}
          <div style={{ position: 'relative', cursor: 'pointer', color: '#8896a5' }}>
            <Bell size={16} />
            <span style={{ position: 'absolute', top: '-6px', right: '-8px', backgroundColor: '#17a2b8', color: '#ffffff', fontSize: '10px', fontWeight: 'bold', borderRadius: '10px', padding: '1px 5px' }}>7</span>
          </div>
          
          <div style={{ position: 'relative', cursor: 'pointer', color: '#8896a5', marginLeft: '6px' }}>
            <Mail size={16} />
            <span style={{ position: 'absolute', top: '-6px', right: '-8px', backgroundColor: '#17a2b8', color: '#ffffff', fontSize: '10px', fontWeight: 'bold', borderRadius: '10px', padding: '1px 5px' }}>4</span>
          </div>

          <div style={{ position: 'relative', cursor: 'pointer', color: '#8896a5', marginLeft: '6px' }}>
            <Calendar size={16} />
            <span style={{ position: 'absolute', top: '-6px', right: '-8px', backgroundColor: '#17a2b8', color: '#ffffff', fontSize: '10px', fontWeight: 'bold', borderRadius: '10px', padding: '1px 5px' }}>3</span>
          </div>

          {/* User Profile dropdown target */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', cursor: 'pointer' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#6f42c1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
              C
            </div>
            <span style={{ color: '#8896a5', fontSize: '13px' }}>NewName</span>
            <span style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #8896a5', marginLeft: '2px' }}></span>
          </div>

          <div style={{ color: '#8896a5', marginLeft: '12px', cursor: 'pointer' }}>
            <LogOut size={16} />
          </div>
        </header>

        {/* Dashboard Main Grid Area */}
        <main style={{ padding: '24px', flexGrow: 1, display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>
          
          {/* LEFT SIDE: User Profile Summary Card */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e1e5ec', borderRadius: '2px', padding: '24px 0' }}>
            
            {/* Avatar & Title */}
            <div style={{ textAlign: 'center', padding: '0 20px 20px 20px' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px auto' }}>
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" 
                  alt="Marcus Doe" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600', color: '#575f6d' }}>Marcus Doe</h2>
              <p style={{ margin: '0 0 16px 0', fontSize: '12px', fontWeight: '700', color: '#32c5d2', letterSpacing: '0.5px' }}>DEVELOPER</p>
              
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button style={{ backgroundColor: '#32c5d2', color: '#ffffff', border: 'none', padding: '6px 18px', borderRadius: '15px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                  FOLLOW
                </button>
                <button style={{ backgroundColor: '#e7505a', color: '#ffffff', border: 'none', padding: '6px 18px', borderRadius: '15px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                  MESSAGE
                </button>
              </div>
            </div>

            {/* Profile Section Navigation */}
            <div style={{ borderTop: '1px solid #f0f4f8' }}>
              {[
                { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
                { id: 'account', label: 'Account Settings', icon: <Settings size={15} /> },
                { id: 'help', label: 'Help', icon: <HelpCircle size={15} /> },
              ].map((item) => {
                const isActive = activeMenu === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 24px',
                      fontSize: '13px',
                      color: isActive ? '#32c5d2' : '#8896a5',
                      backgroundColor: isActive ? '#f4f6f9' : 'transparent',
                      borderLeft: isActive ? '3px solid #32c5d2' : '3px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT SIDE: Settings Form Panel */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e1e5ec', borderRadius: '2px', padding: '24px 32px' }}>
            
            {/* Form Section Header */}
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '700', color: '#32c5d2', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PROFILE ACCOUNT
            </h3>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e1e5ec', marginBottom: '24px' }}>
              {[
                { id: 'personal', label: 'Personal Info' },
                { id: 'avatar', label: 'Change Avatar' },
                { id: 'password', label: 'Change Password' },
                { id: 'privacy', label: 'Privacy Settings' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <div
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      paddingBottom: '10px',
                      fontSize: '13px',
                      fontWeight: isActive ? '600' : '400',
                      color: isActive ? '#32c5d2' : '#666',
                      borderBottom: isActive ? '2px solid #32c5d2' : '2px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </div>
                );
              })}
            </div>

            {/* Form Inputs (Personal Info Tab) */}
            {activeTab === 'personal' && (
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #c2cad8', borderRadius: '2px', fontSize: '13px', color: '#555', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #c2cad8', borderRadius: '2px', fontSize: '13px', color: '#555', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>Mobile Number</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #c2cad8', borderRadius: '2px', fontSize: '13px', color: '#555', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>Interests</label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #c2cad8', borderRadius: '2px', fontSize: '13px', color: '#555', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #c2cad8', borderRadius: '2px', fontSize: '13px', color: '#555', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>About</label>
                  <textarea
                    name="about"
                    rows={3}
                    value={formData.about}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #c2cad8', borderRadius: '2px', fontSize: '13px', color: '#555', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>Website Url</label>
                  <input
                    type="text"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #c2cad8', borderRadius: '2px', fontSize: '13px', color: '#555', outline: 'none' }}
                  />
                </div>

              </form>
            )}

          </div>

        </main>
      </div>

    </div>
  );
}