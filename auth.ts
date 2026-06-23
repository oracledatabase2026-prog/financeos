import apiClient from '../api-client';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },
  register: async (userData: { email: string; password: string; firstName: string; lastName: string; companyName: string }) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
  },
  logout: async () => {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },
  getProfile: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
