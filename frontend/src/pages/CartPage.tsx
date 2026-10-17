import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, ShoppingBag, ArrowRight, CheckCircle2, MessageSquare, 
  AlertCircle, MapPin, Store, User, Phone, FileText, CreditCard, ShieldCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { ordersApi } from '../api/orders';
import { paymentsApi, PaymentConfig } from '../api/payments';
import { Order } from '../types';
import { resolveImageUrl, DEFAULT_PRODUCT_FALLBACK } from '../utils/imageUrl';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { showToast } = useToast();
  const { settings } = useSettings();

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerVillage, setCustomerVillage] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COUNTER_PICKUP' | 'ONLINE'>('COUNTER_PICKUP');
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    paymentsApi.getConfig()
      .then(setPaymentConfig)
      .catch((err) => console.warn('Could not load payment gateway config:', err));
  }, []);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
        customerVillage: customerVillage.trim() || settings.state || 'Telangana',
        customerNotes: customerNotes.trim(),
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      // 1. Save in MySQL database via Spring Boot backend
      const savedOrder = await ordersApi.createOrder(orderPayload);

      // If Online Payment is chosen
      if (paymentMethod === 'ONLINE') {
        if (!paymentConfig?.onlinePaymentEnabled) {
          showToast('Online payment gateway is in test/setup mode. Please choose Pay at Store Counter.', 'info');
          setIsSubmitting(false);
          return;
        }

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load secure payment gateway. Please check your internet connection.');
        }

        // Initiate payment on backend
        const initRes = await paymentsApi.initiatePayment({
          orderNumber: savedOrder.orderNumber,
          amount: totalPrice,
          customerName: customerName.trim(),
          customerMobile: cleanMobile,
        });

        // Open Razorpay Checkout Modal
        const options = {
          key: initRes.razorpayKeyId,
          amount: Math.round(Number(initRes.amount) * 100),
          currency: initRes.currency || 'INR',
          name: settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS',
          description: `Order ${savedOrder.orderNumber}`,
          image: resolveImageUrl(settings.logoUrl, '/anjaneya-logo.jpeg'),
          order_id: initRes.razorpayOrderId,
          prefill: {
            name: customerName.trim(),
            contact: cleanMobile,
          },
          theme: {
            color: '#15803d',
          },
          handler: async function (response: any) {
            try {
              const verifyRes = await paymentsApi.verifyPayment({
                paymentReference: initRes.paymentReference,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                setIsPaymentVerified(true);
                clearCart();
                setCompletedOrder(savedOrder);
                showToast(`Payment verified! Order ${savedOrder.orderNumber} confirmed!`, 'success');
              }
            } catch (err: any) {
              showToast(err?.message || 'Payment verification failed', 'error');
            }
          },
          modal: {
            ondismiss: function () {
              clearCart();
              setCompletedOrder(savedOrder);
              showToast('Online payment cancelled. You can settle payment at the shop counter upon pickup.', 'info');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setIsSubmitting(false);
        return;
      }

      // 2. Counter Pickup: Clear cart & show confirmation
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
              <span className="text-gray-500 font-medium">Payment Status:</span>
              {isPaymentVerified ? (
                <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-300">
                  ✓ Paid Online (Verified)
                </span>
              ) : (
                <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Pay at Counter on Pickup (Cash/UPI)
                </span>
              )}
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
              <span className="text-sm text-gray-800">Total Amount:</span>
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
          {settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          Your Shopping Cart &amp; Local Pickup Booking
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review your items and choose your payment option to generate your official store pickup order slip.
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
                    src={resolveImageUrl(item.product.imageUrl, DEFAULT_PRODUCT_FALLBACK)}
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

        {/* Local Pickup Booking & Payment Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
          <div>
            <span className="text-xs font-bold text-agri-700 uppercase tracking-wider">
              Step 2 of 2
            </span>
            <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">
              Customer &amp; Payment Details
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Select your payment preference and submit to confirm your order.
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
                Village / Locality
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Suryapet, Nalgonda, Choutuppal"
                  value={customerVillage}
                  onChange={(e) => setCustomerVillage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Optional Order Notes (e.g. pickup time)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  placeholder="Add any specific requests or pickup instructions..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Payment Options Selection */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-gray-800">
                Payment Option:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Option 1: Store Counter Pickup (Cash / UPI) */}
                <div
                  onClick={() => setPaymentMethod('COUNTER_PICKUP')}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                    paymentMethod === 'COUNTER_PICKUP'
                      ? 'border-agri-600 bg-agri-50/80 ring-1 ring-agri-500'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'COUNTER_PICKUP'}
                    onChange={() => setPaymentMethod('COUNTER_PICKUP')}
                    className="mt-1 text-agri-600 focus:ring-agri-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">Pay at Store Counter</span>
                    <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                      Cash or UPI when collecting products at counter.
                    </span>
                  </div>
                </div>

                {/* Option 2: Online Payment (Razorpay) */}
                <div
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                    paymentMethod === 'ONLINE'
                      ? 'border-agri-600 bg-agri-50/80 ring-1 ring-agri-500'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={() => setPaymentMethod('ONLINE')}
                    className="mt-1 text-agri-600 focus:ring-agri-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-gray-900">Pay Online</span>
                      <CreditCard className="w-3.5 h-3.5 text-agri-700" />
                    </div>
                    <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                      Instant UPI, Cards &amp; NetBanking via Razorpay.
                    </span>
                  </div>
                </div>
              </div>

              {paymentMethod === 'ONLINE' && !paymentConfig?.onlinePaymentEnabled && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Payment gateway is in test mode. Please use <strong>Pay at Store Counter</strong>.
                  </span>
                </div>
              )}
            </div>

            {/* Store Pickup Banner */}
            <div className="p-3 bg-agri-50 border border-agri-200 rounded-xl text-[11px] text-agri-900 flex items-start gap-2">
              <Store className="w-4 h-4 text-agri-700 shrink-0 mt-0.5" />
              <span>
                <strong>Store Pickup Location:</strong> {settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}, {settings.address || 'Main Road, Telangana, India'}.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agri-600 to-agri-800 hover:from-agri-700 hover:to-agri-900 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Processing Order &amp; Payment...</span>
              ) : paymentMethod === 'ONLINE' ? (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{totalPrice.toFixed(2)} Online</span>
                </>
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
