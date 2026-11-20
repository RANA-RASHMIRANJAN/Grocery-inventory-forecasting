import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Store, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { continueInDemoMode } = useAuth();

  const handleDemoAccess = () => {
    continueInDemoMode();
    navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white shadow-xl shadow-brand-500/30 mb-3">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">SmartGrocery <span className="text-brand-600">AI</span></h1>
          <p className="text-xs text-slate-500 mt-1 font-medium max-w-xs mx-auto">Smart System for Grocery Store Inventory Demand Forecasting Using Machine Learning</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            B.Tech Major Project · Frontend Prototype
          </div>
        </div>

        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl text-center">
          <strong>Temporary development/demo access</strong>
          <p className="mt-1">Opens the frontend prototype only. No account, password, or server authentication is used.</p>
        </div>

        <button
          type="button"
          onClick={handleDemoAccess}
          className="w-full mt-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Continue in Demo Mode</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">Real sign-in will be connected when the Spring Boot authentication service is ready.</p>
        </div>

        <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 text-center">
          <p className="font-semibold text-slate-700 flex items-center justify-center gap-1"><UserCheck className="w-3.5 h-3.5 text-brand-600" /> Demo access only</p>
          <p className="text-[10px] text-slate-400 mt-0.5">No credentials are stored or displayed</p>
        </div>
      </div>
    </div>
  );
};
