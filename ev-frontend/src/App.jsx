import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, RoleProtectedRoute, PublicRoute } from './components/routes/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ProviderLayout from './layouts/ProviderLayout';
import ConsumerLayout from './layouts/ConsumerLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterForm from './components/identity/RegisterForm';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminDataPage from './pages/admin/AdminDataPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// Provider Pages
import ProviderDashboardPage from './pages/provider/ProviderDashboardPage';
import ProviderDatasetsPage from './pages/provider/ProviderDatasetsPage';
import ProviderRevenuePage from './pages/provider/ProviderRevenuePage';
import ProviderAnalyticsPage from './pages/provider/ProviderAnalyticsPage';
import ProviderProfilePage from './pages/provider/ProviderProfilePage';

// Consumer Pages
import ConsumerDashboardPage from './pages/consumer/ConsumerDashboardPage';
import ConsumerBrowsePage from './pages/consumer/ConsumerBrowsePage';
import ConsumerPurchasesPage from './pages/consumer/ConsumerPurchasesPage';
import ConsumerTransactionsPage from './pages/consumer/ConsumerTransactionsPage';
import ConsumerAnalyticsPage from './pages/consumer/ConsumerAnalyticsPage';
import ConsumerProfilePage from './pages/consumer/ConsumerProfilePage';
import ConsumerDatasetDetailPage from './pages/consumer/ConsumerDatasetDetailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterForm />} />
          </Route>

          {/* Admin Routes - Requires ADMIN role */}
          <Route element={<RoleProtectedRoute requiredRole="ADMIN" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="data" element={<AdminDataPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
            </Route>
          </Route>

          {/* Provider Routes - Requires DATA_PROVIDER role */}
          <Route element={<RoleProtectedRoute requiredRole="DATA_PROVIDER" />}>
            <Route path="/provider" element={<ProviderLayout />}>
              <Route index element={<Navigate to="/provider/dashboard" replace />} />
              <Route path="dashboard" element={<ProviderDashboardPage />} />
              <Route path="datasets" element={<ProviderDatasetsPage />} />
              <Route path="revenue" element={<ProviderRevenuePage />} />
              <Route path="analytics" element={<ProviderAnalyticsPage />} />
              <Route path="profile" element={<ProviderProfilePage />} />
            </Route>
          </Route>

          {/* Consumer Routes - Requires DATA_CONSUMER role */}
          <Route element={<RoleProtectedRoute requiredRole="DATA_CONSUMER" />}>
            <Route path="/consumer" element={<ConsumerLayout />}>
              <Route index element={<Navigate to="/consumer/dashboard" replace />} />
              <Route path="dashboard" element={<ConsumerDashboardPage />} />
              <Route path="browse" element={<ConsumerBrowsePage />} />
              <Route path="dataset/:id" element={<ConsumerDatasetDetailPage />} />
              <Route path="purchases" element={<ConsumerPurchasesPage />} />
              <Route path="transactions" element={<ConsumerTransactionsPage />} />
              <Route path="analytics" element={<ConsumerAnalyticsPage />} />
              <Route path="profile" element={<ConsumerProfilePage />} />
            </Route>
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Go to Login
                </a>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
