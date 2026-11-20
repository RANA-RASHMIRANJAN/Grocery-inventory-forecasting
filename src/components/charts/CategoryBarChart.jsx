import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { categoryDistributionData } from '../../data/mockData';

export const CategoryBarChart = ({ products }) => {
  const colors = Object.fromEntries(categoryDistributionData.map((entry) => [entry.category, entry.color]));
  const chartData = products
    ? Object.values(products.reduce((groups, product) => {
      const category = product.category || 'Uncategorized';
      if (!groups[category]) groups[category] = { category, items: 0, stock: 0, color: colors[category] || '#64748b' };
      groups[category].items += 1;
      groups[category].stock += Number(product.quantity) || 0;
      return groups;
    }, {}))
    : categoryDistributionData;
  const highestVolume = chartData.reduce((highest, entry) => entry.stock > (highest?.stock ?? -1) ? entry : highest, null);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
          <p className="font-bold text-slate-200 mb-1">{label} Category</p>
          <p className="text-emerald-400 font-semibold">Total Stock Units: {payload[0].value.toLocaleString()}</p>
          <p className="text-slate-400 text-[11px]">Unique SKUs: {payload[0].payload.items}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Product Category Distribution</h3>
          <p className="text-xs text-slate-500 font-medium">Stock volume count per grocery department</p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-lg text-slate-600">
          {chartData.length} Departments
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Highest Volume: <strong className="text-slate-800 font-semibold">{highestVolume ? `${highestVolume.category} (${highestVolume.stock.toLocaleString()} units)` : 'No products'}</strong></span>
        <span>Catalog Health: <strong className="text-emerald-600 font-semibold">{products ? `${products.length} products` : 'Demo data'}</strong></span>
      </div>
    </div>
  );
};
