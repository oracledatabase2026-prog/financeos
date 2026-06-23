import apiClient from '../api-client';
export const reportsApi = {
  getIncomeStatement: async (from: string, to: string) => (await apiClient.get('/reports/income-statement', { params: { from, to } })).data,
  getTrialBalance: async (from: string, to: string) => (await apiClient.get('/reports/trial-balance', { params: { from, to } })).data,
  getAgingReceivables: async () => (await apiClient.get('/reports/aging-receivables')).data,
  getVatReport: async (from: string, to: string) => (await apiClient.get('/reports/vat-report', { params: { from, to } })).data,
};
