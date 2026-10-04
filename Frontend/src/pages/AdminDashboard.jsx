import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, MapPin, Navigation, PhoneCall, 
  RefreshCw, Calendar, Search, Maximize2, AlertTriangle,
  PlusCircle, CheckCircle2, Radio, Shield, Users, Activity, Rss
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinates lookup for Dhaka landmarks and hubs
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [commuters, setCommuters] = useState([]);
  const [recentHazards, setRecentHazards] = useState([]);
  const [selectedCommuterId, setSelectedCommuterId] = useState(null);
  const [mapType, setMapType] = useState('map'); // 'map' | 'satellite'
  const [searchQuery, setSearchQuery] = useState('');
  const [dbConnected, setDbConnected] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // Admin defaults to showing 'all' routes
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState('');
  const [currentDate, setCurrentDate] = useState(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  });

  // Welcome modal for Admin
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    return sessionStorage.getItem('show_welcome_popup') === 'true';
  });

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Fetch all citywide routes from MongoDB
  const fetchDashboardData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/routes/dashboard');
      const data = await res.json();

      if (data.success && Array.isArray(data.commuters)) {
        setCommuters(data.commuters);
        setRecentHazards(data.recentHazards || []);
        setDbConnected(true);

        setSelectedCommuterId((prev) => {
          if (prev && data.commuters.some((c) => c.id === prev)) {
            return prev;
          }
          return data.commuters.length > 0 ? data.commuters[0].id : null;
        });
      }
    } catch (err) {
      console.error('Failed to sync admin dispatch data from MongoDB:', err);
      setDbConnected(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshNotice('Syncing citywide patrol grid...');
    const minDelay = new Promise((resolve) => setTimeout(resolve, 600));

    try {
      await Promise.all([minDelay, fetchDashboardData()]);
      setRefreshNotice('All Dhaka routes synced from MongoDB!');
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

  // Filter commuters by search query (Admin views ALL commuters)
  const filteredCommuters = commuters.filter((c) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(query) ||
      c.origin?.toLowerCase().includes(query) ||
      c.destination?.toLowerCase().includes(query) ||
      c.status?.toLowerCase().includes(query)
    );
  });

  // Active selected commuter object
  const activeCommuter = commuters.find((c) => c.id === selectedCommuterId) || commuters[0] || {
    name: 'Tanvir Ahmed',
    score: '92% Safe',
    distance: '2.5 km',
    time: '20 min',
    status: 'Active Escort',
    color: '#00b4d8',
    origin: 'Gulshan 2 Circle',
    destination: 'Dhanmondi 32 Bridge',
    policeGuard: 'Dhanmondi 32 Police Box',
    waypoints: [
      { step: 1, title: 'Gulshan 2 Circle', address: 'Road 103, Block CEN - Security Checkpoint', time: '9:42 am (1m)', active: true },
      { step: 2, title: 'Dhanmondi 32 Bridge', address: 'Mirpur Road - Metro Rail Gate 2 Plaza', time: 'est 10:03am', active: false },
      { step: 3, title: 'Uttara Sector 7 Hub', address: 'Rabindra Sarani - West Gate Terminal', time: 'est 10:28am', active: false },
    ],
  };

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
      zoom: 12,
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
  // PLOT ALL DHAKA ROUTES ON ADMIN MAP
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    const allBounds = [];

    const createPinIcon = (num, color, size = 26, isSelected = false) => {
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
            border: ${isSelected ? '3px solid #facc15' : '2px solid #ffffff'};
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

    // Plot live hazard markers
    recentHazards.forEach((h, idx) => {
      const hazardCoords = getCoords(h.location || h.title, idx + 8);
      allBounds.push(hazardCoords);

      const hazardIcon = L.divIcon({
        className: 'custom-hazard-marker',
        html: `
          <div style="
            background-color: #ef4444;
            color: #ffffff;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border: 2px solid #ffffff;
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
          ">⚠️</div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });

      L.marker(hazardCoords, { icon: hazardIcon })
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; font-size: 12px;">
            <strong style="color: #ef4444;">⚠️ Active City Hazard Report</strong><br />
            <strong>${h.title || h.incidentType || 'Hazard Zone'}</strong><br />
            <span style="color: #64748b;">${h.location || 'Dhaka Metropolitan Area'}</span>
          </div>
        `)
        .addTo(markersLayer);
    });

    if (viewMode === 'all') {
      // Plot ALL commuters across Dhaka
      commuters.forEach((c, cIdx) => {
        const routePoints = [];
        const isSelected = activeCommuter.id === c.id;

        if (c.waypoints && c.waypoints.length > 0) {
          c.waypoints.forEach((wp, wIdx) => {
            const coords = getCoords(wp.title || wp.address, cIdx * 3 + wIdx);
            routePoints.push(coords);
            allBounds.push(coords);

            L.marker(coords, { icon: createPinIcon(wIdx + 1, c.color || '#00b4d8', isSelected ? 28 : 22, isSelected) })
              .bindPopup(`
                <div style="font-family: system-ui, sans-serif; font-size: 12px;">
                  <strong style="color: ${c.color || '#00b4d8'};">${c.name}</strong><br />
                  <span>${wp.title}</span><br />
                  <span style="color: #64748b; font-size: 11px;">${wp.address}</span>
                </div>
              `)
              .addTo(markersLayer);
          });
        } else {
          const originCoords = getCoords(c.origin, cIdx);
          const destCoords = getCoords(c.destination, cIdx + 2);
          routePoints.push(originCoords, destCoords);
          allBounds.push(originCoords, destCoords);

          L.marker(originCoords, { icon: createPinIcon('A', c.color || '#00b4d8', 22, isSelected) })
            .bindPopup(`<strong>${c.name}</strong><br />Start: ${c.origin}`)
            .addTo(markersLayer);

          L.marker(destCoords, { icon: createPinIcon('B', c.color || '#00b4d8', 22, isSelected) })
            .bindPopup(`<strong>${c.name}</strong><br />End: ${c.destination}`)
            .addTo(markersLayer);
        }

        if (routePoints.length > 1) {
          L.polyline(routePoints, {
            color: c.color || '#00b4d8',
            weight: isSelected ? 6 : 3.5,
            opacity: isSelected ? 1 : 0.7,
            dashArray: isSelected ? null : '3, 4',
          }).addTo(markersLayer);
        }
      });
    } else {
      // Single selected commuter path
      const routePoints = [];
      if (activeCommuter.waypoints && activeCommuter.waypoints.length > 0) {
        activeCommuter.waypoints.forEach((wp, idx) => {
          const coords = getCoords(wp.title || wp.address, idx);
          routePoints.push(coords);
          allBounds.push(coords);

          L.marker(coords, { icon: createPinIcon(idx + 1, activeCommuter.color || '#00b4d8', 28, true) })
            .bindPopup(`
              <div style="font-family: system-ui, sans-serif; font-size: 12px; padding: 2px;">
                <strong style="color: ${activeCommuter.color || '#00b4d8'};">${activeCommuter.name}</strong><br />
                <span>${wp.title}</span><br />
                <span style="color: #64748b; font-size: 11px;">${wp.address}</span>
              </div>
            `)
            .addTo(markersLayer);
        });
      }

      if (routePoints.length > 1) {
        L.polyline(routePoints, {
          color: activeCommuter.color || '#00b4d8',
          weight: 6,
          opacity: 0.95,
          lineJoin: 'round',
        }).addTo(markersLayer);
      }
    }

    if (allBounds.length > 0) {
      map.fitBounds(allBounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [activeCommuter, viewMode, commuters, recentHazards, mapType]);

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
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '2px solid #fecaca'
            }}>
              <Shield size={36} color="#dc2626" />
            </div>

            <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#fef2f2', color: '#991b1b', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              👑 Central Admin Authority
            </span>

            <h2 style={{
              fontSize: '22px',
              fontWeight: '900',
              color: '#0f172a',
              margin: '10px 0 8px 0',
              letterSpacing: '-0.5px'
            }}>
              SafeRoute Central Admin
            </h2>

            <p style={{
              fontSize: '13px',
              color: '#64748b',
              lineHeight: 1.6,
              margin: '0 0 24px 0'
            }}>
              Welcome to the <strong>Admin Command &amp; Live Dispatch Center</strong>. You have unrestricted access to all 7+ active night commuter routes, citywide GPS telemetry, patrol boxes, and hazard monitoring.
            </p>

            <button
              onClick={handleDismissWelcomeModal}
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
                transition: 'all 0.2s ease',
                width: '100%'
              }}
            >
              Access Admin Grid
            </button>
          </div>
        </div>
      )}

      {/* SUB BAR: ADMIN METRICS & ACTIONS */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#334155' }}>
            SafeRoute Admin Command &amp; Dispatch Grid
          </h1>

          {/* Admin Role Badge */}
          <span style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            👑 Admin (Viewing All Dhaka Routes)
          </span>

          {/* MongoDB Sync Badge */}
          {dbConnected ? (
            <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
              MongoDB Live Sync ({commuters.length} Active Routes)
            </span>
          ) : (
            <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '12px' }}>
              Connecting...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/feed')}
            style={{ backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Rss size={13} color="#00b4d8" /> Safety Feed
          </button>
          <button
            onClick={() => navigate('/planner')}
            style={{ backgroundColor: '#00b4d8', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(0, 180, 216, 0.3)' }}
          >
            <PlusCircle size={14} /> Plan / Dispatch Route
          </button>
        </div>
      </div>

      {/* MAIN ADMIN GRID CONTENT */}
      <div style={{ flexGrow: 1, padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'stretch' }}>
        
        {/* LEFT PANEL: ALL COMMUTERS LIST (ALL 7 ROUTES) & WAYPOINTS */}
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
                title="Refresh all routes from MongoDB"
                style={{ backgroundColor: '#ffffff', color: '#00b4d8', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: isRefreshing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Split Area: All Commuters List (Left) + Selected Commuter Waypoints (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', backgroundColor: '#ffffff', borderRadius: '0 0 6px 6px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden', minHeight: '520px' }}>
            
            {/* All Commuters Column */}
            <div style={{ borderRight: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 12px', fontSize: '11px', fontWeight: '800', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1.5px solid #e2e8f0', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>🛡️ All Routes ({commuters.length})</span>
                <span style={{ fontSize: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1px 6px', borderRadius: '8px' }}>Admin Grid</span>
              </div>

              {/* Commuters List */}
              <div style={{ overflowY: 'auto', maxHeight: '480px', flexGrow: 1 }}>
                {filteredCommuters.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedCommuterId(c.id)}
                    style={{ 
                      padding: '12px', 
                      borderBottom: '1px solid #e2e8f0', 
                      cursor: 'pointer', 
                      backgroundColor: activeCommuter.id === c.id ? '#e0f2fe' : 'transparent',
                      borderLeft: activeCommuter.id === c.id ? '4px solid #00b4d8' : '4px solid transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b' }}>
                        {c.name}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: c.color || '#00b4d8' }}>{c.score}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span>{c.origin ? `${c.origin.split(',')[0]} ➔ ${c.destination.split(',')[0]}` : `${c.distance} • ${c.time}`}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{c.distance} • {c.time}</span>
                      <span style={{ color: c.status === 'Active Escort' ? '#00b4d8' : c.status === 'Caution Zone' ? '#f59e0b' : '#10b981', fontWeight: '700' }}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkpoint Details for Selected Commuter */}
            <div style={{ padding: '16px', overflowY: 'auto', maxHeight: '520px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Selected Commuter Header Card */}
              <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '800', fontSize: '15px', color: '#0369a1' }}>
                      {activeCommuter.name}
                    </span>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                      {activeCommuter.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    <strong>Route:</strong> {activeCommuter.origin} &rarr; {activeCommuter.destination}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    <strong>Assigned Escort:</strong> {activeCommuter.policeGuard || 'Dhanmondi Police Box'} &bull; <strong>Score:</strong> <span style={{ color: activeCommuter.color || '#00b4d8', fontWeight: '700' }}>{activeCommuter.score}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => window.open('tel:999')}
                    style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <PhoneCall size={12} /> Contact Police Patrol
                  </button>
                </div>
              </div>

              {/* Waypoints */}
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Waypoints &amp; Checkpoints ({activeCommuter.waypoints ? activeCommuter.waypoints.length : 0})
              </div>

              {activeCommuter.waypoints && activeCommuter.waypoints.length > 0 ? (
                activeCommuter.waypoints.map((wp, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      backgroundColor: wp.active ? (activeCommuter.color || '#00b4d8') : '#e2e8f0', 
                      color: wp.active ? '#ffffff' : '#64748b', 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: '800', 
                      fontSize: '11px', 
                      flexShrink: 0 
                    }}>
                      {wp.step || idx + 1}
                    </div>
                    <div style={{ flexGrow: 1, backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{wp.title}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>{wp.time}</span>
                      </div>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>{wp.address}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                  No waypoints recorded for this route yet.
                </div>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT PANEL: CITYWIDE MULTI-ROUTE INTERACTIVE LEAFLET MAP */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Map Controls Top Bar */}
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setViewMode('all')}
                style={{ 
                  backgroundColor: viewMode === 'all' ? '#dc2626' : '#ffffff', 
                  color: viewMode === 'all' ? '#ffffff' : '#64748b', 
                  border: viewMode === 'all' ? 'none' : '1px solid #cbd5e1', 
                  padding: '5px 12px', 
                  borderRadius: '4px', 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                <MapPin size={12} /> All Dhaka Routes ({commuters.length})
              </button>
              <button 
                onClick={() => setViewMode('selected')}
                style={{ 
                  backgroundColor: viewMode === 'selected' ? '#00b4d8' : '#ffffff', 
                  color: viewMode === 'selected' ? '#ffffff' : '#64748b', 
                  border: viewMode === 'selected' ? 'none' : '1px solid #cbd5e1', 
                  padding: '5px 12px', 
                  borderRadius: '4px', 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                <Navigation size={12} /> Selected Route
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px' }}>
                <Search size={12} color="#94a3b8" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter commuters..." 
                  style={{ border: 'none', outline: 'none', fontSize: '11px', padding: '2px 4px', width: '130px' }} 
                />
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                title="Reset search filter"
                style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}
              >
                <Maximize2 size={12} color="#64748b" />
              </button>
            </div>
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

            {/* Central Police Dispatch Status Tag */}
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
              <Radio size={11} color="#ef4444" /> 
              <span>Central Police Grid • {mapType === 'satellite' ? 'Google Satellite Hybrid' : 'Google Roadmap'}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}