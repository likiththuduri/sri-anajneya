import React, { useEffect, useState } from 'react';
import { Save, Store, Phone, MessageSquare, MapPin, Image, CheckCircle2, AlertCircle } from 'lucide-react';
import { ShopSetting } from '../types';
import { settingsApi } from '../api/settings';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ShopSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Telangana');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsApi.getPublicSettings();
        setSettings(data);
        setPhone(data.phone || '917095891270');
        setWhatsapp(data.whatsapp || '917095891270');
        setAddress(data.address || 'Main Road, Near Rythu Bharosa Kendram, Telangana - 508213, India');
        setState(data.state || 'Telangana');
        setHeroTitle(data.heroTitle || 'Empowering Telangana Farmers with Genuine Agricultural Inputs');
        setHeroSubtitle(data.heroSubtitle || 'Authorized dealer of premium Fertilizers, certified Seeds, trusted Pesticides, and high-yield Micronutrients. Book online for local store pickup.');
        setHeroImageUrl(data.heroImageUrl || '');
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch settings from database.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const payload: Partial<ShopSetting> = {
        shopName: 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS',
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        address: address.trim(),
        state: state.trim(),
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        heroImageUrl: heroImageUrl.trim(),
      };

      const updated = await settingsApi.updateAdminSettings(payload);
      setSettings(updated);
      showToast('Shop contact information updated in MySQL database!', 'success');
    } catch (err: any) {
      setError(err?.message || 'Failed to save shop settings');
      showToast(err?.message || 'Settings update failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading shop configuration from database..." />;
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Shop Contact &amp; Branding Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Update the shop phone number, WhatsApp ordering number, address, and homepage hero texts stored in MySQL.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Exact Shop Name (Strict Enforcement) */}
        <div className="p-4 rounded-2xl bg-agri-50 border border-agri-200 space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-agri-800">
            Registered Shop Name (Permanent Branding)
          </label>
          <div className="font-black text-base sm:text-lg text-agri-950">
            SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS
          </div>
          <p className="text-[11px] text-agri-700">
            This exact name is consistently displayed across the header, footer, WhatsApp ordering messages, and public catalog.
          </p>
        </div>

        {/* Contact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Shop Calling Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Shop WhatsApp Number (Orders sent here) *
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-green-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 917095891270"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Full Store Address for Customer Counter Pickup *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none bg-gray-50"
            />
          </div>
        </div>

        {/* Homepage Hero Texts */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="font-extrabold text-sm text-gray-900">
            Homepage Hero Banner Configuration
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Hero Banner Title
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Hero Banner Subtitle
            </label>
            <textarea
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Hero Background Image URL (Optional)
            </label>
            <input
              type="text"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-agri-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving to Database...' : 'Save Settings in MySQL'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
