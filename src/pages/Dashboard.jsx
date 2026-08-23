import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, MapPin, Navigation, PhoneCall, LogOut, 
  RefreshCw, Calendar, Search, Maximize2, AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCommuter, setSelectedCommuter] = useState(4); // Default selected: Tanvir Ahmed
  const [mapType, setMapType] = useState('map');

  const commuters = [
    { id: 0, name: 'Anika Rahman', score: '98% Safe', distance: '1.2 km', time: '15 min', status: 'In Transit', color: '#10b981' },
    { id: 1, name: 'Samiul Karim', score: '82% Safe', distance: '3.4 km', time: '28 min', status: 'Caution Zone', color: '#f59e0b' },
    { id: 2, name: 'Nusrat Jahan', score: '95% Safe', distance: '0.8 km', time: '10 min', status: 'In Transit', color: '#3b82f6' },
    { id: 3, name: 'Arafat Hossain', score: '70% Safe', distance: '5.1 km', time: '42 min', status: 'Unlit Alley Alert', color: '#f43f5e' },
    { id: 4, name: 'Tanvir Ahmed', score: '92% Safe', distance: '2.5 km', time: '20 min', status: 'Active Escort', color: '#00b4d8' },
  ];

  const waypoints = [
    { step: 1, title: 'Gulshan 2 Circle', address: 'Road 103, Block CEN - Security Checkpoint', time: '9:42 am (1m)', active: true },
    { step: 2, title: 'Dhanmondi 32 Bridge', address: 'Mirpur Road - Metro Rail Gate 2 Plaza', time: 'est 10:03am', active: false },
    { step: 3, title: 'Uttara Sector 7 Hub', address: 'Rabindra Sarani - West Gate Terminal', time: 'est 10:28am', active: false },
    { step: 4, title: 'Shahbagh Crossing', address: 'Kazi Nazrul Islam Ave - Police Box Gate 3', time: 'est 10:57am', active: false },
    { step: 5, title: 'Mirpur 10 Circle', address: 'Begum Rokeya Sarani - Night Patrol Hub', time: 'est 11:23am', tag: 'High Lighting', active: false },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP HEADER BANNER (Cyan #00b4d8) */}
      <header style={{ backgroundColor: '#00b4d8', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <ShieldCheck size={22} color="#ffffff" />
            <span style={{ fontWeight: '900', fontSize: '16px', letterSpacing: '-0.5px' }}>SAFEROUTE</span>
          </div>
          <span style={{ opacity: 0.8 }}>|</span>
          <span>Howdy, Tanvir!</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px' }}>
          <Link to="/planner" style={{ color: '#ffffff', textDecoration: 'none' }}>Route Planner</Link>
          <Link to="/feed" style={{ color: '#ffffff', textDecoration: 'none' }}>Community Feed</Link>
          <Link to="/contacts" style={{ color: '#ffffff', textDecoration: 'none' }}>Emergency</Link>
          <Link to="/profile" style={{ color: '#ffffff', textDecoration: 'none' }}>Profile</Link>
          <button onClick={() => navigate('/auth')} style={{ backgroundColor: 'transparent', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      </header>

      {/* 2. SUB BAR TITLE */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#334155' }}>
          Route Dashboard & Live Dispatch (Dhaka Zone)
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/report')} style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: '700', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={14} /> REPORT HAZARD
          </button>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT GRID */}
      <div style={{ flexGrow: 1, padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'stretch' }}>
        
        {/* LEFT PANEL: DATE CONTROL, COMMUTER LIST & WAYPOINTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Calendar Toolbar Bar */}
          <div style={{ backgroundColor: '#00b4d8', borderRadius: '6px 6px 0 0', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff', fontSize: '12px', fontWeight: '600' }}>
            <span>Sun, Aug 23, 2026</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button style={{ backgroundColor: '#ffffff', color: '#00b4d8', border: 'none', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>Today</button>
              <button style={{ backgroundColor: '#ffffff', color: '#00b4d8', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Calendar size={14} /></button>
              <button style={{ backgroundColor: '#ffffff', color: '#00b4d8', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><RefreshCw size={14} /></button>
            </div>
          </div>

          {/* Split Area: Commuters (Left Column) + Checkpoint List (Right Column) */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', backgroundColor: '#ffffff', borderRadius: '0 0 6px 6px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            
            {/* Commuters List */}
            <div style={{ borderRight: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              {commuters.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCommuter(c.id)}
                  style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #e2e8f0', 
                    cursor: 'pointer', 
                    backgroundColor: selectedCommuter === c.id ? '#e0f2fe' : 'transparent',
                    borderLeft: selectedCommuter === c.id ? '4px solid #00b4d8' : '4px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{c.name}</span>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: c.color }}></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
                    <span>{c.score}</span>
                    <span>{c.distance}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{c.status}</div>
                </div>
              ))}
            </div>

            {/* Selected Route Waypoints */}
            <div style={{ padding: '12px' }}>
              {waypoints.map((wp) => (
                <div key={wp.step} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: wp.active ? '#10b981' : '#cbd5e1', color: '#ffffff', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                    {wp.step}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{wp.title}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{wp.time}</span>
                    </div>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>{wp.address}</p>
                    {wp.tag && (
                      <span style={{ backgroundColor: '#00b4d8', color: '#ffffff', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px', display: 'inline-block', marginTop: '4px' }}>
                        {wp.tag}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* RIGHT PANEL: INTERACTIVE LIVE MAP DISPLAY */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Map Controls Top Bar */}
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ backgroundColor: '#00b4d8', color: '#ffffff', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={12} /> Selected Route
              </button>
              <button style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#64748b', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> All Routes
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px' }}>
                <Search size={12} color="#94a3b8" />
                <input type="text" placeholder="Search Dhanmondi, Gulshan..." style={{ border: 'none', outline: 'none', fontSize: '11px', padding: '2px 4px', width: '150px' }} />
              </div>
              <button style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}><Maximize2 size={12} color="#64748b" /></button>
            </div>
          </div>

          {/* Map Render Simulation Container */}
          <div style={{ flexGrow: 1, backgroundColor: '#e5e3df', position: 'relative', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Map Overlay Tiles Graphic Simulation */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.8, backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {/* Live GPS Pins Simulation */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '2px solid #00b4d8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="#00b4d8" />
                <div>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>Tanvir Ahmed (Dhanmondi Rd 32)</p>
                  <p style={{ margin: 0, fontSize: '9px', color: '#10b981', fontWeight: '600' }}>92% Well-Lit Route (Dhaka Grid)</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ backgroundColor: '#10b981', color: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>1</div>
                <div style={{ backgroundColor: '#3b82f6', color: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>2</div>
                <div style={{ backgroundColor: '#f59e0b', color: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>3</div>
              </div>

            </div>

            {/* Map / Satellite Toggle Bottom Control */}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <button onClick={() => setMapType('map')} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '700', border: 'none', backgroundColor: mapType === 'map' ? '#00b4d8' : '#ffffff', color: mapType === 'map' ? '#ffffff' : '#64748b', cursor: 'pointer' }}>Map</button>
              <button onClick={() => setMapType('satellite')} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '700', border: 'none', backgroundColor: mapType === 'satellite' ? '#00b4d8' : '#ffffff', color: mapType === 'satellite' ? '#ffffff' : '#64748b', cursor: 'pointer' }}>Satellite</button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}``