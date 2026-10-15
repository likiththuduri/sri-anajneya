import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Products', path: '/products' },
    { name: 'Fertilizers', path: '/fertilizers' },
    { name: 'Pesticides', path: '/pesticides' },
    { name: 'Seeds', path: '/seeds' },
    { name: 'Micronutrients', path: '/micronutrients' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm transition-all">
      {/* Top Agricultural Notice Strip */}
      <div className="bg-agri-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-agri-700 text-agri-100 text-[10px] font-semibold uppercase tracking-wider">
              Telangana Govt. Approved
            </span>
            <span className="hidden sm:inline text-agri-200">
              100% Genuine Fertilizers, Certified Hybrid Seeds &amp; Quality Crop Protection
            </span>
          </div>
          <div className="flex items-center gap-4 text-agri-100">
            <a href="tel:917095891270" className="flex items-center gap-1 hover:text-white transition">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 70958 91270</span>
            </a>
            <span className="text-agri-600">|</span>
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              className="flex items-center gap-1 hover:text-white font-medium text-agri-300 transition"
            >
              <Shield className="w-3 h-3" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Exact Shop Name & Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-agri-600 to-agri-800 flex items-center justify-center p-2 shadow-md group-hover:scale-105 transition-transform duration-200">
            <img src="/logo.svg" alt="Sri Anjaneya Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base md:text-lg font-extrabold text-agri-950 tracking-tight leading-tight group-hover:text-agri-700 transition">
              SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS
            </span>
            <span className="text-[11px] font-semibold text-agri-700 uppercase tracking-wider">
              Agricultural Inputs &amp; Store Pickup • Telangana, India
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive(link.path)
                  ? 'bg-agri-50 text-agri-800 font-bold'
                  : 'text-gray-700 hover:text-agri-700 hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons: Cart and Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="relative flex items-center gap-2 bg-agri-50 hover:bg-agri-100 text-agri-900 px-3.5 py-2 rounded-xl font-semibold text-sm transition-all border border-agri-200"
          >
            <ShoppingCart className="w-5 h-5 text-agri-700" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="bg-agri-700 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-agri-700 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Catalog Navigation
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition ${
                isActive(link.path)
                  ? 'bg-agri-50 text-agri-800'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-agri-700'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100">
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-agri-700 bg-agri-50"
            >
              <Shield className="w-4 h-4" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Portal Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
