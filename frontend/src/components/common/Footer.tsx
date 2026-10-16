import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, Navigation } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const cleanPhone = (settings.phone || '919000000000').replace(/[^0-9]/g, '');
  const cleanWhatsApp = (settings.whatsapp || '919000000000').replace(/[^0-9]/g, '');

  const directionsLink = settings.directionsUrl || settings.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent((settings.shopName || 'SRI ANJANEYA FERTILIZERS') + ' ' + (settings.address || 'Telangana'))}`;

  return (
    <footer className="bg-agri-950 text-white border-t border-agri-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-600 to-agri-800 p-1.5 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
              <img
                src={settings.logoUrl || '/logo.svg'}
                alt={settings.shopName || 'Sri Anjaneya'}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + '/logo.svg') {
                    target.src = '/logo.svg';
                  }
                }}
              />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight text-white leading-tight">
                {settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}
              </h3>
              <span className="text-[10px] uppercase font-bold text-agri-400">
                {settings.state || 'Telangana'}, India
              </span>
            </div>
          </div>
          <p className="text-xs text-agri-300 leading-relaxed">
            Your trusted agricultural partner providing certified hybrid seeds, chemical and bio-fertilizers, and crop protection products directly to farmers with in-store collection.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-agri-400">
            <ShieldCheck className="w-4 h-4 text-agri-400 shrink-0" />
            <span>Govt. Licensed Dealer • Quality Assured</span>
          </div>
        </div>

        {/* Product Categories */}
        <div>
          <h4 className="font-bold text-sm text-agri-200 uppercase tracking-wider mb-3">
            Product Categories
          </h4>
          <ul className="space-y-2 text-xs text-agri-300">
            <li>
              <Link to="/fertilizers" className="hover:text-white transition">Chemical &amp; Organic Fertilizers</Link>
            </li>
            <li>
              <Link to="/pesticides" className="hover:text-white transition">Insecticides &amp; Fungicides</Link>
            </li>
            <li>
              <Link to="/seeds" className="hover:text-white transition">Certified Paddy, Cotton &amp; Maize Seeds</Link>
            </li>
            <li>
              <Link to="/micronutrients" className="hover:text-white transition">Zinc, Boron &amp; Plant Growth Tonics</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition">All Agricultural Inputs</Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-sm text-agri-200 uppercase tracking-wider mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs text-agri-300">
            <li>
              <Link to="/cart" className="hover:text-white transition">Shopping Cart &amp; Advance Booking</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">Store Location &amp; Directions</Link>
            </li>
            <li>
              <a href={directionsLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition inline-flex items-center gap-1 text-agri-300">
                <Navigation className="w-3 h-3 text-agri-400" />
                <span>Get Driving Directions</span>
              </a>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-white transition">Staff / Admin Portal</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info - Reading DYNAMIC settings & NO raw phone strings */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-agri-200 uppercase tracking-wider mb-3">
            Store Contact
          </h4>

          {/* Dynamic Address from backend MySQL */}
          <div className="flex items-start gap-2.5 text-xs text-agri-300">
            <MapPin className="w-4 h-4 text-agri-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {settings.address || 'Main Road, Telangana, India - 508001'}
            </span>
          </div>

          {/* Action buttons instead of raw phone string */}
          <div className="pt-1 flex flex-col gap-2">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-agri-800 hover:bg-agri-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-agri-300" />
              <span>Call Now</span>
            </a>

            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Dynamic Opening Hours */}
          <div className="flex items-start gap-2.5 text-xs text-agri-300 pt-1">
            <Clock className="w-4 h-4 text-agri-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {settings.openingHours || 'Mon - Sun: 7:00 AM - 8:30 PM'}
            </span>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-agri-900 bg-agri-950/90 py-4 px-4 text-center text-xs text-agri-400">
        <p>© {new Date().getFullYear()} {settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}. All rights reserved. Built for Telangana Farmers.</p>
      </div>
    </footer>
  );
};
