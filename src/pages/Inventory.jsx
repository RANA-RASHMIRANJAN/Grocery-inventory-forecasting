import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useInventoryData } from '../context/InventoryDataContext';
import { getProductStockStatus, getStockAlerts } from '../domain/stockAlerts';

export const Inventory = () => {
  const { products, restockProduct, resetDemoData } = useInventoryData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Stats calculation
  const totalItems = products.length;
  const inStockCount = products.filter((p) => getProductStockStatus(p) === 'In Stock').length;
  const lowStockCount = getStockAlerts(products).filter((alert) => alert.type === 'low-stock' && alert.quantity > 0).length;
  const outOfStockCount = products.filter((p) => getProductStockStatus(p) === 'Out of Stock').length;
  const overstockCount = getStockAlerts(products).filter((alert) => alert.type === 'overstock').length;

  const filtered = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || getProductStockStatus(item).toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Chart data: current quantity vs minimum stock for a subset of items
  const chartData = products.slice(0, 8).map((p) => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    Current: p.quantity,
    SafetyMin: p.minStock
  }));

  const handleSimulateRestock = (id) => {
    restockProduct(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Inventory Monitoring</h2>
          <p className="text-xs text-slate-500 font-medium">
            Monitor shared demo stock levels and the temporary prototype alert thresholds
          </p>
        </div>

        {/* Quick Refresh Demo Button */}
        <button
          onClick={resetDemoData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo Sales</span>
        </button>
      </div>

      {/* Stock Health Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'ALL' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className={`text-[11px] font-bold uppercase tracking-wider block ${statusFilter === 'ALL' ? 'text-slate-400' : 'text-slate-500'}`}>
            Total SKUs
          </span>
          <p className="text-2xl font-black mt-1">{totalItems}</p>
          <span className="text-[10px] opacity-75 mt-1 block">100% Tracked</span>
        </div>

        <div 
          onClick={() => setStatusFilter('IN STOCK')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'IN STOCK' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white border-slate-200/80 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'IN STOCK' ? 'text-emerald-100' : 'text-emerald-600'}`}>
              In Stock
            </span>
            <CheckCircle2 className={`w-4 h-4 ${statusFilter === 'IN STOCK' ? 'text-emerald-200' : 'text-emerald-500'}`} />
          </div>
          <p className="text-2xl font-black mt-1">{inStockCount}</p>
          <span className="text-[10px] opacity-80 mt-1 block">Healthy stock balance</span>
        </div>

        <div 
          onClick={() => setStatusFilter('LOW STOCK')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'LOW STOCK' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white border-slate-200/80 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'LOW STOCK' ? 'text-amber-100' : 'text-amber-600'}`}>
              Low Stock
            </span>
            <AlertTriangle className={`w-4 h-4 ${statusFilter === 'LOW STOCK' ? 'text-amber-200' : 'text-amber-500'}`} />
          </div>
          <p className="text-2xl font-black mt-1">{lowStockCount}</p>
          <span className="text-[10px] opacity-80 mt-1 block">Below safety threshold</span>
        </div>

        <div 
          onClick={() => setStatusFilter('OUT OF STOCK')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'OUT OF STOCK' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white border-slate-200/80 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'OUT OF STOCK' ? 'text-rose-100' : 'text-rose-600'}`}>
              Out of Stock
            </span>
            <XCircle className={`w-4 h-4 ${statusFilter === 'OUT OF STOCK' ? 'text-rose-200' : 'text-rose-500'}`} />
          </div>
          <p className="text-2xl font-black mt-1">{outOfStockCount}</p>
          <span className="text-[10px] opacity-80 mt-1 block">Immediate reorder needed</span>
        </div>
        <div
          onClick={() => setStatusFilter('OVERSTOCK')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'OVERSTOCK' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white border-slate-200/80 hover:border-purple-200'
          }`}
        >
          <span className={`text-[11px] font-bold uppercase tracking-wider block ${statusFilter === 'OVERSTOCK' ? 'text-purple-100' : 'text-purple-600'}`}>Overstock</span>
          <p className="text-2xl font-black mt-1">{overstockCount}</p>
          <span className="text-[10px] opacity-80 mt-1 block">Above temporary threshold</span>
        </div>
      </div>

      {/* Inventory Comparison Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Stock Level vs Safety Threshold Overview</h3>
            <p className="text-xs text-slate-500">Visual comparison of actual on-hand quantity versus minimum required reserve</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-brand-600">
              <span className="w-3 h-3 rounded bg-brand-500"></span> Current Qty
            </span>
            <span className="flex items-center gap-1.5 text-rose-500">
              <span className="w-3 h-3 rounded bg-rose-400"></span> Min Safety Level
            </span>
          </div>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: 'none', color: '#fff', fontSize: '11px' }}
              />
              <Bar dataKey="Current" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="SafetyMin" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search item by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Filter Status:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'IN STOCK', 'LOW STOCK', 'OUT OF STOCK', 'OVERSTOCK'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === s
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {s === 'ALL' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Minimum Safety Stock</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const percentRatio = Math.min(100, Math.round((item.quantity / (item.minStock * 2)) * 100));
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <span className="font-mono text-[10px] text-slate-400">{item.sku}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{item.category}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.quantity} {item.unit}</div>
                        {/* Progress meter */}
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              getProductStockStatus(item) === 'In Stock'
                                ? 'bg-emerald-500'
                                : getProductStockStatus(item) === 'Low Stock'
                                ? 'bg-amber-500'
                                : getProductStockStatus(item) === 'Overstock'
                                ? 'bg-purple-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${percentRatio}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={getProductStockStatus(item)} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {item.lastUpdated}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {['Low Stock', 'Out of Stock'].includes(getProductStockStatus(item)) ? (
                          <button
                            onClick={() => handleSimulateRestock(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors border border-emerald-200"
                          >
                            + Restock
                          </button>
                        ) : getProductStockStatus(item) === 'Overstock' ? (
                          <span className="text-[11px] text-purple-600 italic">Above target</span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Sufficient</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-slate-600">No inventory items match filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
