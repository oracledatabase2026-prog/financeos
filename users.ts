import apiClient from '../api-client';
export const usersApi = {
  getAll: async (search?: string) => (await apiClient.get('/users', { params: { search } })).data,
  getOne: async (id: string) => (await apiClient.get(`/users/${id}`)).data,
  create: async (body: any) => (await apiClient.post('/users', body)).data,
  update: async (id: string, body: any) => (await apiClient.put(`/users/${id}`, body)).data,
  remove: async (id: string) => (await apiClient.delete(`/users/${id}`)).data,
};
