import React from 'react';
import { 
  BarChart2, 
  MapPin, 
  ShieldCheck, 
  PhoneCall, 
  Clock, 
  Plus, 
  Search, 
  Send 
} from 'lucide-react';

export default function RoutePlanner() {
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          Dhaka Night Commute Planner & Safety Escort Flow
        </h1>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
          Live Synchronized with Dhaka Police Night Patrol Grid
        </span>
      </div>

      {/* Main 3-Column Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1.1fr', gap: '20px' }}>
        
        {/* Column 1: Route Analytics */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#00b4d8', color: '#ffffff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '15px' }}>Route Analytics</span>
            <BarChart2 size={18} />
          </div>
          
          <div style={{ padding: '20px' }}>
            {/* Metric Box */}
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#00b4d8', lineHeight: 1 }}>18</div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#0369a1', marginTop: '6px', letterSpacing: '0.5px' }}>
                DHAKA NIGHT ROUTES COMPLETED
              </div>
            </div>

            {/* Commuter Density Chart */}
            <div>
              <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '16px' }}>
                Commuter Density per Day
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', padding: '0 10px' }}>
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => {
                  const heights = [35, 75, 45, 60, 50, 95, 40];
                  const isFriday = day === 'FRI';
                  return (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <div style={{ 
                        width: '18px', 
                        height: `${heights[idx]}px`, 
                        backgroundColor: isFriday ? '#00b4d8' : '#cbd5e1', 
                        borderRadius: '4px' 
                      }} />
                      <span style={{ fontSize: '10px', fontWeight: '700', color: isFriday ? '#00b4d8' : '#94a3b8' }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Stop Config & Safety */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>Stop Config & Safety</span>
            <Search size={18} color="#64748b" />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>TSC Dhaka University Hub</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>University of Dhaka, Shahbagh, Dhaka 1000</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} /> Add Metro Gate 2 Stop
              </span>
              <Plus size={16} color="#00b4d8" style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <ShieldCheck size={16} /> Safety Rating
              </span>
              <span style={{ fontWeight: '700', color: '#10b981' }}>96% High Lighting</span>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <PhoneCall size={16} /> Nearby Guard
              </span>
              <span style={{ fontWeight: '700', color: '#00b4d8' }}>Shahbagh Police Box</span>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <Clock size={16} /> Expected Stopover
              </span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>5 mins</span>
            </div>
          </div>
        </div>

        {/* Column 3: Interactive Route Flow */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '30px 20px', textAlign: 'center', position: 'relative', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '12px 12px' }}>
            <div style={{ backgroundColor: '#00b4d8', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', boxShadow: '0 2px 8px rgba(0,180,216,0.3)' }}>
              <Send size={14} /> Dhanmondi 32 Overbridge
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ backgroundColor: '#f0f9ff', borderLeft: '4px solid #00b4d8', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ fontWeight: '800', fontSize: '13px', color: '#0369a1' }}>Start: TSC Hub</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>University of Dhaka - Metro Gate 1</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontWeight: '700', fontSize: '13px', color: '#334155' }}>Mirpur Road Stop</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Dhanmondi Road 2 - High Street Lamp Zone</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontWeight: '700', fontSize: '13px', color: '#334155' }}>Farmgate Metro Station</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Police Box Entrance & CCTV Surveillance</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}