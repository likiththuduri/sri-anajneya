import { request } from './client';
import { Category } from '../types';

export const categoriesApi = {
  // Public
  getActiveCategories: () => {
    return request<Category[]>('/api/categories');
  },

  getCategoryById: (id: number) => {
    return request<Category>(`/api/categories/${id}`);
  },

  // Admin
  getAllCategories: () => {
    return request<Category[]>('/api/admin/categories');
  },

  createCategory: (data: Partial<Category>) => {
    return request<Category>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCategory: (id: number, data: Partial<Category>) => {
    return request<Category>(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCategory: (id: number) => {
    return request<{ message: string }>(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
