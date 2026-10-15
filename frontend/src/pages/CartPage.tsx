import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, CheckCircle2, MessageSquare, AlertCircle, MapPin, Store, User, Phone, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ordersApi } from '../api/orders';
import { Order } from '../types';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerVillage, setCustomerVillage] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError('Your cart is empty. Please add products before submitting.');
      return;
    }

    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    const cleanMobile = customerMobile.replace(/\D/g, '');
    if (cleanMobile.length < 10 || cleanMobile.length > 12) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerMobile: cleanMobile,
        customerVillage: customerVillage.trim() || 'Telangana',
        customerNotes: customerNotes.trim(),
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      // 1. Save in MySQL database via Spring Boot backend
      const savedOrder = await ordersApi.createOrder(orderPayload);

      // 2. Clear customer shopping cart
      clearCart();
      setCompletedOrder(savedOrder);
      showToast(`Order ${savedOrder.orderNumber} placed successfully!`, 'success');

      // 3. Open WhatsApp automatically
      if (savedOrder.whatsAppUrl) {
        window.open(savedOrder.whatsAppUrl, '_blank');
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      setFormError(err?.message || 'Failed to submit order. Please try again or contact the shop directly.');
      showToast(err?.message || 'Order submission failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmed Screen
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-agri-200 shadow-xl overflow-hidden text-center p-8 sm:p-12 space-y-6">
          <div className="w-16 h-16 bg-agri-100 rounded-full flex items-center justify-center mx-auto text-agri-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-agri-700 uppercase tracking-widest bg-agri-50 px-3 py-1 rounded-full border border-agri-200">
              Order Confirmed &amp; Saved
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Thank You, {completedOrder.customerName}!
            </h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Your order has been recorded in the database. Please visit our store counter for local pickup and collection.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left space-y-4 max-w-lg mx-auto">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-xs text-gray-500 font-semibold uppercase">Order Number:</span>
              <span className="font-mono text-base font-extrabold text-agri-800">
                {completedOrder.orderNumber}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Customer Mobile:</span>
              <span className="font-bold text-gray-800">{completedOrder.customerMobile}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Collection Mode:</span>
              <span className="font-bold text-agri-700 bg-agri-100 px-2 py-0.5 rounded">Store Pickup</span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Booked Items:</h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {completedOrder.items?.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.productName} ({item.packSize}) × {item.quantity}</span>
                    <span className="font-bold text-gray-900">₹{Number(item.subtotal).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline font-extrabold">
              <span className="text-sm text-gray-800">Total Amount Payable:</span>
              <span className="text-xl text-agri-950">₹{Number(completedOrder.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 max-w-md mx-auto pt-2">
            {completedOrder.whatsAppUrl && (
              <a
                href={completedOrder.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>Open WhatsApp Order Message</span>
              </a>
            )}

            <Link
              to="/products"
              className="block w-full py-3 px-6 rounded-xl border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-agri-50 rounded-full flex items-center justify-center mx-auto text-agri-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Add fertilizers, seeds, pesticides, or micronutrients from our catalog to book for local pickup.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm rounded-xl shadow transition"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-agri-700">
          SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          Your Shopping Cart &amp; Local Pickup Booking
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review your items and enter your details to generate your official store pickup order slip.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-base">Cart Items ({totalItems})</h2>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-600 hover:text-red-700 transition"
            >
              Clear Cart
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.product.id} className="py-4 flex gap-4 items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.product.imageUrl || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=200&q=80'}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-agri-700 bg-agri-50 px-2 py-0.5 rounded">
                      {item.product.brand}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm truncate mt-0.5">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Pack: {item.product.packSize} • ₹{item.product.price} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 text-xs">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 transition font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-gray-900 bg-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-extrabold text-agri-950">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-600 p-1 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-extrabold">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-xl text-agri-950">₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Local Pickup Booking Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
          <div>
            <span className="text-xs font-bold text-agri-700 uppercase tracking-wider">
              Step 2 of 2
            </span>
            <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">
              Customer &amp; Pickup Details
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              No online payment required. Pay by Cash or UPI when collecting at our store counter.
            </p>
          </div>

          {formError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Reddy"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mobile Number (for WhatsApp confirmation) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  maxLength={12}
                  placeholder="10-digit mobile number"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Village / Town in Telangana
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Nalgonda, Suryapet, Khammam"
                  value={customerVillage}
                  onChange={(e) => setCustomerVillage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Optional Order Notes (e.g. pickup time, crop type)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  placeholder="Add any specific requests or questions..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Store Pickup Banner */}
            <div className="p-3 bg-agri-50 border border-agri-200 rounded-xl text-[11px] text-agri-900 flex items-start gap-2">
              <Store className="w-4 h-4 text-agri-700 shrink-0 mt-0.5" />
              <span>
                <strong>Store Pickup Location:</strong> SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS, Main Road, Telangana, India.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agri-600 to-agri-800 hover:from-agri-700 hover:to-agri-900 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving Order in Database...</span>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Submit Order &amp; Open WhatsApp Slip</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
