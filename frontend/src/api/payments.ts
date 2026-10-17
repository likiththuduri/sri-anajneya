import { request } from './client';

export interface PaymentConfig {
  onlinePaymentEnabled: boolean;
  razorpayKeyId: string;
  currency: string;
  shopName: string;
}

export interface PaymentInitiateRequest {
  orderNumber?: string;
  bookingReference?: string;
  amount: number;
  customerName?: string;
  customerMobile?: string;
}

export interface PaymentInitiateResponse {
  paymentReference: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
  customerName?: string;
  customerMobile?: string;
}

export interface PaymentVerifyRequest {
  paymentReference: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  message: string;
  paymentStatus: string;
  orderNumber?: string;
  bookingReference?: string;
}

export const paymentsApi = {
  getConfig: (): Promise<PaymentConfig> => {
    return request<PaymentConfig>('/api/payments/config');
  },

  initiatePayment: (data: PaymentInitiateRequest): Promise<PaymentInitiateResponse> => {
    return request<PaymentInitiateResponse>('/api/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  verifyPayment: (data: PaymentVerifyRequest): Promise<PaymentVerifyResponse> => {
    return request<PaymentVerifyResponse>('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
