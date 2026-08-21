import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, MapPin, AlertTriangle, Users, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: ShieldCheck },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Planner', path: '/planner', icon: MapPin },
    { name: 'Feed', path: '/feed', icon: AlertTriangle },
    { name: 'Contacts', path: '/contacts', icon: Users },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
            <ShieldCheck className="w-7 h-7" />
            <span>SafeRoute</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* CTA / Auth Button */}
          <div className="hidden md:block">
            <Link
              to="/auth"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-xl transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                {link.name}
              </Link>
            );
          })}
          <Link
            to="/auth"
            onClick={() => setIsOpen(false)}
            className="block text-center mt-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-sm rounded-xl"
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}