import { request } from './client';
import { WebsiteSection } from '../types';

export const sectionsApi = {
  // Public
  getActiveSections: () => {
    return request<WebsiteSection[]>('/api/sections');
  },

  // Admin
  getAllSections: () => {
    return request<WebsiteSection[]>('/api/admin/sections');
  },

  updateSection: (sectionKey: string, data: Partial<WebsiteSection>) => {
    return request<WebsiteSection>(`/api/admin/sections/${sectionKey}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  reorderSections: (orders: { sectionKey: string; displayOrder: number }[]) => {
    return request<WebsiteSection[]>('/api/admin/sections/reorder', {
      method: 'PUT',
      body: JSON.stringify({ orders }),
    });
  },
};
