import React, { useState } from 'react';
import { Navigation, ShieldCheck, AlertTriangle, MapPin, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoutePlanner() {
  const [selectedRoute, setSelectedRoute] = useState(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-96 p-6 bg-slate-900 border-r border-slate-800 flex flex-col gap-6">
        <Link to="/dashboard" className="text-xs text-slate-400 hover:text-white">← Back to Dashboard</Link>
        <div>
          <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7" /> Route Planner
          </h1>
          <p className="text-slate-400 text-xs mt-1">Find lighting-optimized travel paths[cite: 1]</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center bg-slate-950 rounded-xl px-3 py-2.5 border border-slate-800">
            <MapPin className="w-5 h-5 text-emerald-400 mr-2" />
            <input type="text" defaultValue="AUST Campus Gate 1" className="bg-transparent border-none focus:outline-none text-sm w-full text-white" />
          </div>
          <div className="flex items-center bg-slate-950 rounded-xl px-3 py-2.5 border border-slate-800">
            <Navigation className="w-5 h-5 text-indigo-400 mr-2" />
            <input type="text" placeholder="Enter Destination..." className="bg-transparent border-none focus:outline-none text-sm w-full text-white" />
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <h2 className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Suggested Routes</h2>
          
          <div 
            onClick={() => setSelectedRoute(1)}
            className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedRoute === 1 ? 'border-emerald-500 bg-slate-800' : 'border-slate-800 bg-slate-950'}`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm text-white">Via Main Avenue</h3>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">95% Safe</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">12 min (1.1 km) • Well Lit • CCTV Covered</p>
          </div>

          <div 
            onClick={() => setSelectedRoute(2)}
            className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedRoute === 2 ? 'border-amber-500 bg-slate-800' : 'border-slate-800 bg-slate-950'}`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm text-white">Via Back Alley</h3>
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">52% Safe</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">8 min (0.7 km) • Poor Lighting</p>
            <div className="flex items-center gap-1 text-xs text-amber-400 mt-2">
              <AlertTriangle className="w-3.5 h-3.5" /> 2 dark spot reports
            </div>
          </div>
        </div>

        <Link to="/tracking" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Share2 className="w-5 h-5" /> Start Journey
        </Link>
      </aside>

      <main className="flex-1 bg-slate-950 flex items-center justify-center p-6 border-l border-slate-900">
        <div className="text-center text-slate-600">
          <MapPin className="w-12 h-12 mx-auto mb-2 text-slate-700 animate-bounce" />
          <p className="text-sm">Interactive Map View Placeholder</p>
        </div>
      </main>
    </div>
  );
}