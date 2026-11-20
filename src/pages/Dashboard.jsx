import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Boxes, 
  AlertTriangle, 
  IndianRupee, 
  Sparkles, 
  BrainCircuit, 
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { SalesChart } from '../components/charts/SalesChart';
import { StockStatusPie } from '../components/charts/StockStatusPie';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { useInventoryData } from '../context/InventoryDataContext';
import { getStockAlerts } from '../domain/stockAlerts';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { products, sales } = useInventoryData();
  const stockAlerts = getStockAlerts(products);
  const attentionItems = stockAlerts.map((alert) => ({ ...alert.product, alertLabel: alert.label }));
  const totalStockUnits = products.reduce((sum, product) => sum + (Number(product.quantity) || 0), 0);
  const totalSales = sales.reduce((sum, sale) => sum + (Number(sale.totalAmount) || 0), 0);
  const lowStockCount = stockAlerts.filter((alert) => alert.type === 'low-stock').length;
  const overstockCount = stockAlerts.filter((alert) => alert.type === 'overstock').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome & Context Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            B.Tech Major Project • Milestone Phase 1
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Smart Grocery Inventory & Demand Analytics
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl font-normal">
            Frontend prototype using shared in-memory demo data. ML forecasting is not connected yet.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => navigate('/forecast')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group"
          >
            <BrainCircuit className="w-4 h-4 text-slate-950" />
            <span>View ML Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={products.length.toLocaleString()}
          change="Demo data"
          isPositive={true}
          subtitle={`${new Set(products.map((product) => product.category)).size} categories`}
          icon={Package}
          color="emerald"
        />
        <StatCard
          title="Total Stock Units"
          value={totalStockUnits.toLocaleString()}
          change="Current inventory"
          isPositive={true}
          subtitle="units on hand"
          icon={Boxes}
          color="blue"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount.toLocaleString()}
          change={`${overstockCount} overstock`}
          isPositive={true}
          subtitle="temporary threshold alerts"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Total Sales (Week)"
          value="₹2,01,700"
          change="Demo records"
          isPositive={true}
          subtitle={`${sales.length} transactions in memory`}
          icon={IndianRupee}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview (2 cols) */}
        <div className="lg:col-span-2">
          <SalesChart sales={sales} />
        </div>

        {/* Inventory Status (1 col) */}
        <div className="lg:col-span-1">
          <StockStatusPie products={products} />
        </div>
      </div>

      {/* Second Grid: Category Breakdown + Demand Forecast Module Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution Chart (2 cols) */}
        <div className="lg:col-span-2">
          <CategoryBarChart products={products} />
        </div>

        {/* Demand Forecasting Module Callout (1 col) - Required by Prompt */}
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 rounded-2xl border border-indigo-500/30 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                Phase 2 Integration
              </span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              Demand Forecasting Module
            </h3>
            
            <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/20">
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                ML Forecasting – Coming Soon
              </p>
              <p className="text-[12px] text-slate-300 leading-relaxed">
                The prediction display is reserved for results from a future ML service. No predictions are generated in this frontend.
              </p>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Frontend request area prepared</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>ML service not connected</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => navigate('/forecast')}
            className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <span>Explore ML Integration Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Critical Stock Alert Quick Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Inventory Attention Items</h3>
            <p className="text-xs text-slate-500">Products matching the temporary low-stock or overstock rules</p>
          </div>
          <button
            onClick={() => navigate('/alerts')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
          >
            View All Alerts <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Current Qty</th>
                <th className="pb-3">Min Level</th>
                <th className="pb-3">Supplier</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attentionItems.slice(0, 4).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-semibold text-slate-800">{item.name}</td>
                  <td className="py-3 text-slate-600">{item.category}</td>
                  <td className="py-3 font-bold text-slate-900">{item.quantity} {item.unit}</td>
                  <td className="py-3 text-slate-500">{item.minStock} {item.unit}</td>
                  <td className="py-3 text-slate-600">{item.supplier}</td>
                  <td className="py-3">
                    <StatusBadge status={item.alertLabel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
