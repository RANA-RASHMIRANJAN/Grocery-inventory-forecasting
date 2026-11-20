import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Plus, Calendar } from 'lucide-react';
import { useInventoryData } from '../../context/InventoryDataContext';
import { getStockAlerts } from '../../domain/stockAlerts';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState('');
  const { products } = useInventoryData();
  const alertCount = getStockAlerts(products).length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      );
    };
    updateTime();
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Store Overview';
    if (path.includes('/products')) return 'Product Inventory Catalog';
    if (path.includes('/add-product')) return 'New Product Entry';
    if (path.includes('/inventory')) return 'Real-Time Stock Monitoring';
    if (path.includes('/sales')) return 'Daily Sales & Invoicing';
    if (path.includes('/forecast')) return 'ML Demand Forecasting';
    if (path.includes('/reports')) return 'Store Analytics & Reports';
    if (path.includes('/settings')) return 'System Settings';
    return 'Dashboard';
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Page Title & Status */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">{getPageTitle()}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Demo Store System
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {currentDate}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog, SKU, invoice..."
            className="w-64 pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Add Product CTA */}
        <button
          onClick={() => navigate('/add-product')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all duration-150 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => navigate('/alerts')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
            title={`${alertCount} stock alerts`}
            aria-label={`View ${alertCount} stock alerts`}
          >
            <Bell className="w-4 h-4" />
            {alertCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>}
          </button>
        </div>

        {/* Academic Role Pill */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
          <div className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200">
            Role: <span className="text-brand-600">Frontend UI</span>
          </div>
        </div>
      </div>
    </header>
  );
};
