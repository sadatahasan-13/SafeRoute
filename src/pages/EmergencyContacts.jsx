import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Phone, Plus, ShieldCheck } from 'lucide-react';

export default function Contacts() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-6xl mx-auto space-y-6">

      <nav className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <h2 className="font-bold text-emerald-400">SafeRoute</h2>

        <div className="flex gap-5 text-xs text-slate-400">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/planner">Route Planner</Link>
          <Link to="/tracking">Live Tracking</Link>
          <Link to="/report">Report</Link>
          <Link to="/contacts" className="text-white">Contacts</Link>
        </div>
      </nav>

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">Emergency Contacts</h1>
          <p className="text-xs text-slate-400 mt-1">
            People who can receive your emergency alerts.
          </p>
        </div>

        <button className="bg-emerald-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
          <Plus size={14} />
          Add Contact
        </button>

      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">

        <div className="flex items-center gap-3 mb-5">
          <ShieldCheck className="text-emerald-400" />

          <div>
            <h3 className="font-bold text-sm">
              Your Emergency Network
            </h3>

            <p className="text-xs text-slate-500">
              2 trusted contacts connected
            </p>
          </div>
        </div>

        <div className="space-y-3">

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center">

            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              M
            </div>

            <div className="ml-3 flex-1">
              <h3 className="text-sm font-bold">Mom</h3>
              <p className="text-xs text-slate-500">
                +880 17XX XXX XXX
              </p>
            </div>

            <span className="text-emerald-400 text-xs">
              ● Active
            </span>

          </div>


          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center">

            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              R
            </div>

            <div className="ml-3 flex-1">
              <h3 className="text-sm font-bold">Rahim</h3>
              <p className="text-xs text-slate-500">
                +880 18XX XXX XXX
              </p>
            </div>

            <span className="text-emerald-400 text-xs">
              ● Active
            </span>

          </div>

        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">

        <div className="flex items-center gap-3">
          <Users className="text-indigo-400" />

          <div>
            <h3 className="font-bold text-sm">
              How Emergency Alerts Work
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              When you press SOS, these contacts receive your
              location and emergency notification.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Test alert sent to your contacts.")}
          className="mt-5 border border-slate-700 px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Phone size={14} />
          Test Emergency Alert
        </button>

      </div>

    </div>
  );
}
