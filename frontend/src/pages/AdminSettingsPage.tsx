import React, { useEffect, useState, useRef } from 'react';
import { 
  Save, Store, Phone, MessageSquare, MapPin, Image as ImageIcon, 
  CheckCircle2, AlertCircle, Upload, RotateCcw, Navigation, Clock, 
  Sliders, ArrowUp, ArrowDown, Eye, EyeOff, ShieldCheck, Sparkles 
} from 'lucide-react';
import { ShopSetting, WebsiteSection } from '../types';
import { settingsApi } from '../api/settings';
import { sectionsApi } from '../api/sections';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'branding' | 'homepage' | 'address' | 'contact' | 'sections'>('branding');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states - Branding & Logo
  const [shopName, setShopName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Form states - Homepage Appearance
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('');
  const [heroBookCtaText, setHeroBookCtaText] = useState('');

  // Form states - Structured Address
  const [buildingName, setBuildingName] = useState('');
  const [doorPlotNumber, setDoorPlotNumber] = useState('');
  const [streetRoad, setStreetRoad] = useState('');
  const [landmark, setLandmark] = useState('');
  const [villageLocality, setVillageLocality] = useState('');
  const [mandalDistrict, setMandalDistrict] = useState('');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  // Form states - Maps
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [directionsUrl, setDirectionsUrl] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');

  // Form states - Contact, Timings & Announcements
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  // Sections management
  const [sections, setSections] = useState<WebsiteSection[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(false);

  // Hidden file input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  // Populate from settings
  useEffect(() => {
    if (settings) {
      setShopName(settings.shopName || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS');
      setLogoUrl(settings.logoUrl || '');
      setHeroTitle(settings.heroTitle || '');
      setHeroSubtitle(settings.heroSubtitle || '');
      setHeroImageUrl(settings.heroImageUrl || '');
      setHeroCtaText(settings.heroCtaText || 'Browse All Products');
      setHeroBookCtaText(settings.heroBookCtaText || 'Advance Booking');

      setBuildingName(settings.buildingName || '');
      setDoorPlotNumber(settings.doorPlotNumber || '');
      setStreetRoad(settings.streetRoad || 'Main Road');
      setLandmark(settings.landmark || '');
      setVillageLocality(settings.villageLocality || '');
      setMandalDistrict(settings.mandalDistrict || '');
      setState(settings.state || 'Telangana');
      setPincode(settings.pincode || '508001');
      setCountry(settings.country || 'India');

      setGoogleMapsUrl(settings.googleMapsUrl || '');
      setDirectionsUrl(settings.directionsUrl || '');
      setLatitude(settings.latitude !== undefined && settings.latitude !== null ? String(settings.latitude) : '');
      setLongitude(settings.longitude !== undefined && settings.longitude !== null ? String(settings.longitude) : '');

      setPhone(settings.phone || '');
      setWhatsapp(settings.whatsapp || '');
      setOpeningHours(settings.openingHours || 'Mon - Sun: 7:00 AM - 8:30 PM');
      setPickupInstructions(settings.pickupInstructions || '');
      setAnnouncementText(settings.announcementText || '');
      setAnnouncementEnabled(settings.announcementEnabled !== false);
    }
  }, [settings]);

  // Load sections when sections tab is active
  useEffect(() => {
    if (activeTab === 'sections') {
      setIsLoadingSections(true);
      sectionsApi.getAllSections()
        .then((data) => setSections(data))
        .catch((err) => showToast(err?.message || 'Failed to load website sections', 'error'))
        .finally(() => setIsLoadingSections(false));
    }
  }, [activeTab, showToast]);

  // Formatted address preview
  const formattedAddressPreview = [
    buildingName,
    doorPlotNumber ? `D.No. ${doorPlotNumber}` : '',
    streetRoad,
    landmark ? `Near ${landmark}` : '',
    villageLocality,
    mandalDistrict,
    `${state}${pincode ? ` - ${pincode}` : ''}`,
    country,
  ]
    .filter(Boolean)
    .join(', ');

  // Handle Logo Upload via Cloudinary
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      showToast('Uploading custom shop logo...', 'info');
      const res = await settingsApi.uploadShopAsset(file, 'sri_anjaneya_branding');
      if (res.url) {
        setLogoUrl(res.url);
        showToast('Logo uploaded successfully! Click Save Changes to publish.', 'success');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to upload logo image', 'error');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Handle Hero Background Image Upload
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      showToast('Uploading actual shop storefront photograph...', 'info');
      const res = await settingsApi.uploadShopAsset(file, 'sri_anjaneya_shop_photo');
      if (res.url) {
        setHeroImageUrl(res.url);
        showToast('Shop photo uploaded successfully! Click Save Changes to publish.', 'success');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to upload shop background image', 'error');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: Partial<ShopSetting> = {
        shopName: shopName.trim() || 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS',
        logoUrl: logoUrl.trim(),
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        heroImageUrl: heroImageUrl.trim(),
        heroCtaText: heroCtaText.trim(),
        heroBookCtaText: heroBookCtaText.trim(),

        buildingName: buildingName.trim(),
        doorPlotNumber: doorPlotNumber.trim(),
        streetRoad: streetRoad.trim(),
        landmark: landmark.trim(),
        villageLocality: villageLocality.trim(),
        mandalDistrict: mandalDistrict.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        country: country.trim(),

        googleMapsUrl: googleMapsUrl.trim(),
        directionsUrl: directionsUrl.trim(),
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,

        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        openingHours: openingHours.trim(),
        pickupInstructions: pickupInstructions.trim(),
        announcementText: announcementText.trim(),
        announcementEnabled: announcementEnabled,
      };

      await settingsApi.updateAdminSettings(payload);
      await refreshSettings();
      showToast('Shop settings and website customization saved to MySQL successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Sections management handlers
  const handleToggleSection = (index: number) => {
    const sec = sections[index];
    if (sec.sectionKey === 'admin_login') {
      showToast('Admin login section cannot be disabled for security reasons.', 'error');
      return;
    }

    const updated = [...sections];
    updated[index] = { ...sec, enabled: !sec.enabled };
    setSections(updated);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    // re-assign display orders
    const reordered = updated.map((s, idx) => ({ ...s, displayOrder: idx + 1 }));
    setSections(reordered);
  };

  const handleSaveSections = async () => {
    setIsSaving(true);
    try {
      // Save individual modified section titles/subtitles and reorder
      for (const s of sections) {
        await sectionsApi.updateSection(s.sectionKey, {
          title: s.title,
          subtitle: s.subtitle,
          enabled: s.enabled,
        });
      }

      await sectionsApi.reorderSections(
        sections.map((s, idx) => ({ sectionKey: s.sectionKey, displayOrder: idx + 1 }))
      );

      showToast('Website section visibility and order saved successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to save sections configuration', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">Website Customization &amp; Settings</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage shop logo, actual storefront background photo, structured address, Google Maps, and sections
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-agri-700 to-agri-800 hover:from-agri-800 hover:to-agri-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing Changes...' : 'Publish Changes'}</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
            activeTab === 'branding'
              ? 'bg-agri-700 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Shop Branding &amp; Logo</span>
        </button>

        <button
          onClick={() => setActiveTab('homepage')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
            activeTab === 'homepage'
              ? 'bg-agri-700 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Homepage Shop Photo &amp; Hero</span>
        </button>

        <button
          onClick={() => setActiveTab('address')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
            activeTab === 'address'
              ? 'bg-agri-700 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Structured Address &amp; Maps</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
            activeTab === 'contact'
              ? 'bg-agri-700 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact, Hours &amp; Announcement</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
            activeTab === 'sections'
              ? 'bg-agri-700 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Website Sections (Show/Hide/Reorder)</span>
        </button>
      </div>

      {/* Tab 1: Shop Branding & Logo */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-extrabold text-gray-900">Custom Agricultural Logo</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload your custom logo or retain the official agricultural emblem. Updates header, footer, and branding across devices.
            </p>
          </div>

          {/* Logo Upload Card */}
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/90 space-y-4">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
              Shop Logo (File / Gallery Upload Only)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Preview in light and dark background */}
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 p-2 flex items-center justify-center shadow-xs">
                  <img
                    src={logoUrl || '/logo.svg'}
                    alt="Logo Light Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-20 h-20 rounded-2xl bg-agri-950 p-2 flex items-center justify-center shadow-xs">
                  <img
                    src={logoUrl || '/logo.svg'}
                    alt="Logo Dark Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold shadow-sm transition active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading to Cloud...' : logoUrl ? 'Replace Logo' : 'Choose Logo Image'}</span>
                  </button>

                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl('');
                        showToast('Restored default official agricultural emblem logo.', 'info');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Default Logo</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Select a PNG, SVG, or JPG image from your phone gallery or computer files.
                </p>
              </div>
            </div>
          </div>

          {/* Shop Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
              Official Shop Name (Preserved Brand Identity)
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-agri-600 outline-none"
            />
            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
              <span>Must reflect official registration: <strong>SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS</strong></span>
              <button
                type="button"
                onClick={() => setShopName('SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS')}
                className="text-agri-700 hover:underline font-bold"
              >
                Reset to Official Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Homepage Appearance (Shop Photo & Hero) */}
      {activeTab === 'homepage' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-extrabold text-gray-900">Homepage Hero &amp; Actual Shop Photograph</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload a real photograph of your shop building or storefront to appear as the homepage background.
            </p>
          </div>

          {/* Actual Shop Image Upload & Live Preview */}
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                Shop Front Photograph (Cloud Storage)
              </label>
              {heroImageUrl ? (
                <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                  ✓ Actual Shop Photo Configured
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Temporary Agricultural Placeholder in Use
                </span>
              )}
            </div>

            {/* Live Hero Background Preview with Green Overlay */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/7] border border-gray-300 bg-agri-950 flex items-center justify-center p-6 text-center text-white">
              <img
                src={heroImageUrl || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=80'}
                alt="Shop Background Preview"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-agri-950/90 via-agri-950/80 to-agri-900/75" />
              <div className="relative z-10 space-y-2 max-w-lg">
                <span className="text-[10px] uppercase font-bold tracking-widest text-agri-300 bg-black/40 px-2.5 py-1 rounded-full border border-white/20">
                  Live Hero Preview
                </span>
                <h4 className="text-lg sm:text-2xl font-black text-white leading-tight">
                  {heroTitle || 'Quality Seeds, Fertilizers & Pesticides for Prosperous Farming'}
                </h4>
                <p className="text-xs text-agri-100 line-clamp-2">
                  {heroSubtitle || 'Serving hardworking farmers across Telangana with certified crop protection, fertilizers, and high-yield seeds.'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <input
                ref={heroInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeroImageUpload}
                disabled={isUploading}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => heroInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold shadow-sm transition active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Uploading Photograph...' : heroImageUrl ? 'Replace Shop Photo' : 'Choose Shop Photo'}</span>
              </button>

              {heroImageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setHeroImageUrl('');
                    showToast('Removed custom shop image. Temporary agricultural placeholder active.', 'info');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Remove (Use Placeholder)</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Upload a clear photo of the store front from your smartphone gallery or computer. The image is saved to cloud storage and rendered with a high-contrast green overlay.
            </p>
          </div>

          {/* Hero Headings & CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-gray-700">Hero Main Heading</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Quality Seeds, Fertilizers & Pesticides..."
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-gray-700">Hero Description / Subtitle</label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Serving hardworking farmers across Telangana..."
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Primary Button Label</label>
              <input
                type="text"
                value={heroCtaText}
                onChange={(e) => setHeroCtaText(e.target.value)}
                placeholder="Browse All Products"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Secondary Booking Button Label</label>
              <input
                type="text"
                value={heroBookCtaText}
                onChange={(e) => setHeroBookCtaText(e.target.value)}
                placeholder="Advance Booking"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Structured Address & Google Maps */}
      {activeTab === 'address' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-extrabold text-gray-900">Structured Shop Address &amp; Google Maps</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter individual address components for clear Indian formatting and directions for visiting farmers.
            </p>
          </div>

          {/* Live Formatted Address Card */}
          <div className="p-4 rounded-2xl bg-agri-50 border border-agri-200 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-agri-900 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-agri-700" />
              <span>Live Formatted Public Address Preview</span>
            </div>
            <p className="text-sm font-semibold text-agri-950">
              {formattedAddressPreview || 'Please fill in address fields below.'}
            </p>
            <span className="text-[11px] text-agri-700 block">
              This formatted address will appear dynamically in the footer, contact page, and booking slips.
            </span>
          </div>

          {/* Structured Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Building / Complex Name</label>
              <input
                type="text"
                placeholder="e.g. Anjaneya Complex"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Door / Plot Number</label>
              <input
                type="text"
                placeholder="e.g. 4-82/1"
                value={doorPlotNumber}
                onChange={(e) => setDoorPlotNumber(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Street / Road / Highway</label>
              <input
                type="text"
                placeholder="e.g. Main Road, NH-65"
                value={streetRoad}
                onChange={(e) => setStreetRoad(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Landmark</label>
              <input
                type="text"
                placeholder="e.g. Near Rythu Bharosa Kendram"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Village / Locality</label>
              <input
                type="text"
                placeholder="e.g. Suryapet Locality"
                value={villageLocality}
                onChange={(e) => setVillageLocality(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Mandal / District</label>
              <input
                type="text"
                placeholder="e.g. Nalgonda District"
                value={mandalDistrict}
                onChange={(e) => setMandalDistrict(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">PIN Code</label>
              <input
                type="text"
                placeholder="508001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>
          </div>

          {/* Google Maps Section */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-agri-700" />
              <span>Google Maps Integration &amp; Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Google Maps Share Link</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Google Maps Directions Link</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/dir//..."
                  value={directionsUrl}
                  onChange={(e) => setDirectionsUrl(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Latitude (Optional)</label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="17.0575"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Longitude (Optional)</label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="79.2684"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
                />
              </div>
            </div>

            {/* Test Button */}
            {(googleMapsUrl || directionsUrl) && (
              <div className="pt-1">
                <a
                  href={directionsUrl || googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-agri-700" />
                  <span>Test Opening Google Maps Link</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Contact, Timings & Announcements */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-extrabold text-gray-900">Communication &amp; Operating Hours</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure phone, WhatsApp support, store opening hours, and banner announcements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">
                Contact Phone Number (For "Call Now" Button)
              </label>
              <input
                type="text"
                placeholder="917095891270"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
              <span className="text-[11px] text-gray-400">Used for direct tel: links (never displayed raw).</span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">
                WhatsApp Support Number (For "WhatsApp Us" Button)
              </label>
              <input
                type="text"
                placeholder="917095891270"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
              <span className="text-[11px] text-gray-400">Used for WhatsApp booking slips and floating chat button.</span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Store Opening Hours</label>
              <input
                type="text"
                placeholder="Mon - Sun: 7:00 AM - 8:30 PM"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-gray-700">Local Pickup Instructions</label>
              <textarea
                rows={3}
                placeholder="Step-by-step instructions for farmers visiting the shop..."
                value={pickupInstructions}
                onChange={(e) => setPickupInstructions(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>
          </div>

          {/* Announcement Bar Settings */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">Header Announcement Bar</h3>
                <p className="text-xs text-gray-500">Show or hide the notice strip at the top of every page.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="w-4 h-4 text-agri-600 rounded"
                />
                <span>Enable Announcement Bar</span>
              </label>
            </div>

            {announcementEnabled && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Announcement Bar Text</label>
                <input
                  type="text"
                  placeholder="e.g. Certified Quality Seeds & Fertilizers Available for In-Store Pickup"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 outline-none"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Website Sections (Show/Hide/Reorder) */}
      {activeTab === 'sections' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Homepage Section Visibility &amp; Ordering</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Toggle sections on/off, change headings, and reorder how they appear on the public website.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveSections}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs shadow transition active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Section Order</span>
            </button>
          </div>

          {isLoadingSections ? (
            <LoadingSpinner message="Loading sections list..." />
          ) : (
            <div className="space-y-3">
              {sections.map((section, index) => {
                const isAdminSection = section.sectionKey === 'admin_login';
                return (
                  <div
                    key={section.sectionKey}
                    className={`p-4 rounded-2xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      section.enabled
                        ? 'bg-white border-gray-200 hover:border-agri-400'
                        : 'bg-gray-50/70 border-gray-200 opacity-60'
                    }`}
                  >
                    {/* Reorder Arrows */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveSection(index, 'up')}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 text-gray-600"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === sections.length - 1}
                        onClick={() => handleMoveSection(index, 'down')}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 text-gray-600"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-xs font-bold text-gray-400 w-6 text-center">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Section Details & Editable Title */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-agri-800 bg-agri-50 px-2 py-0.5 rounded border border-agri-200">
                          {section.sectionKey}
                        </span>
                        {isAdminSection && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            Protected (Cannot be hidden)
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[index].title = e.target.value;
                            setSections(updated);
                          }}
                          placeholder="Section Title"
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:ring-2 focus:ring-agri-600 outline-none"
                        />
                        <input
                          type="text"
                          value={section.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[index].subtitle = e.target.value;
                            setSections(updated);
                          }}
                          placeholder="Section Subtitle / Description"
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 focus:ring-2 focus:ring-agri-600 outline-none"
                        />
                      </div>
                    </div>

                    {/* Enable / Disable Toggle */}
                    <div className="shrink-0">
                      <button
                        type="button"
                        disabled={isAdminSection}
                        onClick={() => handleToggleSection(index)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                          section.enabled
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-gray-200 text-gray-700 border border-gray-300'
                        }`}
                      >
                        {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{section.enabled ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Floating Bottom Save Action Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl flex items-center justify-between gap-4">
        <div className="text-xs text-gray-600">
          Changes will be saved permanently in <strong>MySQL database</strong> and immediately sync across all devices without redeploying code.
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-agri-700 to-agri-800 hover:from-agri-800 hover:to-agri-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing...' : 'Save & Publish Changes'}</span>
        </button>
      </div>
    </div>
  );
};
