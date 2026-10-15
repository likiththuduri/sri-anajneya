import { request } from './client';
import { Product } from '../types';

export interface ProductFilters {
  query?: string;
  category?: string;
  categoryId?: number;
  sort?: string;
}

export const productsApi = {
  // Public APIs
  getPublicProducts: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.categoryId) params.append('categoryId', String(filters.categoryId));
    if (filters.sort) params.append('sort', filters.sort);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return request<Product[]>(`/api/products${queryStr}`);
  },

  getFeaturedProducts: () => {
    return request<Product[]>('/api/products/featured');
  },

  getProductById: (id: number) => {
    return request<Product>(`/api/products/${id}`);
  },

  // Admin APIs
  getAdminProducts: () => {
    return request<Product[]>('/api/admin/products');
  },

  createProduct: (productData: Partial<Product>) => {
    return request<Product>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: (id: number, productData: Partial<Product>) => {
    return request<Product>(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: (id: number) => {
    return request<{ message: string }>(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Upload image file to Cloudinary via Spring Boot backend
   * Returns: { url: "https://res.cloudinary.com/...", publicId: "...", success: true }
   */
  uploadProductImage: async (file: File): Promise<{ url: string; publicId: string; success: boolean }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'sri_anjaneya_products');

    return request<{ url: string; publicId: string; success: boolean }>('/api/admin/products/upload-image', {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Instantly replace a product image URL in the MySQL database
   */
  updateProductImage: (id: number, imageUrl: string) => {
    return request<Product>(`/api/admin/products/${id}/image`, {
      method: 'PATCH',
      body: JSON.stringify({ imageUrl }),
    });
  },

  /**
   * Update product inventory stock
   */
  updateStock: (id: number, stock: number) => {
    return request<Product>(`/api/admin/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  },

  /**
   * Toggle product active status (visible vs hidden from customers)
   */
  toggleStatus: (id: number) => {
    return request<Product>(`/api/admin/products/${id}/status`, {
      method: 'PATCH',
    });
  },
};
