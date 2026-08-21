import React from 'react';
import { ShieldCheck, MapPin, AlertCircle, Users, Navigation, History } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center max-w-6xl mx-auto pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 text-xl font-bold">
          <ShieldCheck className="w-7 h-7" /> SafeRoute
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Welcome back, User</span>
          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-emerald-400 font-bold">
            U
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <main className="max-w-6xl mx-auto mt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/planner" className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <Navigation className="w-8 h-8 text-emerald-400 mb-3" />
              <h2 className="text-lg font-bold text-white">Start New Journey</h2>
              <p className="text-xs text-slate-400 mt-1">Find well-lit routes with active safety scores[cite: 1].</p>
            </div>
            <span className="text-emerald-400 text-sm font-semibold mt-4 block">Open Planner →</span>
          </Link>

          <Link to="/contacts" className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <div>
              <Users className="w-8 h-8 text-indigo-400 mb-3" />
              <h2 className="text-lg font-bold text-white">Trusted Network</h2>
              <p className="text-xs text-slate-400 mt-1">Manage 3 registered emergency contacts[cite: 1].</p>
            </div>
            <span className="text-indigo-400 text-sm font-semibold mt-4 block">Manage Contacts →</span>
          </Link>

          <Link to="/report" className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <div>
              <AlertCircle className="w-8 h-8 text-amber-400 mb-3" />
              <h2 className="text-lg font-bold text-white">Report Unsafe Spot</h2>
              <p className="text-xs text-slate-400 mt-1">Flag dark alleyways or broken streetlights[cite: 1].</p>
            </div>
            <span className="text-amber-400 text-sm font-semibold mt-4 block">Submit Report →</span>
          </Link>
        </div>

        {/* Recent Activity */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-slate-400" /> Recent Travel History[cite: 1]
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm text-white">Campus Main Gate → East Hostel</p>
                <p className="text-xs text-slate-500">Yesterday at 10:15 PM • Shared with 2 contacts</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg">Completed</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}