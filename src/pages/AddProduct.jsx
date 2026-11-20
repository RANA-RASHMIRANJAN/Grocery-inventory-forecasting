import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PackagePlus, 
  ArrowLeft, 
  Check, 
  Boxes, 
  Truck
} from 'lucide-react';
import { categoriesList } from '../data/mockData';
import { useInventoryData } from '../context/InventoryDataContext';

export const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useInventoryData();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Fresh Produce',
    price: '',
    quantity: '',
    unit: 'Kg',
    supplier: '',
    minStock: '10',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    try {
      await addProduct({
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        minStock: Number(formData.minStock),
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/products'), 1200);
    } catch (error) {
      setFormError(error.message || 'Product could not be added.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header & Back Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/products')}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
            title="Back to products"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Add New Product Entry</h2>
            <p className="text-xs text-slate-500 font-medium">Create a new item in grocery inventory system</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
          Product Details
        </span>
      </div>

      {/* Success Notification */}
      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-sm">
          <div className="p-1.5 rounded-lg bg-emerald-500 text-white">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-emerald-900">Product Registered Successfully!</p>
            <p className="text-emerald-700 font-normal">Redirecting to product catalog table...</p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && <p role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{formError}</p>}
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-4 flex items-center gap-2">
              <PackagePlus className="w-4 h-4" />
              1. General Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  SKU <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="sku"
                  required
                  placeholder="e.g. P002"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Organic Alphonso Mangoes"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all text-slate-700 font-medium"
                  >
                    {categoriesList.filter((c) => c !== 'All Categories').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Unit Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all text-slate-700 font-medium"
                  >
                    <option value="Kg">Kg (Kilogram)</option>
                    <option value="Litre">Litre</option>
                    <option value="Pcs">Pcs (Pieces)</option>
                    <option value="Packet">Packet</option>
                    <option value="Box">Box (Carton)</option>
                    <option value="Dozen">Dozen</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Pricing & Stock Levels */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-4 flex items-center gap-2">
              <Boxes className="w-4 h-4" />
              2. Stock & Pricing Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Unit Price (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    required
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Initial Stock Qty <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="quantity"
                  required
                  placeholder="e.g. 50"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Min Safety Stock <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="minStock"
                  required
                  placeholder="e.g. 15"
                  value={formData.minStock}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Vendor Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              3. Vendor & Notes
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Supplier / Distributor Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="supplier"
                  required
                  placeholder="e.g. Metro Wholesale Foods Ltd."
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Description / Expiry Notes
                </label>
                <textarea
                  rows="3"
                  name="description"
                  placeholder="Add batch details, storage conditions, or perishable notes..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all placeholder:text-slate-400"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Adding Entry...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
