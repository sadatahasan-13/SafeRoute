import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp 
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#f1f5f9', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ backgroundColor: '#00b4d8', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                Admin Portal
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              System Command Center
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', margin: 0 }}>
              Real-time monitoring of active routes, incident feeds, and security network status across Dhaka.
            </p>
          </div>

          <button 
            onClick={() => navigate('/safety-feed')}
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#0f172a', 
              border: '1px solid #cbd5e1', 
              padding: '10px 18px', 
              borderRadius: '12px', 
              fontSize: '13px', 
              fontWeight: '800', 
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            View Live Safety Feed
          </button>
        </div>

        {/* METRICS STATS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>

          {/* Stat 1 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ color: '#00b4d8', marginBottom: '12px' }}><Users size={22} /></div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', margin: 0 }}>TOTAL USERS</p>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '4px 0 0' }}>1,248</h2>
          </div>

          {/* Stat 2 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ color: '#eab308', marginBottom: '12px' }}><AlertTriangle size={22} /></div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', margin: 0 }}>REPORTS TODAY</p>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '4px 0 0' }}>37</h2>
          </div>

          {/* Stat 3 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ color: '#10b981', marginBottom: '12px' }}><Activity size={22} /></div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', margin: 0 }}>ACTIVE JOURNEYS</p>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '4px 0 0' }}>84</h2>
          </div>

          {/* Stat 4 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ color: '#10b981', marginBottom: '12px' }}><ShieldCheck size={22} /></div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', margin: 0 }}>SYSTEM STATUS</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', marginTop: '6px' }}>
              ● Operational
            </div>
          </div>

        </div>

        {/* RECENT REPORTS & SYSTEM ACTIVITY */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* Recent Reports Card */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Recent Reports
              </h3>
              <button 
                onClick={() => navigate('/safety-feed')}
                style={{ background: 'none', border: 'none', color: '#00b4d8', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                View Feed →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px 16px', borderRadius: '12px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Poor Street Lighting</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Mirpur Link Road • 10 mins ago</p>
                </div>
                <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '8px' }}>
                  Pending Verification
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px 16px', borderRadius: '12px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Suspicious Activity</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>University Area • 25 mins ago</p>
                </div>
                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '8px' }}>
                  Reviewed
                </span>
              </div>
            </div>
          </div>

          {/* System Activity Log */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '20px', margin: 0 }}>
              System Activity Log
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Safety report verified by Dhaka patrol node</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>5 minutes ago</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: '#00b4d8', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>12 new live routes requested in Dhanmondi</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>18 minutes ago</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Users size={18} style={{ color: '#eab308', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>8 new community guardians registered</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>32 minutes ago</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* AREA SAFETY OVERVIEW */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <TrendingUp size={20} style={{ color: '#00b4d8' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Zone Safety Index Breakdown
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Zone 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                <span style={{ color: '#0f172a' }}>Mirpur Main Corridor</span>
                <span style={{ color: '#10b981' }}>92% (High Safety)</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#10b981', width: '92%', borderRadius: '10px' }}></div>
              </div>
            </div>

            {/* Zone 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                <span style={{ color: '#0f172a' }}>Dhaka University Campus & Shahbagh</span>
                <span style={{ color: '#10b981' }}>85% (Safe)</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#10b981', width: '85%', borderRadius: '10px' }}></div>
              </div>
            </div>

            {/* Zone 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                <span style={{ color: '#0f172a' }}>Old Dhaka Commercial Hub</span>
                <span style={{ color: '#d97706' }}>64% (Moderate Patrol)</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#eab308', width: '64%', borderRadius: '10px' }}></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}