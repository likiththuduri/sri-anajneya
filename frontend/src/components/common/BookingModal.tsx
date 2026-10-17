import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, MessageSquare, Copy, Check, AlertCircle, ShoppingBag, MapPin, Sparkles } from 'lucide-react';
import { Product, Booking } from '../../types';
import { bookingsApi } from '../../api/bookings';
import { resolveImageUrl, DEFAULT_PRODUCT_FALLBACK } from '../../utils/imageUrl';

interface BookingModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerMobile, setCustomerMobile] = useState<string>('');
  const [preferredPickupDate, setPreferredPickupDate] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setCustomerName('');
      setCustomerMobile('');
      setPreferredPickupDate('');
      setCustomerNotes('');
      setErrorMessage(null);
      setConfirmedBooking(null);
      setCopied(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const unitPrice = Number(product.price);
  const estimatedTotal = unitPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanMobile = customerMobile.replace(/[^0-9]/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (quantity < 1) {
      setErrorMessage('Quantity must be at least 1.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await bookingsApi.createBooking({
        productId: product.id,
        quantity,
        customerName: customerName.trim(),
        customerMobile: cleanMobile,
        preferredPickupDate: preferredPickupDate || undefined,
        customerNotes: customerNotes.trim() || undefined,
      });

      setConfirmedBooking(response);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit booking request. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (confirmedBooking?.bookingReference) {
      navigator.clipboard.writeText(confirmedBooking.bookingReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Min date for pickup is today
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-gray-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-agri-100 flex items-center justify-center text-agri-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-tight">
                {confirmedBooking ? 'Booking Received' : 'Advance Product Booking'}
              </h2>
              <span className="text-[11px] font-semibold text-agri-700">
                SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {confirmedBooking ? (
            /* Confirmation Screen */
            <div className="space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 mb-2">
                  Status: PENDING SHOP ACCEPTANCE
                </span>
                <h3 className="text-xl font-black text-gray-900">
                  Booking Request Submitted!
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{confirmedBooking.customerName}</strong>! Your advance reservation has been received. Our shop staff will verify inventory and prepare your items.
                </p>
              </div>

              {/* Unique Booking Reference Card */}
              <div className="bg-agri-50/80 border border-agri-200 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-agri-900 uppercase tracking-wider">
                    Booking Reference
                  </span>
                  <button
                    onClick={handleCopyReference}
                    className="inline-flex items-center gap-1 text-xs text-agri-700 hover:text-agri-900 font-semibold px-2 py-0.5 rounded bg-white border border-agri-200 shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xl font-mono font-black text-agri-950 tracking-wider">
                  {confirmedBooking.bookingReference}
                </div>
                <div className="border-t border-agri-200/80 pt-2 grid grid-cols-2 gap-2 text-xs text-gray-700">
                  <div>
                    <span className="text-gray-500 block">Product:</span>
                    <strong className="text-gray-900">{confirmedBooking.productName}</strong> ({confirmedBooking.packSize})
                  </div>
                  <div>
                    <span className="text-gray-500 block">Quantity &amp; Est. Total:</span>
                    <strong className="text-gray-900">{confirmedBooking.quantity} units • ₹{Number(confirmedBooking.totalAmount).toLocaleString('en-IN')}</strong>
                  </div>
                  {confirmedBooking.preferredPickupDate && (
                    <div className="col-span-2">
                      <span className="text-gray-500 block">Preferred Pickup Date:</span>
                      <strong className="text-gray-900">{confirmedBooking.preferredPickupDate}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Local Counter Notice */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-left text-xs text-amber-900">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Local Store Pickup:</strong> Please present your booking reference at our shop counter. Payment is collected at pickup via cash or UPI.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                {confirmedBooking.whatsAppUrl && (
                  <a
                    href={confirmedBooking.whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition active:scale-98 text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Booking Slip to WhatsApp</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Preview Card */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                <img
                  src={resolveImageUrl(product.imageUrl, DEFAULT_PRODUCT_FALLBACK)}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-200 shrink-0 bg-white"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-agri-700 bg-agri-100/80 px-2 py-0.5 rounded-md inline-block mb-1">
                    {product.brand}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 leading-snug truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-600 mt-0.5">
                    <span>Pack: <strong>{product.packSize}</strong></span>
                    <span>•</span>
                    <span className="text-agri-950 font-bold">
                      ₹{unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Select Booking Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 transition active:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 text-center font-bold text-gray-900 text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 transition active:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-xs text-gray-600">
                    Estimated Total: <strong className="text-base text-agri-950 font-black">₹{estimatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>
              </div>

              {/* Customer Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              {/* Customer 10-Digit Mobile */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  10-Digit Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-12 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                  />
                </div>
                <span className="text-[11px] text-gray-400 mt-0.5 block">
                  We will use this to confirm your booking and send WhatsApp status updates.
                </span>
              </div>

              {/* Preferred Pickup Date */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Preferred Pickup Date (Optional)
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={preferredPickupDate}
                  onChange={(e) => setPreferredPickupDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Special Notes or Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need early morning pickup / urgent for sowing season"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition"
                />
              </div>

              {/* Local Pickup Notice */}
              <div className="flex items-start gap-2.5 bg-agri-50 border border-agri-200/90 rounded-2xl p-3.5 text-xs text-agri-950">
                <MapPin className="w-4 h-4 text-agri-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Local Shop Pickup Notice:</strong> Advance bookings reserve products at our shop counter. No online payment required. Pay in cash or UPI at pickup.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agri-700 to-agri-800 hover:from-agri-800 hover:to-agri-900 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition active:scale-98 disabled:opacity-60 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Request...' : 'Confirm Advance Booking'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
