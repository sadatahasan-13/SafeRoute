import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, MapPin, Navigation, PhoneCall, 
  RefreshCw, Calendar, PlusCircle, CheckCircle2, Radio, User,
  AlertCircle
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinates lookup for Dhaka landmarks
const DHAKA_COORDS = {
  'gulshan 2': [23.7925, 90.4158],
  'banani 11': [23.7937, 90.4043],
  'kemal ataturk': [23.7940, 90.4070],
  'dhanmondi 32': [23.7516, 90.3776],
  'dhanmondi 27': [23.7550, 90.3720],
  'dhanmondi': [23.7516, 90.3776],
  'manik mia': [23.7580, 90.3800],
  'farmgate overbridge': [23.7588, 90.3895],
  'farmgate footover': [23.7588, 90.3895],
  'farmgate': [23.7588, 90.3895],
  'shahbagh': [23.7383, 90.3957],
  'tsc': [23.7317, 90.3956],
  'mirpur 10': [23.8071, 90.3686],
  'mirpur 1': [23.7950, 90.3550],
  'mirpur': [23.8071, 90.3686],
  'kallayanpur': [23.7801, 90.3601],
  'uttara': [23.8687, 90.3997],
  'mohakhali': [23.7770, 90.4020],
  'bashundhara': [23.8160, 90.4280],
};

const getCoords = (name, fallbackIdx = 0) => {
  if (!name) return [23.750 + fallbackIdx * 0.008, 90.385 + fallbackIdx * 0.008];
  const lower = name.toLowerCase();
  for (const [key, coords] of Object.entries(DHAKA_COORDS)) {
    if (lower.includes(key)) return coords;
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const latOffset = ((Math.abs(hash) % 50) - 25) / 1000;
  const lngOffset = ((Math.abs(hash >> 3) % 50) - 25) / 1000;
  return [23.758 + latOffset, 90.385 + lngOffset];
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [commuters, setCommuters] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [mapType, setMapType] = useState('map'); // 'map' | 'satellite'
  const [dbConnected, setDbConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState('');
  const [currentDate, setCurrentDate] = useState(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  });

  // Logged-in user
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    user = {};
  }
  const token = localStorage.getItem('token');

  // Welcome popup modal
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    return sessionStorage.getItem('show_welcome_popup') === 'true';
  });

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Fetch routes from backend
  const fetchDashboardData = async () => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('http://localhost:5000/api/routes/dashboard', { headers });
      const data = await res.json();

      if (data.success && Array.isArray(data.commuters)) {
        setCommuters(data.commuters);
        setDbConnected(true);
      }
    } catch (err) {
      console.error('Failed to sync user dashboard data:', err);
      setDbConnected(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshNotice('Syncing personal route...');
    const minDelay = new Promise((resolve) => setTimeout(resolve, 600));

    try {
      await Promise.all([minDelay, fetchDashboardData()]);
      setRefreshNotice('Route updated from MongoDB!');
    } catch (err) {
      setRefreshNotice('Update failed.');
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setRefreshNotice(''), 2500);
    }
  };

  const handleDismissWelcomeModal = () => {
    setShowWelcomeModal(false);
    sessionStorage.removeItem('show_welcome_popup');
  };

  // Filter STRICTLY to the logged-in user's personal route(s)
  const myRoutes = commuters.filter((c) => {
    if (!user || (!user._id && !user.name)) return false;
    const matchId = user._id && c.userId && String(c.userId) === String(user._id);
    const matchName = user.name && c.name && c.name.trim().toLowerCase() === user.name.trim().toLowerCase();
    return matchId || matchName;
  });

  // Current active route object (strictly the logged-in user's personal route)
  const activeRoute = myRoutes.find((r) => r.id === selectedRouteId) || myRoutes[0] || null;

  // -------------------------------------------------------------
  // LEAFLET MAP INITIALIZATION & TILE TOGGLE
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current._leaflet_id) {
      mapContainerRef.current._leaflet_id = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [23.758, 90.385],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    let tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    let attribution = '&copy; Google Maps';

    if (mapType === 'satellite') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      attribution = '&copy; Google Satellite Imagery';
    }

    const tileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    const markersLayer = L.featureGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapType]);

  // -------------------------------------------------------------
  // PLOT USER'S SPECIFIC ROUTE ON MAP
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer || !activeRoute) return;

    markersLayer.clearLayers();
    const allBounds = [];

    const createPinIcon = (num, color = '#00b4d8', size = 28) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${color};
            color: #ffffff;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 11px;
            border: 2px solid #ffffff;
            box-shadow: 0 3px 8px rgba(0,0,0,0.35);
          ">
            ${num}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    };

    const routePoints = [];

    if (activeRoute.waypoints && activeRoute.waypoints.length > 0) {
      activeRoute.waypoints.forEach((wp, idx) => {
        const coords = getCoords(wp.title || wp.address, idx);
        routePoints.push(coords);
        allBounds.push(coords);

        L.marker(coords, { icon: createPinIcon(idx + 1, activeRoute.color || '#00b4d8') })
          .bindPopup(`
            <div style="font-family: system-ui, sans-serif; font-size: 12px; padding: 2px;">
              <span style="font-size: 10px; color: ${activeRoute.color || '#00b4d8'}; font-weight: 800; text-transform: uppercase;">
                Your Checkpoint ${idx + 1}
              </span><br />
              <strong style="color: #0f172a; font-size: 13px;">${wp.title}</strong><br />
              <span style="color: #64748b; font-size: 11px;">${wp.address}</span><br />
              <span style="font-size: 10px; color: #10b981; font-weight: 700;">ETA: ${wp.time}</span>
            </div>
          `)
          .addTo(markersLayer);
      });
    } else {
      const originCoords = getCoords(activeRoute.origin, 0);
      const destCoords = getCoords(activeRoute.destination, 2);
      routePoints.push(originCoords, destCoords);
      allBounds.push(originCoords, destCoords);

      L.marker(originCoords, { icon: createPinIcon('A', activeRoute.color || '#00b4d8') })
        .bindPopup(`<strong>Origin:</strong> ${activeRoute.origin}`)
        .addTo(markersLayer);

      L.marker(destCoords, { icon: createPinIcon('B', activeRoute.color || '#00b4d8') })
        .bindPopup(`<strong>Destination:</strong> ${activeRoute.destination}`)
        .addTo(markersLayer);
    }

    if (routePoints.length > 1) {
      L.polyline(routePoints, {
        color: activeRoute.color || '#00b4d8',
        weight: 6,
        opacity: 0.95,
        lineJoin: 'round',
      }).addTo(markersLayer);
    }

    if (allBounds.length > 0) {
      map.fitBounds(allBounds, { padding: [60, 60], maxZoom: 15 });
    }
  }, [activeRoute, mapType]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      
      {/* WELCOME POPUP MODAL */}
      {showWelcomeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '36px 32px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '2px solid #bae6fd'
            }}>
              <ShieldCheck size={36} color="#00b4d8" />
            </div>

            <h2 style={{
              fontSize: '22px',
              fontWeight: '900',
              color: '#0f172a',
              margin: '0 0 10px 0',
              letterSpacing: '-0.5px'
            }}>
              Welcome, {user.name || 'Sadat Ahasan'}!
            </h2>

            <p style={{
              fontSize: '13px',
              color: '#64748b',
              lineHeight: 1.6,
              margin: '0 0 24px 0'
            }}>
              You are signed in to your <strong>User Commute Dashboard</strong>. Here you can monitor your active personal route, turn-by-turn safe waypoints, and assigned police escort.
            </p>

            <button
              onClick={handleDismissWelcomeModal}
              style={{
                backgroundColor: '#00b4d8',
                color: '#ffffff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 180, 216, 0.35)',
                transition: 'all 0.2s ease',
                width: '100%'
              }}
            >
              View My Route
            </button>
          </div>
        </div>
      )}

      {/* SUB BAR TITLE WITH COMMUTER STATUS & ACTIONS */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#334155' }}>
            Personal Commuter Dashboard
          </h1>

          {/* User Badge */}
          <span style={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            👤 Commuter: {user.name || 'Sadat Ahasan'}
          </span>

          {/* MongoDB Sync */}
          {dbConnected ? (
            <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
              MongoDB Live Sync (Personal Mode)
            </span>
          ) : (
            <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '12px' }}>
              Connecting...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/planner')}
            style={{ backgroundColor: '#00b4d8', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(0, 180, 216, 0.3)' }}
          >
            <PlusCircle size={14} /> Plan / Dispatch New Route
          </button>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={{ flexGrow: 1, padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'stretch' }}>
        
        {/* LEFT PANEL: PERSONAL ROUTE CARD & STEP-BY-STEP CHECKPOINTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Calendar Toolbar */}
          <div style={{ backgroundColor: '#00b4d8', borderRadius: '6px 6px 0 0', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff', fontSize: '12px', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{currentDate}</span>
              {refreshNotice && (
                <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700' }}>
                  {refreshNotice}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => setCurrentDate(new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }))}
                style={{ backgroundColor: '#ffffff', color: '#00b4d8', border: 'none', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
              >
                Today
              </button>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh personal route from MongoDB"
                style={{ backgroundColor: '#ffffff', color: '#00b4d8', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: isRefreshing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Details Container */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0 0 6px 6px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', padding: '20px', minHeight: '520px', overflowY: 'auto' }}>
            
            {activeRoute ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Active Route Summary Box */}
                <div style={{ backgroundColor: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '12px', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '900', fontSize: '16px', color: '#0369a1' }}>
                          {activeRoute.commuterName || activeRoute.name || 'Your Journey'}
                        </span>
                        <span style={{ backgroundColor: '#0284c7', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '12px' }}>
                          Your Route
                        </span>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                          {activeRoute.status || 'In Transit'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: '6px 0 2px 0' }}>
                        {activeRoute.origin} &rarr; {activeRoute.destination}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        {activeRoute.distance} &bull; {activeRoute.time} &bull; Safety Score: <strong style={{ color: '#00b4d8' }}>{activeRoute.score}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => window.open('tel:999')}
                      style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)' }}
                    >
                      <PhoneCall size={14} /> Police Helpline: 999
                    </button>
                  </div>

                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #e0f2fe', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', flexWrap: 'wrap', gap: '8px' }}>
                    <span><strong>Assigned Guard:</strong> {activeRoute.policeGuard || 'MRT Line 6 Patrol Unit'}</span>
                    <span><strong>Security Preference:</strong> {activeRoute.securityPreference || 'Police Checkpoint Priority'}</span>
                  </div>
                </div>

                {/* Multiple Routes Switcher (if user has multiple routes) */}
                {myRoutes.length > 1 && (
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                      Your Saved Routes ({myRoutes.length})
                    </span>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', overflowX: 'auto' }}>
                      {myRoutes.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedRouteId(r.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: activeRoute.id === r.id ? '2px solid #00b4d8' : '1px solid #cbd5e1',
                            backgroundColor: activeRoute.id === r.id ? '#f0f9ff' : '#ffffff',
                            color: activeRoute.id === r.id ? '#00b4d8' : '#475569',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {r.origin.split(',')[0]} ➔ {r.destination.split(',')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Turn-by-Turn Waypoints */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0' }}>
                    Personal Waypoints &amp; Safe Checkpoints ({activeRoute.waypoints ? activeRoute.waypoints.length : 0})
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeRoute.waypoints && activeRoute.waypoints.length > 0 ? (
                      activeRoute.waypoints.map((wp, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ 
                            backgroundColor: wp.active ? (activeRoute.color || '#00b4d8') : '#e2e8f0', 
                            color: wp.active ? '#ffffff' : '#64748b', 
                            width: '28px', 
                            height: '28px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: '800', 
                            fontSize: '12px', 
                            flexShrink: 0 
                          }}>
                            {wp.step || idx + 1}
                          </div>
                          <div style={{ flexGrow: 1, backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>{wp.title}</span>
                              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>{wp.time}</span>
                            </div>
                            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>{wp.address}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                        No waypoints recorded for this route.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              /* Empty State when no routes planned */
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Navigation size={28} color="#00b4d8" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
                  No Active Journey Dispatched
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '340px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                  You currently have no night routes planned under your name. Plan a safe route with street lighting scores and police escort to start tracking.
                </p>
                <button
                  onClick={() => navigate('/planner')}
                  style={{ backgroundColor: '#00b4d8', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 3px 10px rgba(0, 180, 216, 0.3)' }}
                >
                  <PlusCircle size={15} /> Plan Safe Route Now
                </button>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT PANEL: INTERACTIVE GOOGLE MAP & SATELLITE TILES */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Map Top Bar */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Navigation size={13} color="#00b4d8" /> Turn-by-Turn GPS Corridor
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
              Dhaka Metropolitan Patrol Network
            </span>
          </div>

          {/* Leaflet Map DOM Element Container */}
          <div style={{ position: 'relative', width: '100%', height: '520px', minHeight: '520px', backgroundColor: '#1e293b' }}>
            
            <div 
              ref={mapContainerRef} 
              style={{ width: '100%', height: '100%', minHeight: '520px', zIndex: 1 }} 
            />

            {/* MAP VS SATELLITE SWITCHER BUTTONS (Bottom-Left) */}
            <div style={{ 
              position: 'absolute', 
              bottom: '16px', 
              left: '16px', 
              zIndex: 1000, 
              backgroundColor: '#ffffff', 
              border: '1px solid #cbd5e1', 
              borderRadius: '6px', 
              overflow: 'hidden', 
              display: 'flex', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
            }}>
              <button 
                type="button"
                onClick={() => setMapType('map')} 
                style={{ 
                  padding: '7px 14px', 
                  fontSize: '11px', 
                  fontWeight: '800', 
                  border: 'none', 
                  backgroundColor: mapType === 'map' ? '#00b4d8' : '#ffffff', 
                  color: mapType === 'map' ? '#ffffff' : '#475569', 
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                🗺️ Street Map
              </button>
              <button 
                type="button"
                onClick={() => setMapType('satellite')} 
                style={{ 
                  padding: '7px 14px', 
                  fontSize: '11px', 
                  fontWeight: '800', 
                  border: 'none', 
                  backgroundColor: mapType === 'satellite' ? '#00b4d8' : '#ffffff', 
                  color: mapType === 'satellite' ? '#ffffff' : '#475569', 
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                🛰️ Satellite
              </button>
            </div>

            {/* Live GPS Tag */}
            <div style={{ 
              position: 'absolute', 
              bottom: '16px', 
              right: '60px', 
              zIndex: 1000, 
              backgroundColor: 'rgba(15, 23, 42, 0.85)', 
              backdropFilter: 'blur(4px)', 
              color: '#ffffff', 
              padding: '5px 10px', 
              borderRadius: '6px', 
              fontSize: '10px', 
              fontWeight: '700', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Radio size={11} color="#38bdf8" /> 
              <span>{mapType === 'satellite' ? 'Google Satellite Hybrid' : 'Google Roadmap Navigation'}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

