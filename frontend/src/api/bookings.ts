import { request } from './client';
import { Booking, BookingCreateRequest, BookingStatusUpdateRequest } from '../types';

export interface BookingPageResponse {
  content: Booking[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const bookingsApi = {
  // Public customer booking
  createBooking: (data: BookingCreateRequest) => {
    return request<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getBookingByReference: (reference: string) => {
    return request<Booking>(`/api/bookings/${reference}`);
  },

  // Admin booking management
  getAdminBookings: (params: { status?: string; search?: string; page?: number; size?: number } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status && params.status !== 'ALL') searchParams.append('status', params.status);
    if (params.search) searchParams.append('search', params.search);
    if (params.page !== undefined) searchParams.append('page', String(params.page));
    if (params.size !== undefined) searchParams.append('size', String(params.size));

    const q = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<BookingPageResponse>(`/api/admin/bookings${q}`);
  },

  getAllAdminBookings: () => {
    return request<Booking[]>('/api/admin/bookings/all');
  },

  updateBookingStatus: (id: number, data: BookingStatusUpdateRequest) => {
    return request<Booking>(`/api/admin/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateAdminNotes: (id: number, adminNotes: string) => {
    return request<Booking>(`/api/admin/bookings/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ adminNotes }),
    });
  },
};
