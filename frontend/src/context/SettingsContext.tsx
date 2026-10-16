import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShopSetting } from '../types';
import { settingsApi } from '../api/settings';

export const DEFAULT_SHOP_SETTINGS: ShopSetting = {
  shopName: 'SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS',
  phone: '919000000000',
  whatsapp: '919000000000',
  address: 'Main Road, Telangana, India - 508001',
  buildingName: '',
  doorPlotNumber: '',
  streetRoad: 'Main Road',
  landmark: 'Near Bus Station',
  villageLocality: '',
  mandalDistrict: '',
  state: 'Telangana',
  pincode: '508001',
  country: 'India',
  googleMapsUrl: 'https://maps.google.com',
  directionsUrl: 'https://maps.google.com',
  openingHours: 'Mon - Sun: 7:00 AM - 8:30 PM',
  announcementText: 'Certified Quality Agricultural Seeds, Fertilizers & Pesticides Available for In-Store Pickup',
  announcementEnabled: true,
  pickupInstructions: 'Visit our shop counter with your booking or order reference to collect your genuine farm products.',
  heroTitle: 'Quality Seeds, Fertilizers & Pesticides for Prosperous Farming',
  heroSubtitle: 'Serving hardworking farmers across Telangana with certified crop protection, fertilizers, and high-yield seeds.',
  heroImageUrl: '',
  logoUrl: '',
  heroCtaText: 'Browse Catalog',
  heroBookCtaText: 'Advance Booking',
};

interface SettingsContextType {
  settings: ShopSetting;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ShopSetting>(DEFAULT_SHOP_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await settingsApi.getPublicSettings();
      if (data) {
        setSettings({
          ...DEFAULT_SHOP_SETTINGS,
          ...data,
          shopName: data.shopName || DEFAULT_SHOP_SETTINGS.shopName,
        });
      }
    } catch (err) {
      console.warn('Failed to load dynamic shop settings from backend, using defaults:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
