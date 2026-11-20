import React, { useState } from 'react';
import { Settings as SettingsIcon, Store, Shield, Bell, Check } from 'lucide-react';

export const Settings = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-500 font-medium">Configure store parameters, currency, and presentation details</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Settings preferences saved (UI state).
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6 text-xs">
        <div>
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-600" /> Store Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                defaultValue="Smart Supermart (Branch #1)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                defaultValue="₹ (INR)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        <div>
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600" /> Project Metadata
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-bold block">PROJECT TOPIC</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                Smart System for Grocery Store Inventory Demand Forecasting Using Machine Learning
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-bold block">CURRENT PHASE & MILESTONE</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                Phase 1 Prototype (~35% Frontend UI Scope) • Role: Frontend Developer
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
