import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Package, 
  Check
} from 'lucide-react';
import { categoriesList } from '../data/mockData';
import { useInventoryData } from '../context/InventoryDataContext';
import { getProductStockStatus } from '../domain/stockAlerts';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

export const Products = () => {
  const navigate = useNavigate();
  const { products, productsLoading, productsError, refreshProducts, updateProduct, deleteProduct } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // Modals state
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [operationError, setOperationError] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from catalog?`)) {
      setOperationError('');
      try {
        await deleteProduct(id);
        showToast(`Product "${name}" deleted from the catalog.`);
      } catch (error) {
        setOperationError(error.message || 'Product could not be deleted.');
      }
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setOperationError('');
    try {
      await updateProduct(editProduct.id, {
        ...editProduct,
        price: Number(editProduct.price),
      });
      showToast(`Product "${editProduct.name}" updated successfully.`);
      setEditProduct(null);
    } catch (error) {
      setOperationError(error.message || 'Product could not be updated.');
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Product Management</h2>
          <p className="text-xs text-slate-500 font-medium">Manage stock inventory, pricing, and category classifications</p>
        </div>

        <button
          onClick={() => navigate('/add-product')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {(productsError || operationError) && (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-3">
          <span>{productsError || operationError}</span>
          {productsError && <button onClick={refreshProducts} className="font-bold underline">Retry</button>}
        </div>
      )}

      {productsLoading && <p className="text-xs text-slate-500">Loading products from the Spring Boot API…</p>}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-700 font-medium w-full md:w-48"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">
            Showing <strong className="text-slate-700 font-bold">{filteredProducts.length}</strong> of {products.length}
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Qty</th>
                <th className="py-3.5 px-4">Unit</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 font-semibold">{item.sku}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{item.supplier}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{item.price.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{item.unit}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={getProductStockStatus(item)} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewProduct(item)}
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditProduct({ ...item })}
                          title="Edit Product"
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          title="Delete Product"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-slate-600">{productsLoading ? 'Loading products…' : 'No matching products found'}</p>
                    {!productsLoading && <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your search query or category filter</p>}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PRODUCT MODAL */}
      <Modal
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        title="Product Information"
      >
        {viewProduct && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-slate-400 text-[11px]">{viewProduct.sku}</span>
                <h4 className="text-base font-bold text-slate-900">{viewProduct.name}</h4>
              </div>
              <StatusBadge status={getProductStockStatus(viewProduct)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 text-[11px] block">Category</span>
                <span className="font-bold text-slate-800">{viewProduct.category}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 text-[11px] block">Unit Price</span>
                <span className="font-bold text-slate-800">₹{viewProduct.price.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 text-[11px] block">Current Stock</span>
                <span className="font-bold text-slate-800">{viewProduct.quantity} {viewProduct.unit}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 text-[11px] block">Minimum Threshold</span>
                <span className="font-bold text-slate-800">{viewProduct.minStock} {viewProduct.unit}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 text-[11px] block">Supplier</span>
              <span className="font-semibold text-slate-800">{viewProduct.supplier}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 text-[11px] block">Description / Notes</span>
              <span className="text-slate-700 leading-relaxed">{viewProduct.description || 'No additional notes provided.'}</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewProduct(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT PRODUCT MODAL */}
      <Modal
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        title="Edit Product Details"
      >
        {editProduct && (
          <form onSubmit={handleEditSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Product Name</label>
              <input
                type="text"
                required
                value={editProduct.name}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                >
                  {categoriesList.filter((c) => c !== 'All Categories').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] text-slate-500">Stock quantity is managed separately from product details.</p>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Unit</label>
              <input
                type="text"
                required
                value={editProduct.unit}
                onChange={(e) => setEditProduct({ ...editProduct, unit: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Supplier</label>
              <input
                type="text"
                required
                value={editProduct.supplier}
                onChange={(e) => setEditProduct({ ...editProduct, supplier: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
