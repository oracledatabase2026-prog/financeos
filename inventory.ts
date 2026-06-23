import apiClient from '../api-client';
export const inventoryApi = {
  getProducts: async () => (await apiClient.get('/inventory/products')).data,
  getWarehouses: async () => (await apiClient.get('/inventory/warehouses')).data,
  getStockLevels: async () => (await apiClient.get('/inventory/stock')).data,
  getMovements: async () => (await apiClient.get('/inventory/movements')).data,
  recordMovement: async (body: any) => (await apiClient.post('/inventory/movements', body)).data,
};
