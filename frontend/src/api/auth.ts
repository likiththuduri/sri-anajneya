import { request, setToken } from './client';
import { AdminUser } from '../types';

export const authApi = {
  login: async (username: string, password: string):Promise<AdminUser> => {
    const response = await request<{
      token: string;
      tokenType: string;
      username: string;
      fullName: string;
      role: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    setToken(response.token);
    return {
      username: response.username,
      fullName: response.fullName,
      role: response.role,
      token: response.token,
    };
  },

  getCurrentAdmin: () => {
    return request<AdminUser>('/api/auth/me');
  },

  logout: () => {
    setToken(null);
  },
};
