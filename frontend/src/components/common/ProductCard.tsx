import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageSquare, Check, AlertTriangle, Eye, Calendar } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import { resolveImageUrl, DEFAULT_PRODUCT_FALLBACK } from '../../utils/imageUrl';
import { BookingModal } from './BookingModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { settings } = useSettings();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const canBook = product.bookingAvailable !== false && !isOutOfStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    setIsAdding(true);
    const result = addToCart(product, 1);
    if (result.success) {
      showToast(result.message || `${product.name} added to cart`, 'success');
    } else {
      showToast(result.message || 'Could not add to cart', 'error');
    }

    setTimeout(() => setIsAdding(false), 800);
  };

  const getWhatsAppQuickOrderUrl = () => {
    const cleanPhone = (settings.whatsapp || '919000000000').replace(/[^0-9]/g, '');
    const text = `*${settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}*\n\nHello, I would like to check availability and book:\n- *Product:* ${product.name}\n- *Brand:* ${product.brand}\n- *Pack Size:* ${product.packSize}\n- *Price:* ₹${product.price}\n\nPlease let me know when I can collect it from the store.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Image source resolved with backend base URL and fallback
  const resolvedSrc = resolveImageUrl(product.imageUrl, DEFAULT_PRODUCT_FALLBACK);
  const imageSrc = imageError ? DEFAULT_PRODUCT_FALLBACK : resolvedSrc;

  return (
    <>
      <div className="group bg-white rounded-2xl border border-gray-200/90 hover:border-agri-400 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
        {/* Product Image Area */}
        <Link to={`/products/${product.id}`} className="relative block bg-gray-100 overflow-hidden aspect-[4/3]">
          {isImageLoading && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-[10px] text-gray-400 font-semibold">Loading...</span>
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
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
          />

          {/* Brand Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-gray-800 shadow-sm backdrop-blur-sm">
              {product.brand}
            </span>
          </div>

          {/* Stock / Booking Badge */}
          <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 shadow-sm">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                <AlertTriangle className="w-3 h-3" />
                Only {product.stock} left
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                In Stock
              </span>
            )}
            {product.bookingAvailable !== false && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-agri-800/90 text-white shadow-xs">
                Booking Open
              </span>
            )}
          </div>

          {/* Quick View Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1 bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
              <Eye className="w-3.5 h-3.5" />
              View Details
            </span>
          </div>
        </Link>

        {/* Content Area */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-agri-700 font-semibold mb-1">
              <span>{product.categoryName || 'Agricultural Input'}</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                {product.packSize}
              </span>
            </div>

            <Link to={`/products/${product.id}`} className="block">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug hover:text-agri-700 transition line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {product.description && (
              <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Pricing and Action Area */}
          <div className="mt-4 pt-3 border-t border-gray-100 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium">Price: </span>
                <span className="text-lg font-extrabold text-agri-950">
                  ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-[11px] text-gray-400">Store Pickup</span>
            </div>

            {/* Prominent Book Now Action Button */}
            {canBook && (
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-extrabold text-xs bg-agri-700 hover:bg-agri-800 text-white shadow-sm transition active:scale-98"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Now</span>
              </button>
            )}

            {/* Cart and WhatsApp buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition shadow-sm ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed col-span-2'
                    : isAdding
                    ? 'bg-agri-600 text-white'
                    : 'bg-agri-50 hover:bg-agri-100 text-agri-900 border border-agri-200 active:scale-95'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 text-agri-700" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                  </>
                )}
              </button>

              {!isOutOfStock && (
                <a
                  href={getWhatsAppQuickOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 transition active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                  <span>WhatsApp</span>
                </a>
              )}
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
