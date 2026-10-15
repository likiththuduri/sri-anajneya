import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-agri-950 text-white mt-16 border-t border-agri-900">
      {/* Trust Highlights Bar */}
      <div className="border-b border-agri-900/80 bg-agri-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-agri-800/80 border border-agri-700/50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-agri-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% Genuine Products</h4>
              <p className="text-xs text-agri-200 mt-0.5">Direct from certified manufacturers &amp; authorized dealers</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-agri-800/80 border border-agri-700/50 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Govt. Certified &amp; Tested</h4>
              <p className="text-xs text-agri-200 mt-0.5">High germination seeds &amp; registered crop chemicals</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-agri-800/80 border border-agri-700/50 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 text-agri-300" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Dedicated Farmer Support</h4>
              <p className="text-xs text-agri-200 mt-0.5">Expert crop guidance, dosage recommendations &amp; fair pricing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-agri-700 p-1.5 flex items-center justify-center">
              <img src="/logo.svg" alt="Sri Anjaneya" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white leading-snug">
              SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS
            </span>
          </div>
          <p className="text-xs text-agri-300 leading-relaxed">
            Your trusted agricultural partner in Telangana. Providing top-quality fertilizers, pesticides, certified hybrid seeds, and micronutrients directly to farmers.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/917095891270?text=Hello%20SRI%20ANJANEYA%20FERTILIZERS,%20I%20have%20an%20inquiry%20regarding%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Shop Inquiries</span>
            </a>
          </div>
        </div>

        {/* Categories */}
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
              <Link to="/seeds" className="hover:text-white transition">Hybrid Paddy &amp; Cotton Seeds</Link>
            </li>
            <li>
              <Link to="/micronutrients" className="hover:text-white transition">Foliar Micronutrients &amp; Zinc</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition">Complete Product Catalog</Link>
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
              <Link to="/cart" className="hover:text-white transition">Shopping Cart &amp; Booking</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">Store Location &amp; Directions</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">Local Store Pickup Policy</Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-white transition">Staff / Admin Portal</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-agri-200 uppercase tracking-wider mb-3">
            Store Contact
          </h4>
          <div className="flex items-start gap-2.5 text-xs text-agri-300">
            <MapPin className="w-4 h-4 text-agri-400 shrink-0 mt-0.5" />
            <span>Main Road, Near Rythu Bharosa Kendram, Telangana - 508213, India</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-agri-300">
            <Phone className="w-4 h-4 text-agri-400 shrink-0" />
            <a href="tel:917095891270" className="hover:text-white transition">+91 70958 91270</a>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-agri-300">
            <Clock className="w-4 h-4 text-agri-400 shrink-0 mt-0.5" />
            <span>Mon - Sat: 7:00 AM - 8:30 PM<br />Sunday: 7:00 AM - 2:00 PM</span>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-agri-900 bg-agri-950/80 py-4 px-4 text-center text-xs text-agri-400">
        <p>© {new Date().getFullYear()} SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS. All rights reserved. Built for Telangana Farmers.</p>
      </div>
    </footer>
  );
};
