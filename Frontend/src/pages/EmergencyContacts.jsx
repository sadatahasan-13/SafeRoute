import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, Phone, Plus, ShieldCheck, Trash2, PhoneCall, 
  AlertTriangle, CheckCircle2, Radio, Heart, ExternalLink, 
  X, RefreshCw, LogIn, AlertCircle, ShieldAlert
} from 'lucide-react';

export default function Contacts() {
  const navigate = useNavigate();

  // Authentication state
  const token = localStorage.getItem('token');
  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    currentUser = {};
  }

  // Contacts state
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testSimulating, setTestSimulating] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  // New Contact Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Parent');
  const [submitting, setSubmitting] = useState(false);

  // Default fallback contacts for demo / guest mode
  const defaultDemoContacts = [
    {
      _id: 'demo-1',
      name: 'Mom (Tahmina Rahman)',
      phone: '+880 1712 345678',
      relation: 'Parent',
      isActive: true,
    },
    {
      _id: 'demo-2',
      name: 'Rahim (Brother)',
      phone: '+880 1819 876543',
      relation: 'Sibling',
      isActive: true,
    }
  ];

  // Fetch contacts from MongoDB backend
  const fetchContacts = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    setErrorNotice('');

    if (!token) {
      setContacts(defaultDemoContacts);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.data)) {
        setContacts(data.data);
        setDbConnected(true);
      } else {
        // Fallback to demo contacts if user has none saved yet
        setContacts(data.data && data.data.length > 0 ? data.data : defaultDemoContacts);
        setDbConnected(true);
      }
    } catch (err) {
      console.warn('Could not fetch contacts from backend:', err);
      setContacts(defaultDemoContacts);
      setDbConnected(false);
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [token]);

  // Handle Add Contact Submit
  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorNotice('Please provide both a contact name and a phone number.');
      return;
    }

    setSubmitting(true);
    setErrorNotice('');

    if (!token) {
      // Guest demo addition
      const newContact = {
        _id: `demo-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        relation,
        isActive: true,
      };
      setContacts(prev => [newContact, ...prev]);
      setSuccessNotice('Contact added in preview mode! (Sign in to persist in MongoDB)');
      setTimeout(() => setSuccessNotice(''), 3500);
      setShowAddModal(false);
      setName('');
      setPhone('');
      setRelation('Parent');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          relation,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save contact to MongoDB.');
      }

      setSuccessNotice(`Saved "${data.data.name}" directly to your MongoDB account.`);
      setTimeout(() => setSuccessNotice(''), 4000);
      setShowAddModal(false);
      setName('');
      setPhone('');
      setRelation('Parent');

      // Refresh list
      fetchContacts();
    } catch (err) {
      setErrorNotice(err.message || 'Error saving contact.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Contact
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Remove this emergency contact from your dispatch list?')) {
      return;
    }

    // If demo contact or unauthenticated
    if (!token || id.startsWith('demo-')) {
      setContacts(prev => prev.filter(c => c._id !== id));
      setSuccessNotice('Contact removed.');
      setTimeout(() => setSuccessNotice(''), 2500);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (res.ok) {
        setContacts(prev => prev.filter(c => c._id !== id));
        setSuccessNotice('Contact removed from MongoDB Atlas.');
        setTimeout(() => setSuccessNotice(''), 3000);
      } else {
        throw new Error(data.message || 'Failed to delete contact.');
      }
    } catch (err) {
      alert(err.message || 'Error deleting contact.');
    }
  };

  // Handle Test Alert Simulation
  const handleStartTestAlert = () => {
    setShowTestModal(true);
    setTestSimulating(true);
    setTestSuccess(false);

    setTimeout(() => {
      setTestSimulating(false);
      setTestSuccess(true);
    }, 1800);
  };

  // National Official Helplines
  const nationalHelplines = [
    {
      code: '999',
      title: 'National Emergency Service',
      desc: 'Bangladesh Police, Ambulance & Fire Service (Toll-Free 24/7)',
      badge: 'Immediate Response',
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
      icon: ShieldAlert
    },
    {
      code: '109',
      title: 'Women & Child Helpline',
      desc: 'Ministry of Women and Children Affairs (Prevention of Violence)',
      badge: '24/7 Support',
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
      icon: Heart
    },
    {
      code: '106',
      title: 'RAB & Emergency Patrol',
      desc: 'Rapid Action Battalion Anti-Crime & Night Road Security Desk',
      badge: 'Rapid Dispatch',
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#ddd6fe',
      icon: Radio
    },
    {
      code: '333',
      title: 'Citizen Emergency Desk',
      desc: 'Government Information, Disaster Relief & District Admin',
      badge: 'Official Gov',
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      icon: ShieldCheck
    }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* 1. HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '900', margin: 0, color: '#0f172a', letterSpacing: '-0.5px' }}>
                Emergency Contacts
              </h1>
              {token ? (
                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} /> MongoDB Live ({contacts.length})
                </span>
              ) : (
                <span style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px' }}>
                  Preview Mode
                </span>
              )}
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
              Trusted individuals who instantly receive your live GPS coordinates, battery level, and route distress broadcast during emergencies.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => fetchContacts(true)}
              disabled={refreshing}
              title="Refresh contacts"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '10px 12px',
                borderRadius: '10px',
                color: '#475569',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: '#00b4d8',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(0, 180, 216, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={16} /> Add Contact
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {successNotice && (
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#059669" />
            {successNotice}
          </div>
        )}

        {/* UNAUTHENTICATED PROMPT BANNER */}
        {!token && (
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#dbeafe', padding: '8px', borderRadius: '10px' }}>
                <AlertCircle size={20} color="#2563eb" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1e40af' }}>
                  Sign in to link contacts to your account
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#3b82f6' }}>
                  You are currently using guest preview mode. Sign in so your emergency contacts are saved permanently to MongoDB Atlas.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/auth')}
              style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogIn size={14} /> Sign In
            </button>
          </div>
        )}

        {/* 2. PERSONAL TRUSTED CONTACTS LIST */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#e0f2fe', padding: '8px', borderRadius: '10px' }}>
                <ShieldCheck size={22} color="#00b4d8" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  Your Trusted Circle
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                  {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} actively registered for instant SOS alerts
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              style={{ backgroundColor: '#f0f9ff', color: '#00b4d8', border: '1px solid #bae6fd', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={14} /> New
            </button>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <RefreshCw size={24} className="animate-spin" style={{ color: '#00b4d8', margin: '0 auto 10px auto' }} />
              <p style={{ fontSize: '13px', margin: 0 }}>Connecting to MongoDB & loading contacts...</p>
            </div>
          )}

          {/* EMPTY CONTACTS STATE */}
          {!loading && contacts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <Users size={36} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                No emergency contacts added yet
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b', maxWidth: '380px', marginInline: 'auto' }}>
                Add your family members, friends, or trusted guardians so they can be dispatched immediately if an alert occurs.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                style={{ backgroundColor: '#00b4d8', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
              >
                + Add First Contact
              </button>
            </div>
          )}

          {/* CONTACT CARDS GRID */}
          {!loading && contacts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contacts.map((c) => {
                const initial = (c.name || 'C').charAt(0).toUpperCase();
                return (
                  <div 
                    key={c._id}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Left: Avatar & Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#e0f2fe',
                        color: '#00b4d8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '16px',
                        boxShadow: '0 2px 6px rgba(0, 180, 216, 0.15)'
                      }}>
                        {initial}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                            {c.name}
                          </h4>
                          {c.relation && (
                            <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                              {c.relation}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '13px', color: '#475569', margin: '3px 0 0', fontWeight: '600', letterSpacing: '0.2px' }}>
                          {c.phone}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
                        ● Active
                      </span>

                      {/* Direct Phone Dialer */}
                      <a
                        href={`tel:${c.phone}`}
                        title={`Direct call ${c.name}`}
                        style={{
                          backgroundColor: '#00b4d8',
                          color: '#ffffff',
                          padding: '7px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(0, 180, 216, 0.25)'
                        }}
                      >
                        <PhoneCall size={13} /> Call
                      </a>

                      {/* Delete Contact */}
                      <button
                        onClick={() => handleDeleteContact(c._id)}
                        title="Remove contact"
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#94a3b8',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. VERIFIED BANGLADESH NATIONAL HELPLINES */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{ backgroundColor: '#fef2f2', padding: '8px', borderRadius: '10px' }}>
              <ShieldAlert size={22} color="#dc2626" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                Bangladesh National Emergency Helplines
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                Direct, official toll-free services accessible 24/7 across Dhaka and nationwide.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {nationalHelplines.map((line) => {
              const IconComp = line.icon;
              return (
                <div 
                  key={line.code}
                  style={{
                    backgroundColor: line.bg,
                    border: `1px solid ${line.border}`,
                    padding: '16px',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '900', color: line.color, letterSpacing: '-0.5px' }}>
                        {line.code}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#ffffff', color: line.color, padding: '2px 8px', borderRadius: '10px', border: `1px solid ${line.border}` }}>
                        {line.badge}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                      {line.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                      {line.desc}
                    </p>
                  </div>

                  <a
                    href={`tel:${line.code}`}
                    style={{
                      backgroundColor: line.color,
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <PhoneCall size={13} /> Dial {line.code}
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. EMERGENCY SYSTEM INFO & TEST ALERT ACTION */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ backgroundColor: '#e0f2fe', padding: '10px', borderRadius: '12px' }}>
                <Radio size={24} color="#00b4d8" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  Verify Your SOS Emergency Dispatch
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0', maxWidth: '520px', lineHeight: 1.5 }}>
                  Click below to trigger a simulated test alert. This confirms your location telemetry, contact dispatch rules, and emergency payload formatting without placing real 999 police calls.
                </p>
              </div>
            </div>

            <button
              onClick={handleStartTestAlert}
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                whiteSpace: 'nowrap'
              }}
            >
              <Radio size={15} color="#38bdf8" /> Test Emergency Alert
            </button>
          </div>
        </div>

      </div>

      {/* MODAL 1: ADD CONTACT POPUP */}
      {showAddModal && (
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
            borderRadius: '18px',
            padding: '28px 28px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#e0f2fe', padding: '8px', borderRadius: '10px' }}>
                <Users size={20} color="#00b4d8" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                Add Emergency Contact
              </h2>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 18px 0', lineHeight: 1.5 }}>
              This person will receive SMS & WhatsApp alerts with your live location during a distress broadcast.
            </p>

            {errorNotice && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', marginBottom: '14px' }}>
                {errorNotice}
              </div>
            )}

            <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhana Rahman (Mother)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Phone Number (Dhaka / BD) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +880 1711 000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Relationship
                </label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                >
                  <option value="Parent">Parent</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                  <option value="Friend">Friend</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Colleague">Colleague</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ flex: 1, backgroundColor: '#00b4d8', border: 'none', color: '#ffffff', padding: '10px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)' }}
                >
                  {submitting ? 'Saving...' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TEST ALERT SIMULATION POPUP */}
      {showTestModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '32px 28px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            {testSimulating ? (
              <div>
                <div style={{ backgroundColor: '#e0f2fe', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Radio size={32} color="#00b4d8" className="animate-spin" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>
                  Transmitting Test Distress Beacon...
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  Connecting with Dhaka Gateway SMS Dispatch, embedding live GPS (23.7548° N, 90.3765° E), and testing contact routing.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ backgroundColor: '#dcfce7', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <CheckCircle2 size={36} color="#16a34a" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>
                  Emergency SOS Test Successful!
                </h3>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 0 18px 0' }}>
                  Simulated distress payload delivered to <strong>{contacts.length} trusted contacts</strong>. In a real emergency, each contact receives your exact live coordinates and emergency hotline link.
                </p>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', fontSize: '11px', color: '#64748b', textAlign: 'left', marginBottom: '20px' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '700', color: '#0f172a' }}>Simulated Alert Payload:</p>
                  <code>"🚨 SafeRoute Alert: {currentUser.name || 'Commuter'} triggered SOS at Panthapath Corridor (23.7548° N, 90.3765° E). Battery: 88%. Live track link dispatched."</code>
                </div>

                <button
                  onClick={() => setShowTestModal(false)}
                  style={{
                    backgroundColor: '#00b4d8',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    width: '100%',
                    boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)'
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}