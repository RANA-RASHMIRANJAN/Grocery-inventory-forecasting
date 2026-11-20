import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, change, isPositive = true, subtitle, icon: Icon, color = 'emerald' }) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'hover:border-emerald-200',
      glow: 'group-hover:shadow-emerald-500/10'
    },
    blue: {
      bg: 'bg-sky-50 text-sky-600',
      border: 'hover:border-sky-200',
      glow: 'group-hover:shadow-sky-500/10'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'hover:border-amber-200',
      glow: 'group-hover:shadow-amber-500/10'
    },
    purple: {
      bg: 'bg-indigo-50 text-indigo-600',
      border: 'hover:border-indigo-200',
      glow: 'group-hover:shadow-indigo-500/10'
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className={`group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-md ${scheme.border} ${scheme.glow}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.bg} transition-transform duration-200 group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        {change && (
          <span className={`inline-flex items-center font-semibold gap-0.5 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {change}
          </span>
        )}
        <span className="text-slate-400 font-medium ml-auto">{subtitle || 'vs last week'}</span>
      </div>
    </div>
  );
};
