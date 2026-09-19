import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowDown, 
  Star, 
  CheckSquare, 
  Bookmark, 
  Video 
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#f1f5f9', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif', width: '100%', minHeight: '100vh' }}>
      
      {/* HERO SECTION */}
      <section style={{ padding: '80px 40px 100px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        
        <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: 1.15, marginBottom: '24px', color: '#0f172a' }}>
          <span style={{ color: '#00b4d8' }}>Live Night Escort</span><br />
          with Dhaka's Top Safety & Patrol Network!
        </h1>
        
        <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Empowering late-night commuters across Dhaka. Access real-time CCTV coverage, verified community guardians, and instant emergency response anytime, anywhere.
        </p>

        <div 
          onClick={() => navigate('/planner')} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ backgroundColor: '#00b4d8', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 4px 14px rgba(0,180,216,0.35)' }}>
            <ArrowDown size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Ready to travel safely?</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#00b4d8' }}>Plan your night route now.</div>
          </div>
        </div>

      </section>

      {/* WAVE TRANSITION */}
      <div style={{ height: '40px', backgroundColor: '#ffffff', borderTopLeftRadius: '50% 100%', borderTopRightRadius: '50% 100%' }}></div>

      {/* FEATURES / SPECIALTY SECTION */}
      <section style={{ backgroundColor: '#ffffff', padding: '40px 40px 80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Our specialty is your security
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Get answers to your route safety questions with our fast, convenient, high-quality network.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            
            <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <div style={{ color: '#00b4d8', marginBottom: '16px' }}><Star size={26} /></div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Pick routes based on ratings and reviews.
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                View real-time street lighting, CCTV coverage, and crowd density ratings.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#ffffff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#00b4d8', marginBottom: '16px' }}><CheckSquare size={26} /></div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                See guards skilled in your area.
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                Connect directly with nearby police boxes and community escorts.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <div style={{ color: '#00b4d8', marginBottom: '16px' }}><Bookmark size={26} /></div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Re-connect with the same route in future.
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                Save favorite stops like Metro stations for one-tap navigation.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <div style={{ color: '#00b4d8', marginBottom: '16px' }}><Video size={26} /></div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Live location streaming with guardians.
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                Share live route progress with family or emergency contacts instantly.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}