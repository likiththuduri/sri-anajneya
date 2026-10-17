import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw, X, AlertCircle } from 'lucide-react';
import { Product, Category } from '../types';
import { productsApi } from '../api/products';
import { categoriesApi } from '../api/categories';
import { ProductCard } from '../components/common/ProductCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AllProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters from URL or state
  const searchQuery = searchParams.get('query') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const inStockOnly = searchParams.get('inStock') === 'true';

  useEffect(() => {
    // Load categories once
    categoriesApi.getActiveCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await productsApi.getPublicProducts({
          query: searchQuery,
          category: selectedCategory,
          sort: selectedSort,
        });

        // Client-side in-stock filter if enabled
        const filtered = inStockOnly ? data.filter((p) => p.stock > 0) : data;
        setProducts(filtered);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch products from backend database.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, selectedSort, inStockOnly]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedSort !== 'newest' || inStockOnly);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-agri-700">
          SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-1">
          Products Catalog
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Browse fertilizers, seeds, crop protection products, and micronutrients available for in-store pickup.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name, brand (e.g. Coromandel, Bayer, Rasi)..."
              value={searchQuery}
              onChange={(e) => updateParam('query', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => updateParam('query', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => updateParam('category', e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-agri-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
            <select
              value={selectedSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-agri-500 bg-white"
            >
              <option value="newest">Newest Additions</option>
              <option value="price-asc">Price: Low to High (₹)</option>
              <option value="price-desc">Price: High to Low (₹)</option>
              <option value="name-asc">Product Name (A-Z)</option>
              <option value="stock-desc">Stock Availability</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Quick Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => updateParam('category', '')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                !selectedCategory
                  ? 'bg-agri-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParam('category', cat.slug)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat.slug
                    ? 'bg-agri-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                className="w-4 h-4 text-agri-600 rounded border-gray-300 focus:ring-agri-500"
              />
              <span>In-Stock Only</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Results Status */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
        <span>
          Showing <strong className="text-gray-900">{products.length}</strong> active products
        </span>
        {searchQuery && (
          <span>
            Search results for: <span className="text-agri-700 italic">"{searchQuery}"</span>
          </span>
        )}
      </div>

      {/* Grid of Products */}
      {isLoading ? (
        <LoadingSpinner message="Searching products from store database..." />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-800">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="font-bold text-base">Unable to load products</h3>
          <p className="text-xs text-red-600 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow hover:bg-red-700 transition"
          >
            Retry Connection
          </button>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No matching products found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
            Try adjusting your search terms, clearing category filters, or checking back later.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center gap-2 bg-agri-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow hover:bg-agri-800 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
