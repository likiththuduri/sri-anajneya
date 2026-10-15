import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageSquare, Check, AlertTriangle, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

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
    const text = `*SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS*\n\nHello, I would like to check availability and book:\n- *Product:* ${product.name}\n- *Brand:* ${product.brand}\n- *Pack Size:* ${product.packSize}\n- *Price:* ₹${product.price}\n\nPlease let me know when I can collect it from the store.`;
    return `https://wa.me/917095891270?text=${encodeURIComponent(text)}`;
  };

  // Image source with fallback
  const imageSrc = imageError || !product.imageUrl
    ? 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
    : product.imageUrl;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/90 hover:border-agri-400 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Product Image Area */}
      <Link to={`/products/${product.id}`} className="relative block bg-gray-100 overflow-hidden aspect-[4/3]">
        <img
          src={imageSrc}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Brand Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-gray-800 shadow-sm backdrop-blur-sm">
            {product.brand}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-2.5 right-2.5">
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
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-gray-500 font-medium">Price: </span>
              <span className="text-lg font-extrabold text-agri-950">
                ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">Store Pickup</span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition shadow-sm ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isAdding
                  ? 'bg-agri-700 text-white'
                  : 'bg-agri-600 hover:bg-agri-700 text-white active:scale-95'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                </>
              )}
            </button>

            <a
              href={getWhatsAppQuickOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 transition active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-green-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
