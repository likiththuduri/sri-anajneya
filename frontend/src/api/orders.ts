import { request } from './client';
import { Order } from '../types';

export interface CreateOrderPayload {
  customerName: string;
  customerMobile: string;
  customerVillage?: string;
  customerNotes?: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export const ordersApi = {
  // Public Cart Order Placement
  createOrder: (payload: CreateOrderPayload) => {
    return request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getOrderByNumber: (orderNumber: string) => {
    return request<Order>(`/api/orders/${encodeURIComponent(orderNumber)}`);
  },

  // Admin Order Management
  getAdminOrders: () => {
    return request<Order[]>('/api/admin/orders');
  },

  getAdminOrderById: (id: number) => {
    return request<Order>(`/api/admin/orders/${id}`);
  },

  updateOrderStatus: (id: number, status: string) => {
    return request<Order>(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
