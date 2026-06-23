import apiClient from '../api-client';
export const settingsApi = {
  getCompany: async () => (await apiClient.get('/settings/company')).data,
  updateCompany: async (body: any) => (await apiClient.put('/settings/company', body)).data,
  getTaxes: async () => (await apiClient.get('/settings/taxes')).data,
};
