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

  uploadShopAsset: async (file: File, folder: string = 'sri_anjaneya_shop'): Promise<{ url: string; publicId: string; success: boolean }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return request<{ url: string; publicId: string; success: boolean }>('/api/admin/shop/upload-image', {
      method: 'POST',
      body: formData,
    });
  },

  getDashboardSummary: () => {
    return request<DashboardSummary>('/api/admin/dashboard');
  },
};
