import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, ThumbsUp, AlertCircle, MessageSquare, PlusCircle, 
  MapPin, Image as ImageIcon, Trash2, RefreshCw, Send, 
  Search, CheckCircle2, Clock, Filter, AlertTriangle, LogIn, X
} from 'lucide-react';

export default function SafetyFeed() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommentReportId, setActiveCommentReportId] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});
  const [dbConnected, setDbConnected] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Current logged in user
  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {}

  const fetchReports = async () => {
    try {
      setRefreshing(true);
      setRefreshSuccess(false);
      // Ensure at least 600ms so user visibly sees the refresh spinner
      const minDelay = new Promise((resolve) => setTimeout(resolve, 600));
      const fetchReq = fetch('http://localhost:5000/api/reports').then((res) => res.json());

      const [, data] = await Promise.all([minDelay, fetchReq]);

      if (data.success && Array.isArray(data.data)) {
        setReports(data.data);
        setDbConnected(true);
        setRefreshSuccess(true);
        setTimeout(() => setRefreshSuccess(false), 2500);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error('Failed to fetch live reports from backend:', err);
      setDbConnected(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle Upvote / Confirm
  const handleVote = async (id) => {
    // Optimistic UI update
    setReports(prev => prev.map(item => item._id === id ? { ...item, votes: (item.votes || 0) + 1 } : item));

    try {
      await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upvote: true })
      });
    } catch (err) {
      console.error('Vote failed to persist:', err);
    }
  };

  // Handle Comment Submission
  const handleAddComment = async (reportId) => {
    const text = commentText[reportId]?.trim();
    if (!text) return;

    setSubmittingComment(prev => ({ ...prev, [reportId]: true }));
    const author = currentUser.name || 'Anonymous Commuter';

    try {
      const res = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          comment: text,
          user: author 
        })
      });
      const result = await res.json();
      if (result.success && result.data) {
        setReports(prev => prev.map(item => item._id === reportId ? result.data : item));
        setCommentText(prev => ({ ...prev, [reportId]: '' }));
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmittingComment(prev => ({ ...prev, [reportId]: false }));
    }
  };

  // Handle Delete Report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to remove this incident report?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setReports(prev => prev.filter(item => item._id !== reportId));
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60));
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  // Check auth before reporting
  const handleReportClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    navigate('/report');
  };

  // Categories for filtering
  const categories = ['All', 'Poor Lighting', 'Unsafe Road', 'Suspicious Activity', 'Harassment', 'Other'];

  // Filtered reports
  const filteredReports = reports.filter(item => {
    const matchCategory = selectedCategory === 'All' || item.hazardType === selectedCategory;
    const matchSearch = searchQuery === '' || 
      item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporterName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>

        {/* TOP HEADER WITH REAL-TIME STATUS & ACTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, color: '#0f172a', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={32} style={{ color: '#00b4d8' }} /> Community Safety Feed
              </h1>
              {dbConnected ? (
                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
                  MongoDB Live ({reports.length})
                </span>
              ) : (
                <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' }}>
                  Connecting...
                </span>
              )}
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '6px 0 0' }}>
              Real-time crowd-sourced road hazards, lighting reports, and Cloudinary photo evidence from commuters in Dhaka.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={fetchReports}
              disabled={refreshing}
              title="Refresh feed from database"
              style={{ 
                backgroundColor: refreshSuccess ? '#f0fdf4' : '#ffffff', 
                border: refreshSuccess ? '1.5px solid #22c55e' : '1px solid #cbd5e1', 
                padding: '10px 14px', 
                borderRadius: '10px', 
                color: refreshSuccess ? '#15803d' : '#475569', 
                cursor: refreshing ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '13px', 
                fontWeight: '700',
                transition: 'all 0.25s ease',
                boxShadow: refreshSuccess ? '0 0 10px rgba(34, 197, 94, 0.15)' : 'none'
              }}
            >
              {refreshSuccess ? (
                <>
                  <CheckCircle2 size={15} color="#15803d" />
                  Refreshed!
                </>
              ) : (
                <>
                  <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} style={{ color: refreshing ? '#00b4d8' : '#64748b' }} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </>
              )}
            </button>

            {/* KEEP REPORT HAZARD OPTION */}
            <button 
              onClick={handleReportClick}
              style={{ backgroundColor: '#00b4d8', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(0, 180, 216, 0.35)', transition: 'background 0.2s ease' }}
            >
              <PlusCircle size={17} /> Report Hazard
            </button>
          </div>
        </div>

        {/* SEARCH AND CATEGORY FILTER BAR */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by location, keyword, or commuter..."
              style={{ width: '100%', padding: '10px 14px 10px 40px', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
              <Filter size={13} /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: selectedCategory === cat ? '1px solid #00b4d8' : '1px solid #e2e8f0',
                  backgroundColor: selectedCategory === cat ? '#f0f9ff' : '#ffffff',
                  color: selectedCategory === cat ? '#00b4d8' : '#475569',
                  fontSize: '12px',
                  fontWeight: selectedCategory === cat ? '800' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING SKELETON STATE */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <RefreshCw size={28} className="animate-spin" style={{ color: '#00b4d8', margin: '0 auto 12px auto' }} />
            <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>Connecting to MongoDB backend & loading incident reports...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredReports.length === 0 && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '48px 24px', textAlign: 'center' }}>
            <AlertTriangle size={36} color="#00b4d8" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>No reports match your filter</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>Try clearing your search query or submit a new hazard report.</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              style={{ backgroundColor: '#f0f9ff', color: '#00b4d8', border: '1px solid #bae6fd', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* REPORT CARDS FEED LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredReports.map((item) => (
            <div 
              key={item._id} 
              style={{ 
                backgroundColor: '#ffffff', 
                padding: '24px', 
                borderRadius: '18px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s ease'
              }}
            >
              
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {item.reporterName || 'Anonymous Commuter'}
                    </span>
                    <span style={{ color: '#cbd5e1' }}>&bull;</span>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> {formatTime(item.createdAt)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={18} color="#00b4d8" /> {item.location}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    backgroundColor: item.verified ? '#dcfce7' : '#fef3c7', 
                    color: item.verified ? '#15803d' : '#b45309', 
                    fontSize: '11px', 
                    fontWeight: '800', 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px' 
                  }}>
                    {item.verified ? <><ShieldCheck size={13} /> Verified SafeRoute</> : 'Community Report'}
                  </span>

                  {/* Delete Option */}
                  <button
                    onClick={() => handleDeleteReport(item._id)}
                    title="Delete this report"
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={15} style={{ transition: 'color 0.2s' }} />
                  </button>
                </div>
              </div>

              {/* Hazard Type Badge & Description */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '12px', fontWeight: '800', padding: '3px 10px', borderRadius: '6px', marginBottom: '8px' }}>
                  {item.hazardType || 'Safety Hazard'}
                </span>
                {item.description && (
                  <p style={{ fontSize: '14px', color: '#334155', margin: '4px 0 0', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                )}
              </div>

              {/* Uploaded Photo Display (Hosted on Cloudinary) */}
              {item.image && item.image.url && (
                <div style={{ marginBottom: '16px', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#0f172a' }}>
                  <img 
                    src={item.image.url} 
                    alt={`Hazard at ${item.location}`} 
                    style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div style={{ padding: '8px 14px', fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <ImageIcon size={13} color="#00b4d8" /> Verified photo evidence stored on Cloudinary
                    </span>
                    <a 
                      href={item.image.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#00b4d8', textDecoration: 'none', fontWeight: '700' }}
                    >
                      View Full Size &rarr;
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons: Confirm & Discussion */}
              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <button 
                  onClick={() => handleVote(item._id)}
                  style={{ 
                    backgroundColor: '#f0f9ff', 
                    border: '1px solid #bae6fd', 
                    padding: '8px 16px', 
                    borderRadius: '10px', 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: '#0284c7', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ThumbsUp size={15} /> Confirm Hazard ({item.votes || 0})
                </button>

                <button 
                  onClick={() => setActiveCommentReportId(activeCommentReportId === item._id ? null : item._id)}
                  style={{ 
                    backgroundColor: activeCommentReportId === item._id ? '#f1f5f9' : '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    padding: '8px 16px', 
                    borderRadius: '10px', 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: '#475569', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}
                >
                  <MessageSquare size={15} /> Discussion ({item.comments?.length || 0})
                </button>
              </div>

              {/* EXPANDABLE DISCUSSION THREAD */}
              {activeCommentReportId === item._id && (
                <div style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '14px' }}>
                  
                  {/* Existing Comments */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                    {item.comments && item.comments.length > 0 ? (
                      item.comments.map((c, i) => (
                        <div key={i} style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#334155' }}>{c.user}</span>
                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>{formatTime(c.createdAt)}</span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{c.text}</p>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No comments yet. Start the discussion below.</p>
                    )}
                  </div>

                  {/* Add New Comment Form */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text"
                      value={commentText[item._id] || ''}
                      onChange={(e) => setCommentText(prev => ({ ...prev, [item._id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(item._id); }}
                      placeholder="Add an update or comment (e.g. Police reached, lighting restored)..."
                      style={{ flexGrow: 1, padding: '10px 14px', backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none', color: '#0f172a' }}
                    />
                    <button
                      onClick={() => handleAddComment(item._id)}
                      disabled={submittingComment[item._id]}
                      style={{ backgroundColor: '#00b4d8', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Send size={14} /> {submittingComment[item._id] ? 'Posting...' : 'Post'}
                    </button>
                  </div>

                </div>
              )}

            </div>
          ))}
        </div>

      </div>

      {/* SIGN IN REQUIRED MODAL */}
      {showAuthModal && (
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
            padding: '32px 28px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowAuthModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={18} />
            </button>

            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <LogIn size={28} color="#00b4d8" />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>
              Sign In Required to Report
            </h3>

            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              You must be signed in to submit a safety hazard or upload photo evidence. This ensures all community reports are authentic and verified.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowAuthModal(false)}
                style={{ flex: 1, backgroundColor: '#f1f5f9', border: '1.5px solid #cbd5e1', color: '#475569', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => navigate('/auth')}
                style={{ flex: 1, backgroundColor: '#00b4d8', border: 'none', color: '#ffffff', padding: '10px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)' }}
              >
                <LogIn size={15} /> Sign In Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}