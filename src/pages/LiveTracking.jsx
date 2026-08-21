import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Share2, PhoneCall, CheckCircle } from 'lucide-react';

export default function LiveTracking() {
  const [sosActive, setSosActive] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <ShieldCheck className="w-6 h-6" /> Live Tracking Active[cite: 1]
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
          <span className="text-xs text-emerald-400 font-semibold">Broadcasting Location</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Map Placeholder */}
        <main className="flex-1 bg-slate-950 flex items-center justify-center p-6 border-r border-slate-900">
          <p className="text-slate-600 text-sm">Real-time GPS Tracking Map View</p>
        </main>

        {/* Live Controls */}
        <aside className="w-full md:w-96 p-6 bg-slate-900 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Journey Status</h2>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Destination: East Hostel
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Shared with 2 Emergency Contacts[cite: 1]
              </div>
            </div>

            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-sm">
              <Share2 className="w-4 h-4" /> Copy Share Link[cite: 1]
            </button>
          </div>

          {/* Emergency SOS Trigger */}
          <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl text-center space-y-4">
            <h3 className="text-sm font-bold text-rose-400">Emergency Response</h3>
            <button 
              onClick={() => setSosActive(!sosActive)}
              className={`w-28 h-28 rounded-full font-extrabold mx-auto shadow-lg flex flex-col items-center justify-center transition-all ${
                sosActive ? 'bg-rose-700 animate-pulse text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <AlertCircle className="w-8 h-8 mb-1" />
              <span className="text-xs">{sosActive ? 'ALERT SENT' : 'PRESS SOS'}</span>
            </button>
            <p className="text-xs text-slate-400">Sends live coordinates to contacts instantly[cite: 1].</p>
          </div>
        </aside>
      </div>
    </div>
  );
}