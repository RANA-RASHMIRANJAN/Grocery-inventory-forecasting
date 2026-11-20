import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InventoryDataProvider } from './context/InventoryDataContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { AddProduct } from './pages/AddProduct';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales';
import { DemandForecast } from './pages/DemandForecast';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Alerts } from './pages/Alerts';

export function App() {
  return (
    <AuthProvider>
      <InventoryDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="sales" element={<Sales />} />
                <Route path="forecast" element={<DemandForecast />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </InventoryDataProvider>
    </AuthProvider>
  );
}

export default App;
