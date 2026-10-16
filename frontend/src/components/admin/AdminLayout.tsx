import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Settings, LogOut, ExternalLink, Menu, X, Shield, CalendarCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminLayout: React.FC = () => {
  const { admin, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return <LoadingSpinner message="Checking administrator privileges..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Advance Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Products & Stock', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tag },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Shop Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-agri-950 text-white p-4 flex items-center justify-between border-b border-agri-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-agri-400" />
          <span className="font-extrabold text-sm truncate">SRI ANJANEYA ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-agri-800 text-gray-200"
          aria-label="Toggle admin navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-agri-950 text-white flex-shrink-0 flex flex-col justify-between border-r border-agri-900 z-30`}
      >
        <div>
          {/* Admin Branding */}
          <div className="p-6 border-b border-agri-900/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agri-800 p-2 flex items-center justify-center">
                <img src="/logo.svg" alt="Admin Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-black tracking-tight text-white leading-tight">
                  SRI ANJANEYA
                </h2>
                <span className="text-[10px] uppercase font-bold text-agri-400">
                  Store Admin Portal
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-agri-900 text-xs text-agri-300">
              Signed in as: <strong className="text-white block truncate">{admin?.username}</strong>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    isActive(item.path)
                      ? 'bg-agri-700 text-white shadow-md'
                      : 'text-agri-200 hover:bg-agri-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-agri-900/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-agri-300 hover:bg-agri-900 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>Public Website</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-950/60 hover:text-red-200 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
