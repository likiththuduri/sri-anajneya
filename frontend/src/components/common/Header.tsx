import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Shield, Phone, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { resolveImageUrl } from '../../utils/imageUrl';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
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

  const cleanPhone = (settings.phone || '7095891270').replace(/[^0-9]/g, '');
  const cleanWhatsApp = (settings.whatsapp || '7095891270').replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm transition-all">
      {/* Dynamic Announcement Bar if enabled */}
      {settings.announcementEnabled !== false && (
        <div className="bg-agri-950 text-white text-xs py-2 px-4 border-b border-agri-900">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-agri-100 font-medium text-xs">
                {settings.announcementText || 'Fertilizers, Pesticides & Seeds • In-Store Pickup Available'}
              </span>
            </div>

            {/* Functional Call Now & WhatsApp Us Buttons - NO raw numbers shown */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-agri-800/80 hover:bg-agri-700 text-white transition"
              >
                <Phone className="w-3.5 h-3.5 text-agri-300" />
                <span>Call Now</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-700 hover:bg-green-600 text-white transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>

              <span className="text-agri-700">|</span>

              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                className="flex items-center gap-1 text-agri-300 hover:text-white transition font-medium"
              >
                <Shield className="w-3 h-3 text-agri-400" />
                <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Exact Shop Name & Dynamic Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-agri-600 to-agri-800 flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform duration-200 overflow-hidden">
            <img
              src={resolveImageUrl(settings.logoUrl, '/anjaneya-logo.jpeg')}
              alt={settings.shopName || 'Sri Anjaneya Logo'}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== window.location.origin + '/anjaneya-logo.jpeg') {
                  target.src = '/anjaneya-logo.jpeg';
                }
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base md:text-lg font-black text-agri-950 tracking-tight leading-tight group-hover:text-agri-700 transition">
              {settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}
            </span>
            <span className="text-[11px] font-semibold text-agri-700 uppercase tracking-wider">
              Fertilizers, Pesticides &amp; Seeds • In-Store Pickup
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
            <span className="hidden sm:inline font-bold">Cart</span>
            {totalItems > 0 && (
              <span className="bg-agri-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center -ml-1">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-agri-700 hover:bg-gray-100 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-lg">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-center gap-2 py-2 px-3 bg-agri-50 text-agri-900 font-bold text-xs rounded-xl border border-agri-200"
            >
              <Phone className="w-3.5 h-3.5 text-agri-700" />
              <span>Call Now</span>
            </a>
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-3 bg-green-50 text-green-900 font-bold text-xs rounded-xl border border-green-200"
            >
              <MessageSquare className="w-3.5 h-3.5 text-green-600" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-agri-50 text-agri-800 font-bold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-agri-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 font-bold text-agri-800 hover:underline"
            >
              <Shield className="w-4 h-4 text-agri-600" />
              <span>{isAuthenticated ? 'Admin Portal' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
