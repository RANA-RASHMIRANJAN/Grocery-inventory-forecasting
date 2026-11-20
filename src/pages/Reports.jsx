import React from 'react';
import { Download, FileText } from 'lucide-react';
import { SalesChart } from '../components/charts/SalesChart';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { useInventoryData } from '../context/InventoryDataContext';

export const Reports = () => {
  const { products, sales } = useInventoryData();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h2>
          <p className="text-xs text-slate-500 font-medium">Demo charts and report layouts; export is not connected</p>
        </div>

        <button
          type="button"
          disabled
          title="Report export will be connected in a later frontend integration step."
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-500 rounded-xl text-xs font-bold shadow-sm cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Export Not Connected</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalesChart sales={sales} />
        <CategoryBarChart products={products} />
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Standard Report Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <FileText className="w-4 h-4 text-brand-600" />
              Monthly Sales Audit
            </div>
            <p className="text-slate-500 text-[11px]">Breakdown of payment channels and item velocities.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <FileText className="w-4 h-4 text-sky-600" />
              Stock Expiry & Spoilage
            </div>
            <p className="text-slate-500 text-[11px]">Perishable produce inventory turnaround tracking.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <FileText className="w-4 h-4 text-purple-600" />
              Supplier Performance
            </div>
            <p className="text-slate-500 text-[11px]">Lead time and fulfillment accuracy review.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
