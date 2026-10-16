import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, Navigation, Store } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  const cleanPhone = (settings.phone || '919000000000').replace(/[^0-9]/g, '');
  const cleanWhatsApp = (settings.whatsapp || '919000000000').replace(/[^0-9]/g, '');
  const directionsUrl = settings.directionsUrl || settings.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent((settings.shopName || 'SRI ANJANEYA FERTILIZERS') + ' ' + (settings.address || 'Telangana'))}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-50 px-3 py-1 rounded-full border border-agri-200">
          Official Store Location
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Contact &amp; Store Visit Information
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Visit <strong>{settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}</strong> for genuine agricultural products, certified seeds, crop protection recommendations, and instant counter pickup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Shop Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-gray-900 text-lg border-b border-gray-100 pb-3">
              Store Counter Details
            </h3>

            {/* Dynamic Store Address */}
            <div className="flex items-start gap-3.5 text-xs sm:text-sm text-gray-700">
              <MapPin className="w-5 h-5 text-agri-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 text-sm">Shop Address:</strong>
                <span className="font-semibold text-agri-950 block">
                  {settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}
                </span>
                <span className="text-gray-600 whitespace-pre-line leading-relaxed block mt-1">
                  {settings.address || 'Main Road, Telangana, India - 508001'}
                </span>
              </div>
            </div>

            {/* Action buttons - NO raw phone strings */}
            <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs shadow-sm transition active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Store Timings */}
            <div className="flex items-start gap-3.5 text-xs sm:text-sm text-gray-700 pt-2 border-t border-gray-100">
              <Clock className="w-5 h-5 text-agri-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 text-sm">Store Timings:</strong>
                <span className="text-gray-600">
                  {settings.openingHours || 'Monday – Sunday: 7:00 AM – 8:30 PM'}
                </span>
              </div>
            </div>
          </div>

          {/* Local Pickup Guidance Card */}
          <div className="bg-agri-50 p-6 rounded-2xl border border-agri-200 space-y-3 text-xs text-agri-900">
            <div className="flex items-center gap-2 font-bold text-sm text-agri-800">
              <ShieldCheck className="w-5 h-5 text-agri-600" />
              <span>How Local Counter Pickup Works</span>
            </div>
            <p className="leading-relaxed whitespace-pre-line">
              {settings.pickupInstructions || 
                "1. Book your fertilizers, pesticides, or seeds online through Advance Booking or Cart.\n2. Keep your generated Booking Reference (e.g. BK-20261016-XXXX) handy.\n3. Our counter staff will verify inventory and prepare your items.\n4. Payment is settled at the shop counter via cash or UPI QR code."
              }
            </p>
          </div>
        </div>

        {/* Directions & Map Visual */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">
                Find Our Store in {settings.state || 'Telangana'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Conveniently located for tractor, auto-trolley, and farm transport loading.
              </p>
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
          </div>

          {/* Interactive Map Visual */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video relative flex items-center justify-center text-center p-6 shadow-inner">
            <div className="space-y-3 max-w-md">
              <div className="w-14 h-14 bg-agri-700 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-base">
                  {settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}
                </h4>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  {settings.address || 'Main Road, Telangana, India - 508001'}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-agri-800 hover:bg-agri-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <span className="font-bold text-xs text-gray-900 block mb-1">Vehicle Loading Facility</span>
              <p className="text-xs text-gray-500">
                Spacious front parking area suitable for auto-trolleys, tractors, and pickups to load fertilizer sacks.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <span className="font-bold text-xs text-gray-900 block mb-1">Agronomy Advisory</span>
              <p className="text-xs text-gray-500">
                Bring crop leaf samples for on-the-spot pest diagnosis and dosage advice by certified staff.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
