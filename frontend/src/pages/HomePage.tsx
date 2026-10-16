import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Sprout, Bug, Wheat, Droplet, MessageSquare, MapPin, CheckCircle2, Phone, Calendar, Store, Navigation } from 'lucide-react';
import { Product, WebsiteSection } from '../types';
import { productsApi } from '../api/products';
import { sectionsApi } from '../api/sections';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/common/ProductCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<WebsiteSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [products, activeSections] = await Promise.all([
          productsApi.getFeaturedProducts(),
          sectionsApi.getActiveSections().catch(() => []),
        ]);
        setFeaturedProducts(products);
        if (activeSections && activeSections.length > 0) {
          setSections(activeSections);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const getSection = (key: string): WebsiteSection | undefined => {
    return sections.find((s) => 
      s.sectionKey === key || 
      s.sectionKey === key.replace('_section', '') ||
      (key === 'hero_section' && s.sectionKey === 'hero') ||
      (key === 'categories_section' && s.sectionKey === 'categories') ||
      (key === 'benefits_section' && s.sectionKey === 'benefits') ||
      (key === 'advance_booking_promo' && s.sectionKey === 'booking_info') ||
      (key === 'store_location_map' && s.sectionKey === 'location_map')
    );
  };

  const isSectionEnabled = (key: string): boolean => {
    if (sections.length === 0) return true; // Default visible if not loaded or empty
    const sec = getSection(key);
    return sec ? sec.enabled : true;
  };

  const cleanPhone = (settings.phone || '919000000000').replace(/[^0-9]/g, '');
  const cleanWhatsApp = (settings.whatsapp || '919000000000').replace(/[^0-9]/g, '');
  const directionsUrl = settings.directionsUrl || settings.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent((settings.shopName || 'SRI ANJANEYA FERTILIZERS') + ' ' + (settings.address || 'Telangana'))}`;

  const hasCustomHeroImage = Boolean(settings.heroImageUrl && settings.heroImageUrl.trim() !== '');
  const heroImageSrc = hasCustomHeroImage
    ? settings.heroImageUrl
    : 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=80';

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
      {isSectionEnabled('hero_section') && (
        <section className="relative bg-agri-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[520px] flex items-center">
          {/* Actual Shop Image or Identified Placeholder Background */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroImageSrc}
              alt="Shop Building Background"
              className="w-full h-full object-cover object-center"
            />
            {/* Dark green gradient overlay to ensure text contrast and readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-agri-950/95 via-agri-950/85 to-agri-900/80 backdrop-blur-[1px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center w-full">
            {/* Store Identification Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-800/80 border border-agri-500/40 text-agri-200 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-agri-400 animate-pulse" />
              <span>Telangana Govt. Approved Agricultural Supply Center</span>
            </div>

            {/* Exact Official Shop Branding */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
              {settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}
            </h1>

            <p className="mt-6 text-base sm:text-xl text-agri-100 max-w-2xl leading-relaxed">
              {settings.heroSubtitle ||
                'Authorized supplier of genuine fertilizers, certified hybrid seeds, and proven crop protection chemicals. Order online or book in advance for in-store pickup.'}
            </p>

            {/* Indicator badge if photo is placeholder */}
            {!hasCustomHeroImage && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/40 border border-white/20 text-[11px] text-gray-200 backdrop-blur-sm">
                <span>📷 Note: Temporary agricultural photo. Administrator can upload the actual shop storefront photo from Admin Settings.</span>
              </div>
            )}

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-agri-500 to-agri-600 hover:from-agri-600 hover:to-agri-700 text-white font-extrabold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-agri-600/30 transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{settings.heroCtaText || 'Browse All Products'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 bg-white hover:bg-agri-50 text-agri-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <Calendar className="w-5 h-5 text-agri-700" />
                <span>{settings.heroBookCtaText || 'Advance Booking'}</span>
              </Link>

              {/* Call Now and WhatsApp Us Action Buttons */}
              <div className="flex items-center gap-2 sm:ml-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-2 bg-agri-800/90 hover:bg-agri-800 text-white font-bold px-4 py-3.5 rounded-xl border border-agri-600/50 shadow transition active:scale-95 text-sm"
                >
                  <Phone className="w-4 h-4 text-agri-300" />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3.5 rounded-xl shadow transition active:scale-95 text-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            {/* Key Advantages / Trust Indicators */}
            {isSectionEnabled('benefits_section') && (
              <div className="mt-12 pt-8 border-t border-agri-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left w-full">
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
            )}
          </div>
        </section>
      )}

      {/* Advance Booking Promo Section */}
      {isSectionEnabled('advance_booking_promo') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500/10 via-agri-50 to-green-500/10 border-2 border-agri-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                <Calendar className="w-3.5 h-3.5" />
                Advance Reservation Service
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                Reserve Seasonal Seeds &amp; Fertilizers Ahead of Time
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
                Avoid seasonal shortages and price spikes. Use our <strong>Book Now</strong> button to reserve agricultural inputs for in-store pickup without prepayment.
              </p>
            </div>
            <Link
              to="/products"
              className="shrink-0 px-6 py-3 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Explore Products &amp; Book Now</span>
            </Link>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      {isSectionEnabled('categories_section') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-50 px-3 py-1 rounded-full border border-agri-200">
              Agricultural Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
              Explore by Product Category
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Select a category to view authorized brands, pack sizes, and prices in Indian Rupees (₹).
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
      )}

      {/* Featured Products Section */}
      {isSectionEnabled('featured_products') && (
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
      )}

      {/* Local Store Pickup Guidance Banner */}
      {isSectionEnabled('pickup_instructions') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-agri-800 to-agri-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-agri-200 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Easy Local Counter Pickup in {settings.state || 'Telangana'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                How In-Store Counter Pickup Works
              </h3>
              <p className="text-sm sm:text-base text-agri-100 leading-relaxed whitespace-pre-line">
                {settings.pickupInstructions ||
                  "1. Add products to cart or click 'Book Now' for advance reservation.\n2. Submit your name and 10-digit mobile number.\n3. Receive your unique Booking / Order reference.\n4. Visit our counter, verify your reference, pay in cash/UPI, and collect your products!"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                to="/products"
                className="px-6 py-3.5 rounded-xl bg-white text-agri-900 font-bold text-sm shadow hover:bg-agri-50 transition text-center"
              >
                Browse Catalog
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
      )}

      {/* Store Location Section */}
      {isSectionEnabled('store_location_map') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-50 px-3 py-1 rounded-full border border-agri-200 inline-block">
                Visit Our Store Counter
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900">
                {settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                {settings.address || 'Main Road, Telangana, India - 508001'}
              </p>
              <div className="text-xs text-gray-500">
                Timings: <strong>{settings.openingHours || 'Monday - Sunday: 7:00 AM - 8:30 PM'}</strong>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs sm:text-sm shadow transition inline-flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
              <Link
                to="/contact"
                className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm transition inline-flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-agri-700" />
                <span>Store Information</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
