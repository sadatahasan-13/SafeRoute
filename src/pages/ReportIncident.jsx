import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Camera } from 'lucide-react';

export default function Report() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-6xl mx-auto space-y-6">

      <nav className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <h2 className="font-bold text-emerald-400">SafeRoute</h2>

        <div className="flex gap-5 text-xs text-slate-400">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/planner">Route Planner</Link>
          <Link to="/tracking">Live Tracking</Link>
          <Link to="/report" className="text-white">Report</Link>
          <Link to="/contacts">Contacts</Link>
        </div>
      </nav>

      <div>
        <h1 className="text-2xl font-bold">Report an Unsafe Area</h1>
        <p className="text-xs text-slate-400 mt-1">
          Help other travellers by reporting problems around you.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">

        <div>
          <label className="text-xs text-slate-400">
            What happened?
          </label>

          <select className="w-full mt-2 bg-slate-950 border border-slate-700 p-3 rounded-xl text-sm">
            <option>Poor Lighting</option>
            <option>Suspicious Activity</option>
            <option>Unsafe Road</option>
            <option>Harassment</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400">
            Location
          </label>

          <div className="flex items-center gap-2 mt-2 bg-slate-950 border border-slate-700 p-3 rounded-xl">
            <MapPin size={16} className="text-emerald-400" />
            <span className="text-sm text-slate-300">
              Current location
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400">
            Additional details
          </label>

          <textarea
            rows="4"
            placeholder="Tell us a little more..."
            className="w-full mt-2 bg-slate-950 border border-slate-700 p-3 rounded-xl text-sm outline-none"
          />
        </div>

        <button className="w-full bg-slate-800 py-3 rounded-xl text-xs flex justify-center items-center gap-2">
          <Camera size={15} />
          Add Photo
        </button>

        <button
          onClick={() => setSent(true)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl text-sm font-bold"
        >
          Submit Report
        </button>

        {sent && (
          <p className="text-center text-emerald-400 text-xs">
            ✓ Thank you. Your report has been submitted.
          </p>
        )}

      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
        <AlertTriangle className="text-amber-400" size={18} />

        <p className="text-xs text-slate-400">
          Please only report genuine safety concerns. Your report helps
          SafeRoute improve safer route suggestions.
        </p>
      </div>

    </div>
  );
}