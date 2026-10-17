import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, MessageSquare, ShieldCheck, Check, AlertTriangle, MapPin, Store, Calendar, Clock } from 'lucide-react';
import { Product } from '../types';
import { productsApi } from '../api/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BookingModal } from '../components/common/BookingModal';
import { useSettings } from '../context/SettingsContext';
import { resolveImageUrl, DEFAULT_PRODUCT_FALLBACK } from '../utils/imageUrl';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { settings } = useSettings();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    productsApi.getProductById(Number(id))
      .then(setProduct)
      .catch((err) => console.error('Error loading product details:', err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading product information..." />;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-gray-500 mt-2 text-sm">The product you are looking for may have been removed or discontinued.</p>
        <Link to="/products" className="mt-4 inline-block px-5 py-2.5 bg-agri-700 text-white rounded-xl font-bold text-sm">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const canBook = product.bookingAvailable !== false && !isOutOfStock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    const result = addToCart(product, quantity);
    if (result.success) {
      showToast(result.message || `${quantity} x ${product.name} added to cart`, 'success');
    } else {
      showToast(result.message || 'Could not add to cart', 'error');
    }
    setTimeout(() => setIsAdding(false), 800);
  };

  const getWhatsAppMessageUrl = () => {
    const cleanPhone = (settings.whatsapp || '919000000000').replace(/[^0-9]/g, '');
    const text = `*${settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}*\n\nHello, I would like to book for local pickup:\n- *Product:* ${product.name}\n- *Brand:* ${product.brand}\n- *Pack Size:* ${product.packSize}\n- *Quantity:* ${quantity}\n- *Total Price:* ₹${(Number(product.price) * quantity).toFixed(2)}\n\nPlease confirm availability and pickup timings.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Image source resolved with backend base URL and fallback
  const resolvedSrc = resolveImageUrl(product.imageUrl, DEFAULT_PRODUCT_FALLBACK);
  const imageSrc = imageError ? DEFAULT_PRODUCT_FALLBACK : resolvedSrc;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link to="/" className="hover:text-agri-700">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-agri-700">Products</Link>
          <span>/</span>
          {product.categorySlug && (
            <>
              <Link to={`/${product.categorySlug}`} className="hover:text-agri-700">
                {product.categoryName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Details Section */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Image Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center">
                {isImageLoading && !imageError && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <span className="text-xs text-gray-400 font-semibold">Loading product image...</span>
                  </div>
                )}
                <img
                  src={imageSrc}
                  alt={product.name}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => {
                    setIsImageLoading(false);
                    setImageError(true);
                  }}
                  className={`w-full h-full object-cover object-center ${
                    isImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 text-gray-800 shadow-sm backdrop-blur-sm">
                    {product.brand}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                  {isOutOfStock ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-800 border border-red-200 shadow-sm">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Only {product.stock} left
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                      In Stock ({product.stock} available)
                    </span>
                  )}
                  {product.bookingAvailable !== false && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-agri-800 text-white shadow-sm">
                      Advance Booking Open
                    </span>
                  )}
                </div>
              </div>

              {/* Local pickup assurance */}
              <div className="p-4 rounded-2xl bg-agri-50 border border-agri-200 text-xs text-agri-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-agri-800">
                  <Store className="w-4 h-4 text-agri-700" />
                  <span>Physical Store Pickup Counter</span>
                </div>
                <p className="leading-relaxed">
                  Reserve online or via advance booking, then collect directly at our store counter. Genuine products with store invoice.
                </p>
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-agri-700 font-bold uppercase tracking-wider">
                  <span>{product.categoryName || 'Agricultural Crop Input'}</span>
                  <span>•</span>
                  <span>Pack Size: {product.packSize}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                <div className="text-xs text-gray-500">
                  Manufactured by <strong className="text-gray-800">{product.brand}</strong> • Store counter pickup
                </div>

                {/* Price Banner */}
                <div className="pt-2 pb-3 border-y border-gray-100 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-agri-950">
                    ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">
                    (Inclusive of all taxes)
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Overview &amp; Usage</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description || 'Agricultural input for crop development and protection.'}
                  </p>
                </div>

                {/* Booking Notes if any */}
                {product.bookingNotes && (
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                    <strong className="block font-bold">Advance Booking Note:</strong>
                    <p>{product.bookingNotes}</p>
                  </div>
                )}
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-bold text-sm text-gray-900 bg-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock || 100, q + 1))}
                      disabled={quantity >= (product.stock || 100) || isOutOfStock}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    Subtotal: <strong className="text-agri-900 text-sm">₹{(Number(product.price) * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                  </span>
                </div>

                {/* Primary Advance Booking Button */}
                {canBook && (
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-sm bg-gradient-to-r from-agri-700 to-agri-800 hover:from-agri-800 hover:to-agri-900 text-white shadow-md transition active:scale-98"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Now for In-Store Pickup (Advance Reservation)</span>
                  </button>
                )}

                {/* Secondary: Cart & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition shadow-sm ${
                      isOutOfStock
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isAdding
                        ? 'bg-agri-800 text-white'
                        : 'bg-agri-50 hover:bg-agri-100 text-agri-900 border border-agri-300 active:scale-95'
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-agri-700" />
                        <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Cart'}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getWhatsAppMessageUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 transition active:scale-95 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        product={product}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};
