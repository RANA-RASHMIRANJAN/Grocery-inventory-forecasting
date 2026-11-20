import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { salesOverviewData } from '../../data/mockData';

export const SalesChart = ({ sales }) => {
  const [metric, setMetric] = useState('sales');
  const chartData = sales
    ? Object.values(sales.reduce((groups, sale) => {
      const dateLabel = /^\d{4}-\d{2}-\d{2}/.test(sale.date || '') ? sale.date.slice(5, 10) : 'Today';
      if (!groups[dateLabel]) groups[dateLabel] = { day: dateLabel, sales: 0, orders: 0 };
      groups[dateLabel].sales += Number(sale.totalAmount) || 0;
      groups[dateLabel].orders += 1;
      return groups;
    }, {}))
    : salesOverviewData;
  const totalSales = sales ? sales.reduce((sum, sale) => sum + (Number(sale.totalAmount) || 0), 0) : 201700;
  const averageOrders = chartData.length ? Math.round(chartData.reduce((sum, item) => sum + item.orders, 0) / chartData.length) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
          <p className="font-bold text-slate-300 mb-1">{label} Sales Summary</p>
          <p className="text-emerald-400 font-semibold">
            {metric === 'sales' ? `Revenue: ₹${Number(payload[0].value).toLocaleString('en-IN')}` : `Orders: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Sales & Revenue Overview</h3>
          <p className="text-xs text-slate-500 font-medium">{sales ? 'Daily totals from shared demo transactions' : 'Sample demo transactions'}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setMetric('sales')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              metric === 'sales' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Revenue (₹)
          </button>
          <button
            onClick={() => setMetric('orders')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              metric === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      <div className="h-64 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (metric === 'sales' ? `₹${v / 1000}k` : v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={metric === 'sales' ? '#10b981' : '#0284c7'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={metric === 'sales' ? 'url(#colorSales)' : 'url(#colorOrders)'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Total Recorded: <strong className="text-slate-800 font-semibold">₹{totalSales.toLocaleString('en-IN')}</strong></span>
        <span>Avg Orders / Day: <strong className="text-slate-800 font-semibold">{averageOrders}</strong></span>
      </div>
    </div>
  );
};
