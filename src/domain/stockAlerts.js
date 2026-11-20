/**
 * Temporary prototype stock rules:
 * - Low stock: quantity <= minStock
 * - Overstock: quantity > 3 * minStock
 *
 * Keep this calculation centralized. Replace this adapter with backend-provided
 * alerts when the API contract is available; pages should consume its result only.
 */
export const getProductStockStatus = (product) => {
  const quantity = Number(product.quantity) || 0;
  const minStock = Number(product.minStock) || 0;

  if (quantity <= 0) return 'Out of Stock';
  if (quantity <= minStock) return 'Low Stock';
  if (quantity > getOverstockThreshold(product)) return 'Overstock';
  return 'In Stock';
};

export const getOverstockThreshold = (product) => 3 * (Number(product.minStock) || 0);

export const getStockAlerts = (products) => products.flatMap((product) => {
  const quantity = Number(product.quantity) || 0;
  const minStock = Number(product.minStock) || 0;
  const status = getProductStockStatus(product);
  const common = { productId: product.id, product, quantity, minStock };

  if (status === 'Low Stock' || status === 'Out of Stock') {
    return [{ ...common, type: 'low-stock', label: status }];
  }
  if (status === 'Overstock') return [{ ...common, type: 'overstock', label: status }];
  return [];
});
