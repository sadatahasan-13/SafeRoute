import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  PhoneCall, 
  Clock, 
  Plus, 
  Search, 
  Send,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Loader2,
  AlertTriangle,
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const DHAKA_LOCATIONS = [
  'TSC Dhaka University Hub',
  'Dhanmondi 27 / R/A',
  'Farmgate Metro Station',
  'Gulshan 2 Circle',
  'Uttara Sector 7 Hub',
  'Mirpur 10 Circle',
  'Shahbagh Crossing',
  'Banani 11 Night Hub',
  'Bashundhara R/A Gate',
  'Mohakhali Wireless Gate',
];

export default function RoutePlanner() {
  const navigate = useNavigate();

  // Authentication state
  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (err) {
    currentUser = {};
  }
  const token = localStorage.getItem('token');
  const isAdmin = currentUser.role === 'admin' || currentUser.email === 'admin@saferoute.bd';

  const [savedRoutes, setSavedRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [commuterFilter, setCommuterFilter] = useState('ALL');

  // New Route Planning Form State
  const [origin, setOrigin] = useState('TSC Dhaka University Hub');
  const [destination, setDestination] = useState('Dhanmondi 32 Bridge');
  const [securityPreference, setSecurityPreference] = useState('Well-Lit Corridors');
  const [customStop, setCustomStop] = useState('');
  const [showAddStopInput, setShowAddStopInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  // Fetch live routes from MongoDB scoped to current user (or all if admin)
  const fetchPlannerData = async () => {
    try {
      setLoading(true);
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('http://localhost:5000/api/routes', { headers });
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setSavedRoutes(data.data);
        if (data.data.length > 0) {
          setSelectedRoute(data.data[0]);
        } else {
          setSelectedRoute(null);
        }
      }
      setDbConnected(true);
    } catch (err) {
      console.error('Failed to sync route planner with backend:', err);
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannerData();
  }, [token]);

  // Handle Planning and Dispatching a New Safe Route
  const handlePlanRoute = async (e) => {
    e.preventDefault();
    if (!origin || !destination) {
      alert('Please specify both starting point and destination.');
      return;
    }
    if (origin === destination) {
      alert('Starting point and destination cannot be identical.');
      return;
    }

    setSubmitting(true);
    setNotification('');

    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch('http://localhost:5000/api/routes', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          origin,
          destination,
          securityPreference,
          customStop: customStop.trim() || undefined,
          commuterName: currentUser.name || 'Dhaka Commuter',
          userId: currentUser._id || undefined,
        }),
      });

      const result = await res.json();
      if (result.success && result.data) {
        setSelectedRoute(result.data);
        setSavedRoutes((prev) => [result.data, ...prev]);
        setNotification(`Route "${result.data.routeName}" created with ${result.data.score}!`);
        setShowAddStopInput(false);
        setCustomStop('');
      }
    } catch (err) {
      console.error('Failed to plan route:', err);
      alert('Error creating safe route. Please ensure backend server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a route from MongoDB
  const handleDeleteRoute = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this planned route?')) return;

    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`http://localhost:5000/api/routes/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setSavedRoutes((prev) => prev.filter((r) => r._id !== id));
        if (selectedRoute?._id === id) {
          setSelectedRoute(savedRoutes.find((r) => r._id !== id) || null);
        }
      }
    } catch (err) {
      console.error('Failed to delete route:', err);
    }
  };

  // Filtered routes for admin dropdown
  const displayedRoutes = isAdmin && commuterFilter !== 'ALL'
    ? savedRoutes.filter(r => (r.user?.email === commuterFilter || r.commuterName === commuterFilter))
    : savedRoutes;

  // Active route: strictly selected or first displayed, or null if commuter has 0 routes
  const activeRoute = selectedRoute || (displayedRoutes.length > 0 ? displayedRoutes[0] : null);

  return (
    <div style={{ 
      backgroundColor: '#f1f5f9', 
      minHeight: '100vh', 
      width: '100%', 
      padding: '24px 32px', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      boxSizing: 'border-box' 
    }}>
      
      {/* Page Title Header with Live DB Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Navigation size={26} color="#00b4d8" /> Dhaka Night Commute Planner & Safety Escort Flow
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Live Synchronized with Dhaka Police Night Patrol Grid & MongoDB Cloud
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {dbConnected ? (
            <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: '800', padding: '5px 12px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
              MongoDB Live Sync ({savedRoutes.length} Planned)
            </span>
          ) : (
            <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: '700', padding: '5px 12px', borderRadius: '12px' }}>
              Connecting to Database...
            </span>
          )}

          <button
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Open Live Dashboard &rarr;
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {notification && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 18px', color: '#166534', fontSize: '13px', fontWeight: '700', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#16a34a" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
          >
            View on Live Map &rarr;
          </button>
        </div>
      )}

      {/* INTERACTIVE ROUTE DISPATCH FORM */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#00b4d8" /> Plan & Dispatch a Safe Night Route
          </span>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>
            Calculates real-time lighting, police booths & active community hazard alerts
          </span>
        </div>

        <form onSubmit={handlePlanRoute} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          
          {/* Origin */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px' }}>
              STARTING POINT (ORIGIN)
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none' }}
            >
              {DHAKA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px' }}>
              SAFE DESTINATION
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none' }}
            >
              {DHAKA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Security Preference */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px' }}>
              SAFETY PREFERENCE
            </label>
            <select
              value={securityPreference}
              onChange={(e) => setSecurityPreference(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="Well-Lit Corridors">Well-Lit Corridors (High Illumination)</option>
              <option value="Police Checkpoint Priority">Police Checkpoint Priority (Guarded)</option>
              <option value="Metro Corridor">Metro Corridor (CCTV & MRT Security)</option>
              <option value="Quickest Route">Quickest Route (Direct Path)</option>
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              style={{ 
                width: '100%', 
                backgroundColor: submitting ? '#94a3b8' : '#00b4d8', 
                color: '#ffffff', 
                border: 'none', 
                padding: '11px 18px', 
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: '800', 
                cursor: submitting ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 180, 216, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Calculating Safe Path...
                </>
              ) : (
                <>
                  <Send size={15} /> Plan & Save Route
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Main Grid Layout: Stop Config & Safety (Left) + Interactive Route Flow (Right) */}
      {activeRoute ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
          gap: '24px',
          width: '100%' 
        }}>

          {/* Column 2: Stop Config & Safety (Dynamic from Selected Route) */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>Stop Config & Safety</span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>
                  {activeRoute.score || '92% Safe'}
                </span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  {activeRoute.origin}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Destination: {activeRoute.destination}
                </div>
                {isAdmin && (
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#0284c7', fontWeight: '800' }}>
                    👤 Commuter: {activeRoute.user?.name || activeRoute.commuterName} {activeRoute.user?.email ? `(${activeRoute.user.email})` : ''}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Optional Custom Stopover Toggle */}
                {showAddStopInput ? (
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #00b4d8', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Enter stopover landmark..."
                      value={customStop}
                      onChange={(e) => setCustomStop(e.target.value)}
                      style={{ flexGrow: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '12px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddStopInput(false)}
                      style={{ backgroundColor: '#00b4d8', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => setShowAddStopInput(true)}
                    style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} /> {customStop ? `Stopover: ${customStop}` : 'Add Mid-Route Checkpoint'}
                    </span>
                    <Plus size={16} color="#00b4d8" />
                  </div>
                )}

                {/* Guard Station Info */}
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                    <PhoneCall size={16} /> Nearby Guard
                  </span>
                  <span style={{ fontWeight: '700', color: '#00b4d8' }}>
                    {activeRoute.policeGuard || 'Shahbagh Police Box'}
                  </span>
                </div>

                {/* Stopover Duration */}
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                    <Clock size={16} /> Estimated Travel Time
                  </span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>
                    {activeRoute.time || '20 min'} ({activeRoute.distance || '3.2 km'})
                  </span>
                </div>

              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Emergency Dispatch</span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#dc2626' }}>Helpline 999 Ready</span>
            </div>
          </div>

          {/* Column 3: Interactive Route Flow (Step-by-Step Waypoints) */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', textAlign: 'center', position: 'relative', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '12px 12px' }}>
              <div style={{ backgroundColor: '#00b4d8', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', boxShadow: '0 2px 8px rgba(0,180,216,0.3)' }}>
                <Send size={14} /> {activeRoute.destination}
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                Safety Score: <strong style={{ color: '#16a34a' }}>{activeRoute.score}</strong> • Distance: <strong>{activeRoute.distance}</strong>
              </p>
            </div>

            {/* Waypoints Sequence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              {activeRoute.waypoints && activeRoute.waypoints.map((wp, idx) => {
                const isStart = idx === 0;
                const isEnd = idx === activeRoute.waypoints.length - 1;
                return (
                  <div 
                    key={wp.step || idx} 
                    style={{ 
                      backgroundColor: isStart ? '#f0f9ff' : '#f8fafc', 
                      borderLeft: isStart ? '4px solid #00b4d8' : isEnd ? '4px solid #10b981' : '1px solid #e2e8f0', 
                      borderTop: '1px solid #e2e8f0',
                      borderRight: '1px solid #e2e8f0',
                      borderBottom: '1px solid #e2e8f0',
                      borderRadius: '8px', 
                      padding: '10px 14px' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: '800', fontSize: '12px', color: isStart ? '#0369a1' : isEnd ? '#15803d' : '#334155' }}>
                        {wp.step}. {wp.title}
                      </div>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{wp.time}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      {wp.address}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              style={{ 
                backgroundColor: '#0f172a', 
                color: '#ffffff', 
                border: 'none', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '12px', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              Track on Live Dashboard <ArrowRight size={14} />
            </button>

          </div>

        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1', padding: '36px 24px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Navigation size={28} color="#00b4d8" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>
            No Saved Routes Yet
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
            {isAdmin 
              ? 'No commuters have registered any routes yet across Dhaka.' 
              : `You haven't planned any routes under your account yet (${currentUser.email || currentUser.phone || 'Commuter'}). Select your origin and destination in the form above, then click "Plan & Save Route" to calculate your first safe corridor!`}
          </p>
        </div>
      )}

      {/* SAVED DHAKA ROUTES LIST (Stored in MongoDB Atlas) */}
      <div style={{ marginTop: '28px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px 24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
              {isAdmin ? '👑 All Commuter Routes (Admin Central Dispatch)' : 'My Saved & Dispatched Routes in Dhaka'}
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              {isAdmin 
                ? 'Inspecting all routes planned across Dhaka by commuters. Select a route to see details.'
                : 'Select any of your personal routes to inspect its safety waypoints or launch live escort tracking.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAdmin && (
              <select
                value={commuterFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setCommuterFilter(val);
                  const filtered = val === 'ALL'
                    ? savedRoutes
                    : savedRoutes.filter(r => (r.user?.email === val || r.commuterName === val));
                  if (filtered.length > 0) setSelectedRoute(filtered[0]);
                  else setSelectedRoute(null);
                }}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: '700', color: '#0f172a', backgroundColor: '#f8fafc', outline: 'none' }}
              >
                <option value="ALL">All Commuters ({savedRoutes.length})</option>
                {Array.from(new Set(savedRoutes.map(r => r.user?.email || r.commuterName))).filter(Boolean).map(val => (
                  <option key={val} value={val}>👤 {val}</option>
                ))}
              </select>
            )}
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#00b4d8' }}>
              {displayedRoutes.length} Route{displayedRoutes.length === 1 ? '' : 's'} Recorded
            </span>
          </div>
        </div>

        {displayedRoutes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: '#94a3b8', fontSize: '13px' }}>
            No routes found for this view. Plan a route above to get started.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {displayedRoutes.map((r) => {
              const isSelected = selectedRoute?._id === r._id;
              return (
                <div
                  key={r._id}
                  onClick={() => setSelectedRoute(r)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #00b4d8' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#f0f9ff' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                      {r.routeName}
                    </span>
                    <button
                      onClick={(e) => handleDeleteRoute(r._id, e)}
                      title="Remove route"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {isAdmin && (
                    <div style={{ fontSize: '10px', color: '#0369a1', fontWeight: '800', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', marginBottom: '6px', display: 'inline-block' }}>
                      👤 Commuter: {r.user?.name || r.commuterName} {r.user?.email ? `(${r.user.email})` : ''}
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                    {!isAdmin && (r.commuterName || 'My Route')} • {r.securityPreference}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ fontWeight: '800', color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                      {r.score}
                    </span>
                    <span style={{ color: '#64748b', fontWeight: '600' }}>
                      {r.distance} • {r.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
} 