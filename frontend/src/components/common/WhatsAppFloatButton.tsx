import React from 'react';
import { MessageSquare } from 'lucide-react';

export const WhatsAppFloatButton: React.FC = () => {
  const shopWhatsAppNumber = '917095891270';
  const message = 'Hello SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS! I need assistance with agricultural products and availability.';
  const url = `https://wa.me/${shopWhatsAppNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Shop on WhatsApp"
      className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-green-600/40 transition-all duration-300 hover:scale-105"
    >
      <div className="relative">
        <MessageSquare className="w-6 h-6 fill-white" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full" />
      </div>
      <div className="hidden sm:flex flex-col text-left">
        <span className="text-[10px] uppercase font-bold text-green-100 tracking-wider">Fast Response</span>
        <span className="text-xs font-extrabold text-white">Order on WhatsApp</span>
      </div>
    </a>
  );
};
