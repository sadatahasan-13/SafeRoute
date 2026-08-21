import React from 'react';
import { ShieldCheck, MapPin, AlertTriangle, Users, Navigation, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 text-xl font-bold">
          <ShieldCheck className="w-7 h-7" /> SafeRoute
        </div>
        <div className="flex gap-4">
          <Link to="/auth" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">Sign In</Link>
          <Link to="/auth" className="px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl transition-all">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center px-6 py-20">
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
          Night-Time Commute Safety
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 text-white leading-tight">
          Navigate Night Travel with <span className="text-emerald-400">Confidence & Peace of Mind</span>
        </h1>
        <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
          Choose well-lit routes, share live tracking with emergency contacts, and send instant SOS alerts when you need help most[cite: 1].
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Link to="/planner" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl flex items-center gap-2">
            Plan Safe Route <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/auth" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700">
            Join Community
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-20">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <Navigation className="w-10 h-10 text-emerald-400 mb-4" />
          <h3 className="text-lg font-bold text-white">Safe Route Suggestions</h3>
          <p className="text-slate-400 text-sm mt-2">Routes optimized for street lighting quality and community safety ratings[cite: 1].</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <Users className="w-10 h-10 text-indigo-400 mb-4" />
          <h3 className="text-lg font-bold text-white">Live Journey Sharing</h3>
          <p className="text-slate-400 text-sm mt-2">Share real-time tracking links directly with trusted friends and family[cite: 1].</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <AlertTriangle className="w-10 h-10 text-rose-400 mb-4" />
          <h3 className="text-lg font-bold text-white">One-Tap SOS Alert</h3>
          <p className="text-slate-400 text-sm mt-2">Instantly broadcast your exact GPS location to emergency contacts with a single tap[cite: 1].</p>
        </div>
      </section>
    </div>
  );
}