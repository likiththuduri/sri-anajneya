import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppFloatButton } from './components/common/WhatsAppFloatButton';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { AllProductsPage } from './pages/AllProductsPage';
import { CategoryProductsPage } from './pages/CategoryProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

// Admin Components & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

// Public Customer Layout Wrapper
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Customer Public Pages */}
                <Route
                  path="/"
                  element={
                    <CustomerLayout>
                      <HomePage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <CustomerLayout>
                      <AllProductsPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/fertilizers"
                  element={
                    <CustomerLayout>
                      <CategoryProductsPage categorySlugOverride="fertilizers" categoryTitle="Fertilizers & Soil Nutrition" />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/pesticides"
                  element={
                    <CustomerLayout>
                      <CategoryProductsPage categorySlugOverride="pesticides" categoryTitle="Crop Protection & Pesticides" />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/seeds"
                  element={
                    <CustomerLayout>
                      <CategoryProductsPage categorySlugOverride="seeds" categoryTitle="Certified Hybrid Seeds" />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/micronutrients"
                  element={
                    <CustomerLayout>
                      <CategoryProductsPage categorySlugOverride="micronutrients" categoryTitle="Micronutrients & Foliar Nutrition" />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <CustomerLayout>
                      <ProductDetailPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <CustomerLayout>
                      <CartPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <CustomerLayout>
                      <ContactPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/admin/login"
                  element={
                    <CustomerLayout>
                      <AdminLoginPage />
                    </CustomerLayout>
                  }
                />

                {/* Protected Admin Portal */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="bookings" element={<AdminBookingsPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="profile" element={<AdminSettingsPage defaultTab="branding" />} />
                  <Route path="location" element={<AdminSettingsPage defaultTab="address" />} />
                  <Route path="appearance" element={<AdminSettingsPage defaultTab="homepage" />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
