import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialSales } from '../data/mockData';
import { getOverstockThreshold } from '../domain/stockAlerts';
import * as productService from '../services/productService';

const InventoryDataContext = createContext(null);

export const InventoryDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [sales, setSales] = useState(() => initialSales.map((sale) => ({ ...sale })));

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const loadedProducts = await productService.getProducts();
      setProducts(loadedProducts);
    } catch (error) {
      setProductsError(error.message || 'Could not load products.');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    productService.getProducts()
      .then((loadedProducts) => {
        if (isMounted) setProducts(loadedProducts);
      })
      .catch((error) => {
        if (isMounted) setProductsError(error.message || 'Could not load products.');
      })
      .finally(() => {
        if (isMounted) setProductsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const addProduct = useCallback(async (product) => {
    const created = await productService.createProduct(product);
    setProducts((current) => [...current, created]);
    return created;
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    const updated = await productService.updateProduct(id, updates);
    setProducts((current) => current.map((product) => (
      String(product.id) === String(id) ? updated : product
    )));
    return updated;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await productService.deleteProduct(id);
    setProducts((current) => current.filter((product) => String(product.id) !== String(id)));
  }, []);

  const restockProduct = useCallback((id) => {
    setProducts((current) => current.map((product) => (
      product.id === id
        ? { ...product, quantity: Math.max(Number(product.quantity) || 0, getOverstockThreshold(product)), lastUpdated: 'Just now' }
        : product
    )));
  }, []);

  const recordSale = useCallback((sale) => {
    const product = products.find((item) => item.id === sale.productId);
    const quantity = Number(sale.quantity);
    if (!product) throw new Error('Select a product that exists in the current inventory.');
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Quantity must be a positive whole number.');
    if (quantity > Number(product.quantity)) throw new Error('Sale quantity exceeds available stock.');

    const saleRecord = {
      ...sale,
      id: `TXN-${Date.now()}`,
      invoiceNo: `INV-DEMO-${Date.now()}`,
      product: product.name,
      category: product.category,
      price: Number(product.price) || 0,
      quantity,
      totalAmount: (Number(product.price) || 0) * quantity,
      date: 'Just now',
    };

    setProducts((current) => current.map((item) => (
      item.id === product.id
        ? { ...item, quantity: Number(item.quantity) - quantity, lastUpdated: 'Just now' }
        : item
    )));
    setSales((current) => [saleRecord, ...current]);
    return saleRecord;
  }, [products]);

  const resetDemoData = useCallback(() => {
    // Product records now belong to the backend. This reset only restores local demo sales.
    setSales(initialSales.map((sale) => ({ ...sale })));
  }, []);

  const value = useMemo(() => ({
    products, productsLoading, productsError, refreshProducts, sales,
    addProduct, updateProduct, deleteProduct, restockProduct, recordSale, resetDemoData,
  }), [products, productsLoading, productsError, refreshProducts, sales, addProduct, updateProduct, deleteProduct, restockProduct, recordSale, resetDemoData]);

  return <InventoryDataContext.Provider value={value}>{children}</InventoryDataContext.Provider>;
};

export const useInventoryData = () => {
  const context = useContext(InventoryDataContext);
  if (!context) throw new Error('useInventoryData must be used within InventoryDataProvider');
  return context;
};
