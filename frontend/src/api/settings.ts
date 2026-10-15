import { request } from './client';
import { ShopSetting, DashboardSummary } from '../types';

export const settingsApi = {
  getPublicSettings: () => {
    return request<ShopSetting>('/api/shop/settings');
  },

  updateAdminSettings: (data: Partial<ShopSetting>) => {
    return request<ShopSetting>('/api/admin/shop/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getDashboardSummary: () => {
    return request<DashboardSummary>('/api/admin/dashboard');
  },
};
