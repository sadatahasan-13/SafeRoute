import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, MapPin, Camera, X, Image as ImageIcon, 
  CheckCircle2, Loader2, LogIn, AlertCircle 
} from 'lucide-react';

export default function ReportIncident() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [hazardType, setHazardType] = useState('Poor Lighting');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5 MB.');
        return;
      }
      setError('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('You must be signed in to submit a hazard report. Please sign in first.');
      return;
    }

    if (!location.trim()) {
      setError('Please provide a location for this hazard report.');
      return;
    }

    setLoading(true);
    setError('');
    setSent(false);

    let user = {};
    try {
      user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {}

    try {
      const formData = new FormData();
      formData.append('hazardType', hazardType);
      formData.append('location', location);
      formData.append('description', description);
      if (user.name) {
        formData.append('reporterName', user.name);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit incident report');
      }

      setSent(true);
      setDescription('');
      handleRemoveImage();
    } catch (err) {
      setError(err.message || 'Error submitting report. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* HEADER SECTION */}
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
            Report an Unsafe Area
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
            Help other night commuters by reporting road hazards, unlit streets, and safety issues with photos.
          </p>
        </div>

        {/* UNAUTHENTICATED NOTICE */}
        {!token && (
          <div style={{ backgroundColor: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#dbeafe', padding: '10px', borderRadius: '12px' }}>
                <AlertCircle size={22} color="#2563eb" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e40af' }}>
                  Sign in required to report hazards
                </h4>
                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#3b82f6' }}>
                  You are currently signed out. You must be signed in to submit community road hazard reports and upload photo evidence.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/auth')}
              style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)' }}
            >
              <LogIn size={14} /> Sign In to Report
            </button>
          </div>
        )}

        {/* FORM CARD */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Error Message */}
          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', color: '#b91c1c', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Hazard Type */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '8px' }}>
              WHAT HAPPENED?
            </label>
            <select 
              value={hazardType}
              onChange={(e) => setHazardType(e.target.value)}
              style={{ width: '100%', backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '12px', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
            >
              <option value="Poor Lighting">Poor Lighting</option>
              <option value="Suspicious Activity">Suspicious Activity</option>
              <option value="Unsafe Road">Unsafe Road</option>
              <option value="Harassment">Harassment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '8px' }}>
              LOCATION (DHAKA)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', padding: '10px 14px', borderRadius: '12px' }}>
              <MapPin size={18} style={{ color: '#00b4d8', flexShrink: 0 }} />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dhanmondi 27 / Farmgate Overbridge"
                style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '14px', color: '#0f172a' }}
              />
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '8px' }}>
              ADDITIONAL DETAILS
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the hazard (e.g. Broken lampposts, empty dark alley, waterlogged sidewalk)..."
              style={{ width: '100%', backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', padding: '12px 14px', borderRadius: '12px', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/jpg,image/webp"
            style={{ display: 'none' }}
          />

          {/* Image Upload Button or Preview */}
          {!imagePreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', backgroundColor: '#f0f9ff', border: '1.5px dashed #00b4d8', color: '#0284c7', padding: '14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease' }}
            >
              <Camera size={18} style={{ color: '#00b4d8' }} />
              Add Photo of Hazard (Cloudinary Upload)
            </button>
          ) : (
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '14px', padding: '12px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                <img 
                  src={imagePreview} 
                  alt="Hazard preview" 
                  style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                />
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {imageFile?.name}
                  </p>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {(imageFile?.size / 1024).toFixed(1)} KB &bull; Ready for Cloudinary
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: '600', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {!token ? (
            <button
              type="button"
              onClick={() => navigate('/auth')}
              style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
            >
              <LogIn size={18} color="#38bdf8" /> Sign In to Submit Report
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: loading ? '#94a3b8' : '#00b4d8', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(0, 180, 216, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Uploading to Cloudinary & Saving...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          )}

          {/* Success Notification */}
          {sent && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 18px', color: '#16a34a', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} />
                <span style={{ fontWeight: '700' }}>Thank you! Your road safety report and photo have been uploaded to Cloudinary & database!</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/feed')}
                style={{ alignSelf: 'flex-start', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' }}
              >
                View on Community Safety Feed &rarr;
              </button>
            </div>
          )}

        </form>

        {/* DISCLAIMER BOX */}
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '16px 20px', borderRadius: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <AlertTriangle style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} size={18} />
          <p style={{ fontSize: '13px', color: '#92400e', margin: 0, lineHeight: 1.5 }}>
            Please only report genuine safety concerns. Your photos and reports directly alert commuters on the live route map and safety feed.
          </p>
        </div>

      </div>
    </div>
  );
}