import React, { useState } from 'react';
import { 
  ReceiptIndianRupee, 
  Search, 
  Plus, 
  CreditCard, 
  Check, 
  QrCode, 
  ShoppingBag
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { useInventoryData } from '../context/InventoryDataContext';

export const Sales = () => {
  const { sales, products, recordSale } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formError, setFormError] = useState('');

  // Form state for Record Sale
  const [newSale, setNewSale] = useState({
    productId: products[0]?.id || '',
    quantity: 1,
    paymentMethod: 'UPI / QR',
    customer: 'Walk-in Customer'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredSales = sales.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment =
      paymentFilter === 'ALL' || item.paymentMethod.toUpperCase().includes(paymentFilter);

    return matchesSearch && matchesPayment;
  });

  const totalRevenue = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalUnitsSold = sales.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleRecordSale = (e) => {
    e.preventDefault();
    try {
      const newRecord = recordSale({ ...newSale, productId: Number(newSale.productId), customer: newSale.customer || 'Walk-in Customer' });
      setFormError('');
      setIsRecordModalOpen(false);
      showToast(`Sale recorded successfully! Invoice: ${newRecord.invoiceNo}`);
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-slide-up">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sales & Billing Management</h2>
          <p className="text-xs text-slate-500 font-medium">
            Daily checkout invoices, payment modes, and order volume logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Sale</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales Value</span>
            <p className="text-xl font-black text-slate-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ReceiptIndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Invoices</span>
            <p className="text-xl font-black text-slate-900 mt-1">{sales.length}</p>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Units Dispensed</span>
            <p className="text-xl font-black text-slate-900 mt-1">{totalUnitsSold} items</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice, product, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium">Payment Mode:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-700 font-medium"
          >
            <option value="ALL">All Payment Types</option>
            <option value="UPI">UPI / QR Code</option>
            <option value="CARD">Debit / Credit Card</option>
            <option value="CASH">Cash on Counter</option>
          </select>
        </div>
      </div>

      {/* Sales Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Qty Sold</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length > 0 ? (
                filteredSales.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{item.invoiceNo}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{item.product}</div>
                      <span className="text-[10px] text-slate-400">{item.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{item.customer}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-slate-600">₹{item.price.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-black text-brand-700">₹{item.totalAmount.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-[11px] text-slate-700">
                        {item.paymentMethod.includes('UPI') ? <QrCode className="w-3 h-3 text-brand-600" /> : <CreditCard className="w-3 h-3 text-sky-600" />}
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{item.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <ReceiptIndianRupee className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-slate-600">No sales transactions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD SALE MODAL */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record New Counter Sale"
      >
        <form onSubmit={handleRecordSale} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Select Product</label>
            <select
              value={newSale.productId}
              onChange={(e) => setNewSale({ ...newSale, productId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-slate-800 font-semibold"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={Number(p.quantity) <= 0}>
                  {p.name} (Stock: {p.quantity} {p.unit} - ₹{p.price})
                </option>
              ))}
            </select>
          </div>

          {formError && <p role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">{formError}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={newSale.quantity}
                onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Payment Method</label>
              <select
                value={newSale.paymentMethod}
                onChange={(e) => setNewSale({ ...newSale, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              >
                <option value="UPI / QR">UPI / QR Code</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Cash">Cash on Counter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Customer Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={newSale.customer}
              onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-between">
            <span className="font-bold text-brand-900">Estimated Total:</span>
            <span className="font-extrabold text-sm text-brand-700">
              ₹
              {(
                (products.find((p) => p.id === Number(newSale.productId))?.price || 0) *
                (parseInt(newSale.quantity, 10) || 1)
              ).toFixed(2)}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-sm"
            >
              Confirm & Generate Bill
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
