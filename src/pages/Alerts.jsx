import React from 'react';
import { AlertTriangle, TrendingUp, Boxes } from 'lucide-react';
import { useInventoryData } from '../context/InventoryDataContext';
import { getOverstockThreshold, getStockAlerts } from '../domain/stockAlerts';
import { StatusBadge } from '../components/common/StatusBadge';

export const Alerts = () => {
  const { products } = useInventoryData();
  const alerts = getStockAlerts(products);
  const lowStockAlerts = alerts.filter((alert) => alert.type === 'low-stock');
  const overstockAlerts = alerts.filter((alert) => alert.type === 'overstock');

  const renderAlertList = (items, emptyMessage) => (
    items.length ? (
      <div className="divide-y divide-slate-100">
        {items.map(({ product, quantity, type, label }) => (
          <div key={`${type}-${product.id}`} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate">{product.name}</p>
              <p className="text-xs text-slate-500">{quantity} {product.unit} on hand · Threshold: {type === 'overstock' ? getOverstockThreshold(product) : product.minStock} {product.unit}</p>
            </div>
            <StatusBadge status={label} />
          </div>
        ))}
      </div>
    ) : <p className="py-6 text-sm text-slate-500">{emptyMessage}</p>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Stock Alerts</h2>
        <p className="text-xs text-slate-500 font-medium">Prototype alerts derived from the shared inventory data.</p>
      </div>

      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-800">
        Temporary prototype rules: low stock is quantity at or below minimum stock; overstock is quantity above three times minimum stock.
      </div>

      <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-500" /><h3 className="font-bold text-slate-800">Low-stock alerts ({lowStockAlerts.length})</h3></div>
        {renderAlertList(lowStockAlerts, 'No products are currently at or below minimum stock.')}
      </section>

      <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-purple-600" /><h3 className="font-bold text-slate-800">Overstock alerts ({overstockAlerts.length})</h3></div>
        {renderAlertList(overstockAlerts, 'No products are currently above the temporary overstock threshold.')}
      </section>

      <div className="flex items-center gap-2 text-xs text-slate-400"><Boxes className="w-4 h-4" /> Alert data is calculated in one helper and can later be replaced by backend alert records.</div>
    </div>
  );
};

