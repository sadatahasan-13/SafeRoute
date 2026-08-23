import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Users, AlertTriangle } from 'lucide-react';

export default function Tracking() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-6xl mx-auto space-y-6">

      <nav className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <h2 className="font-bold text-emerald-400">SafeRoute</h2>

        <div className="flex gap-5 text-xs text-slate-400">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/planner">Route Planner</Link>
          <Link to="/tracking" className="text-white">Live Tracking</Link>
          <Link to="/report">Report</Link>
          <Link to="/contacts">Contacts</Link>
        </div>
      </nav>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Live Journey</h1>
          <p className="text-xs text-slate-400 mt-1">
            Keep an eye on your journey while travelling.
          </p>
        </div>

        <span className="text-emerald-400 text-xs bg-emerald-500/10 px-3 py-2 rounded-xl">
          ● Journey Active
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        <div className="h-72 bg-slate-800 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto text-emerald-400 mb-3" size={35} />
            <p className="text-sm">Live Map</p>
            <p className="text-xs text-slate-500">
              Current Location → Home
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 text-center p-5">

          <div>
            <p className="text-xs text-slate-500">Distance Left</p>
            <p className="font-bold mt-1">2.3 km</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Estimated Time</p>
            <p className="font-bold mt-1">12 min</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Safety Score</p>
            <p className="font-bold text-emerald-400 mt-1">90%</p>
          </div>

        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <Users className="text-indigo-400 mb-3" />

          <h3 className="font-bold text-sm">Location Sharing</h3>

          <p className="text-xs text-slate-400 mt-1">
            Your trusted contacts can follow your journey.
          </p>

          <div className="mt-4 space-y-2 text-xs">
            <p className="text-emerald-400">● Mom — Online</p>
            <p className="text-emerald-400">● Rahim — Online</p>
          </div>
        </div>

        <div className="bg-rose-950/30 border border-rose-900 p-5 rounded-2xl">

          <AlertTriangle className="text-rose-400 mb-3" />

          <h3 className="font-bold text-sm">Emergency?</h3>

          <p className="text-xs text-slate-400 mt-1">
            Send your live location to your emergency contacts.
          </p>

          <button
            onClick={() => alert("SOS alert sent!")}
            className="w-full mt-4 bg-rose-600 hover:bg-rose-700 py-2 rounded-xl text-xs font-bold"
          >
            SEND SOS
          </button>

        </div>

      </div>

    </div>
  );
}