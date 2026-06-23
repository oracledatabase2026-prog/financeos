import apiClient from '../api-client';

export const dashboardApi = {
  getKPIs: async () => {
    const { data } = await apiClient.get('/dashboard/kpis');
    return data;
  },
  getRevenueChart: async (year?: number) => {
    const { data } = await apiClient.get('/dashboard/revenue-chart', { params: { year } });
    return data;
  },
  getExpenseBreakdown: async (period?: string) => {
    const { data } = await apiClient.get('/dashboard/expense-breakdown', { params: { period } });
    return data;
  },
  getTopCustomers: async () => {
    const { data } = await apiClient.get('/dashboard/top-customers');
    return data;
  },
  getRecentTransactions: async (limit = 10) => {
    const { data } = await apiClient.get('/dashboard/recent-transactions', { params: { limit } });
    return data;
  },
  getCashFlow: async (months = 6) => {
    const { data } = await apiClient.get('/dashboard/cash-flow', { params: { months } });
    return data;
  },
};
