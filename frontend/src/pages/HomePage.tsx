import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Sprout, Bug, Wheat, Droplet, MessageSquare, MapPin, CheckCircle2 } from 'lucide-react';
import { Product, ShopSetting } from '../types';
import { productsApi } from '../api/products';
import { settingsApi } from '../api/settings';
import { ProductCard } from '../components/common/ProductCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<ShopSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [products, shopSettings] = await Promise.all([
          productsApi.getFeaturedProducts(),
          settingsApi.getPublicSettings().catch(() => null),
        ]);
        setFeaturedProducts(products);
        if (shopSettings) setSettings(shopSettings);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const categories = [
    {
      name: 'Fertilizers',
      slug: 'fertilizers',
      path: '/fertilizers',
      description: 'DAP, Urea, NPK Complexes & Soil Conditioners',
      icon: Sprout,
      color: 'from-emerald-700 to-green-900',
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Pesticides',
      slug: 'pesticides',
      path: '/pesticides',
      description: 'Insecticides, Fungicides & Plant Protection',
      icon: Bug,
      color: 'from-amber-700 to-yellow-900',
      image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Certified Seeds',
      slug: 'seeds',
      path: '/seeds',
      description: 'High-Yield Hybrid Cotton, Paddy & Maize',
      icon: Wheat,
      color: 'from-teal-700 to-emerald-900',
      image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Micronutrients',
      slug: 'micronutrients',
      path: '/micronutrients',
      description: 'Zinc, Boron & Liquid Growth Stimulants',
      icon: Droplet,
      color: 'from-cyan-700 to-blue-900',
      image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-agri-950 via-agri-900 to-agri-800 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative overlay */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=80"
            alt="Lush green agricultural fields"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-agri-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-800/80 border border-agri-600/50 text-agri-200 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-agri-400 animate-pulse" />
            Telangana's Trusted Agricultural Supply Center
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
            SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS
          </h1>

          <p className="mt-6 text-base sm:text-xl text-agri-100 max-w-2xl leading-relaxed">
            {settings?.heroSubtitle ||
              'Authorized supplier of genuine fertilizers, certified hybrid seeds, and proven crop protection chemicals. Order online and collect at our store counter.'}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-agri-500 to-agri-600 hover:from-agri-600 hover:to-agri-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-agri-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Browse All Products</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <a
              href="https://wa.me/917095891270?text=Hello%20SRI%20ANJANEYA%20FERTILIZERS,%20I%20would%20like%20to%20order%20agricultural%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-green-600 hover:bg-green-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              <span>WhatsApp Direct Order</span>
            </a>
          </div>

          {/* Key Advantages Pills */}
          <div className="mt-12 pt-8 border-t border-agri-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-agri-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-agri-100">100% Genuine Certified Stocks</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-agri-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-agri-100">Transparent Fair Prices (₹)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-agri-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-agri-100">Same-Day Local Store Pickup</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-agri-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-agri-100">Experienced Agronomy Advice</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-50 px-3 py-1 rounded-full border border-agri-200">
            Agricultural Essentials
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
            Explore by Product Category
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Select a category to view authorized brands, pack sizes, and prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={cat.path}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white hover:border-agri-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-lg font-bold">{cat.name}</span>
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-md">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{cat.description}</p>
                  <div className="flex items-center text-xs font-bold text-agri-700 group-hover:text-agri-800">
                    <span>View Products</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-50 px-3 py-1 rounded-full border border-agri-200">
              Popular with Telangana Farmers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Featured Agricultural Inputs
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-agri-700 hover:text-agri-800 transition"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Fetching featured products from store database..." />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">No featured products currently available.</p>
            <Link to="/products" className="mt-3 inline-block text-sm font-bold text-agri-700">
              Explore full catalog →
            </Link>
          </div>
        )}
      </section>

      {/* Local Store Pickup Guidance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-agri-800 to-agri-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-agri-200 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Easy Local Pickup in Telangana</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              How Local Pickup Ordering Works
            </h3>
            <p className="text-sm sm:text-base text-agri-100 leading-relaxed">
              1. Add your needed seeds, fertilizers, or pesticides to your cart.<br />
              2. Enter your name and mobile number, then submit your order.<br />
              3. WhatsApp opens with your official order slip.<br />
              4. Visit our counter, verify your order number, pay and collect your inputs immediately!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              to="/products"
              className="px-6 py-3.5 rounded-xl bg-white text-agri-900 font-bold text-sm shadow hover:bg-agri-50 transition text-center"
            >
              Start Shopping
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-xl bg-agri-700/80 hover:bg-agri-700 text-white font-bold text-sm border border-agri-500/50 transition text-center"
            >
              Store Location &amp; Map
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
