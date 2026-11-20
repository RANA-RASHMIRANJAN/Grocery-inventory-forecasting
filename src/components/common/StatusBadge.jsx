import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status?.toLowerCase()) {
      case 'in stock':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';
      case 'low stock':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20';
      case 'out of stock':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20';
      case 'overstock':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/20';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-600/20';
    }
  };

  const getDot = () => {
    switch (status?.toLowerCase()) {
      case 'in stock':
        return 'bg-emerald-500';
      case 'low stock':
        return 'bg-amber-500 animate-pulse';
      case 'out of stock':
        return 'bg-rose-500';
      case 'overstock':
        return 'bg-purple-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ring-inset ${getStyle()}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDot()}`}></span>
      {status || 'Unknown'}
    </span>
  );
};
