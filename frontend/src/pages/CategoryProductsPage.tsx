import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sprout, Bug, Wheat, Droplet, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';
import { productsApi } from '../api/products';
import { ProductCard } from '../components/common/ProductCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface CategoryProductsPageProps {
  categorySlugOverride?: string;
  categoryTitle?: string;
}

export const CategoryProductsPage: React.FC<CategoryProductsPageProps> = ({
  categorySlugOverride,
  categoryTitle,
}) => {
  const params = useParams<{ slug?: string }>();
  const slug = categorySlugOverride || params.slug || 'fertilizers';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortParam, setSortParam] = useState('newest');

  const categoryMetadata: Record<string, { title: string; subtitle: string; icon: any; color: string }> = {
    fertilizers: {
      title: 'Fertilizers & Soil Nutrition',
      subtitle: 'Primary Macronutrients (Urea, DAP, MOP, Complex NPK) & Soil Enriched Conditioners for high-yield farming in Telangana.',
      icon: Sprout,
      color: 'bg-gradient-to-r from-emerald-800 to-green-900',
    },
    pesticides: {
      title: 'Crop Protection & Pesticides',
      subtitle: 'Approved Insecticides, Fungicides, and Herbicides from Bayer, FMC, Syngenta, and Coromandel for complete pest control.',
      icon: Bug,
      color: 'bg-gradient-to-r from-amber-800 to-yellow-950',
    },
    seeds: {
      title: 'Certified Hybrid Seeds',
      subtitle: 'Govt.-tested high germination hybrid seeds: Rasi Bollgard II Cotton, Bayer Paddy, Pioneer Maize, and Kaveri Chilli seeds.',
      icon: Wheat,
      color: 'bg-gradient-to-r from-teal-800 to-emerald-950',
    },
    micronutrients: {
      title: 'Micronutrients & Foliar Nutrition',
      subtitle: 'Zinc, Boron, Ferrous, and Chelated Multi-Micronutrient boosters to prevent crop deficiencies and maximize harvest weight.',
      icon: Droplet,
      color: 'bg-gradient-to-r from-cyan-900 to-blue-950',
    },
  };

  const currentMeta = categoryMetadata[slug.toLowerCase()] || {
    title: categoryTitle || 'Agricultural Products',
    subtitle: 'Quality agricultural inputs tested for Telangana agricultural conditions.',
    icon: Sprout,
    color: 'bg-gradient-to-r from-agri-900 to-agri-950',
  };

  const Icon = currentMeta.icon;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productsApi.getPublicProducts({
          category: slug,
          sort: sortParam,
        });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load category products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug, sortParam]);

  return (
    <div className="space-y-8 pb-16">
      {/* Category Banner */}
      <section className={`${currentMeta.color} text-white py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-agri-200 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-agri-200">
                <Icon className="w-3.5 h-3.5" />
                <span>Agricultural Department</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                {currentMeta.title}
              </h1>
              <p className="text-sm sm:text-base text-agri-100 leading-relaxed pt-1">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-700">
            Available Products: <span className="text-agri-700 text-sm font-extrabold">{products.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={sortParam}
              onChange={(e) => setSortParam(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-agri-500 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High (₹)</option>
              <option value="price-desc">Price: High to Low (₹)</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="stock-desc">Stock Availability</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <LoadingSpinner message={`Loading ${currentMeta.title} catalog...`} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">No products found in this category.</p>
            <Link to="/products" className="mt-3 inline-block text-xs font-bold text-agri-700">
              Browse All Products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
