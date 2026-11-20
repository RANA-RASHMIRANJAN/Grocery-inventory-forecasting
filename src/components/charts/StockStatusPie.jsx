import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { inventoryStatusData } from '../../data/mockData';
import { getProductStockStatus } from '../../domain/stockAlerts';

export const StockStatusPie = ({ products }) => {
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock', 'Overstock'];
  const colors = { 'In Stock': '#10b981', 'Low Stock': '#f59e0b', 'Out of Stock': '#ef4444', Overstock: '#9333ea' };
  const chartData = products
    ? statuses.map((name) => ({
      name,
      value: products.length ? Math.round((products.filter((product) => getProductStockStatus(product) === name).length / products.length) * 100) : 0,
      color: colors[name],
    }))
    : inventoryStatusData;
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-800 text-xs">
          <p className="font-semibold text-slate-300">{payload[0].name}</p>
          <p className="text-emerald-400 font-bold">{payload[0].value}% of catalog</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-full">
      <div className="mb-2">
        <h3 className="font-bold text-slate-800 text-base">Inventory Status</h3>
        <p className="text-xs text-slate-500 font-medium">Stock health distribution ratio</p>
      </div>

      <div className="h-52 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute text-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-800">{products ? products.length : 128}</span>
          <span className="block text-[10px] uppercase font-bold text-slate-400">Total Items</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        {chartData.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
              {item.name}
            </span>
            <span className="font-bold text-slate-800 mt-0.5">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
