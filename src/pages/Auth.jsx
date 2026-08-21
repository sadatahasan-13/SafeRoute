import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-center gap-2 text-emerald-400 text-2xl font-bold mb-6">
          <ShieldCheck className="w-8 h-8" /> SafeRoute
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
          <button 
            onClick={() => setIsLogin(true)} 
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs text-slate-400">Full Name</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 mt-1">
                <User className="w-4 h-4 text-slate-500 mr-2" />
                <input type="text" placeholder="John Doe" required className="bg-transparent border-none focus:outline-none text-sm w-full text-white" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400">Email Address</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 mt-1">
              <Mail className="w-4 h-4 text-slate-500 mr-2" />
              <input type="email" placeholder="name@domain.com" required className="bg-transparent border-none focus:outline-none text-sm w-full text-white" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400">Password</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 mt-1">
              <Lock className="w-4 h-4 text-slate-500 mr-2" />
              <input type="password" placeholder="••••••••" required className="bg-transparent border-none focus:outline-none text-sm w-full text-white" />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs text-slate-400">Emergency Phone</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 mt-1">
                <Phone className="w-4 h-4 text-slate-500 mr-2" />
                <input type="tel" placeholder="+8801700000000" required className="bg-transparent border-none focus:outline-none text-sm w-full text-white" />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition-colors mt-2">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}