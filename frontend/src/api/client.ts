const getApiBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return '';
    }
    // Automatically connect to deployed Render backend when on Vercel
    if (host.includes('vercel.app')) {
      return 'https://sri-anjaneya-backend-48cj.onrender.com';
    }
  }
  return '';
};

const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getToken(): string | null {
  return localStorage.getItem('sri_anjaneya_token');
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('sri_anjaneya_token', token);
  } else {
    localStorage.removeItem('sri_anjaneya_token');
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // Only set Content-Type to JSON if body is not FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      let errorData = null;
      try {
        errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Response was not JSON
      }

      if (response.status === 405 || (response.status === 404 && !API_BASE_URL)) {
        errorMessage = 'Backend API is not connected to Vercel yet. The Java Spring Boot backend needs to be hosted (e.g. on Railway/Render) and linked via VITE_API_BASE_URL. To test right now, use http://localhost:5173/admin/login on your computer.';
      }

      if (response.status === 401 || response.status === 403) {
        if (endpoint.includes('/api/admin') || endpoint.includes('/api/auth/me')) {
          setToken(null);
        }
      }

      throw new ApiError(errorMessage, response.status, errorData);
    }

    // If 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error?.message || 'Failed to connect to backend server. Please verify backend is running.', 0);
  }
}
