import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, Mail, Navigation, Award } from 'lucide-react';

export const ContactPage: React.FC = () => {
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
          Visit <strong>SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS</strong> for genuine agricultural products, certified seeds, crop protection recommendations, and instant counter pickup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Shop Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-gray-900 text-lg border-b border-gray-100 pb-3">
              Store Counter Details
            </h3>

            <div className="flex items-start gap-3.5 text-xs sm:text-sm text-gray-700">
              <MapPin className="w-5 h-5 text-agri-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 text-sm">Shop Address:</strong>
                <span>SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS</span><br />
                <span>Main Road, Near Rythu Bharosa Kendram</span><br />
                <span>Telangana - 508213, India</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs sm:text-sm text-gray-700">
              <Phone className="w-5 h-5 text-agri-600 shrink-0" />
              <div>
                <strong className="block text-gray-900 text-sm">Direct Phone:</strong>
                <a href="tel:917095891270" className="text-agri-700 font-bold hover:underline">
                  +91 70958 91270
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs sm:text-sm text-gray-700">
              <MessageSquare className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <strong className="block text-gray-900 text-sm">WhatsApp Support:</strong>
                <a
                  href="https://wa.me/917095891270?text=Hello%20SRI%20ANJANEYA%20FERTILIZERS,%20I%20need%20product%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 font-bold hover:underline"
                >
                  +91 70958 91270 (Click to Chat)
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-xs sm:text-sm text-gray-700">
              <Clock className="w-5 h-5 text-agri-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 text-sm">Store Timings:</strong>
                <span>Monday – Saturday: 7:00 AM – 8:30 PM</span><br />
                <span>Sunday: 7:00 AM – 2:00 PM</span>
              </div>
            </div>
          </div>

          {/* Local Pickup Guidance Card */}
          <div className="bg-agri-50 p-6 rounded-2xl border border-agri-200 space-y-3 text-xs text-agri-900">
            <div className="flex items-center gap-2 font-bold text-sm text-agri-800">
              <ShieldCheck className="w-5 h-5 text-agri-600" />
              <span>How Local Counter Pickup Works</span>
            </div>
            <p className="leading-relaxed">
              1. Book your fertilizers or seeds online or via WhatsApp.<br />
              2. Keep your generated Order Number (e.g. <code>SA-20261015-1001</code>) handy.<br />
              3. Our counter staff will verify and hand over your items.<br />
              4. Payment can be made in Cash or through UPI QR code at the counter.
            </p>
          </div>
        </div>

        {/* Directions & Map Visual */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg">
              Find Our Store in Telangana
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Conveniently located on the main road for tractor and agricultural transport loading.
            </p>
          </div>

          {/* Interactive Map Visual */}
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video relative flex items-center justify-center text-center p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-agri-700 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">
                  SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Main Road, Near Rythu Bharosa Kendram, Telangana - 508213
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=SRI+ANJANEYA+FERTILIZERS+Telangana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
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
