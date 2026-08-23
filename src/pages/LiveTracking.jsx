import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Navigation, Phone, CheckCircle } from 'lucide-react';

export default function LiveTracking() {
  const [sosActive, setSosActive] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Navigation className="text-emerald-400" /> Active Trip Tracking
          </h1>
          <p className="text-slate-400 text-xs mt-1">Destination: Hostel Block B • ETA: 12 mins</p>
        </div>
        <Link to="/dashboard" className="text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 px-3 py-2 rounded-xl text-slate-300">
          End Navigation
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl h-64 flex items-center justify-center text-center p-6 relative">
        <div className="space-y-2">
          <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping mx-auto" />
          <p className="text-xs text-slate-400">Live GPS broadcasting location to emergency network</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4">
        {sosActive ? (
          <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-xl space-y-3">
            <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto animate-bounce" />
            <h2 className="text-lg font-bold text-rose-400">SOS ALERT ACTIVATED</h2>
            <p className="text-xs text-slate-400">Emergency contacts and campus security notified with your exact coordinates.</p>
            <button onClick={() => setSosActive(false)} className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-4 py-2 rounded-lg">
              Cancel False Alarm
            </button>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => setSosActive(true)}
              className="w-32 h-32 bg-rose-600 hover:bg-rose-700 text-white font-black text-xl rounded-full shadow-2xl border-4 border-rose-900 mx-auto flex items-center justify-center transition-transform active:scale-95"
            >
              PRESS SOS
            </button>
            <p className="text-xs text-slate-400 mt-3">Tap to instantly alert your emergency network</p>
          </div>
        )}
      </div>
    </div>
  );
}