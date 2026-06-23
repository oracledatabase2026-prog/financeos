import apiClient from '../api-client';

export const ledgerApi = {
  getAccounts: async (type?: string) => {
    const { data } = await apiClient.get('/ledger/accounts', { params: { type } });
    return data;
  },
  createAccount: async (body: any) => {
    const { data } = await apiClient.post('/ledger/accounts', body);
    return data;
  },
  getJournals: async (from?: string, to?: string, status?: string) => {
    const { data } = await apiClient.get('/ledger/journals', { params: { from, to, status } });
    return data;
  },
  getJournal: async (id: string) => {
    const { data } = await apiClient.get(`/ledger/journals/${id}`);
    return data;
  },
  createJournal: async (body: any) => {
    const { data } = await apiClient.post('/ledger/journals', body);
    return data;
  },
  postJournal: async (id: string) => {
    const { data } = await apiClient.put(`/ledger/journals/${id}/post`);
    return data;
  },
  deleteJournal: async (id: string) => {
    const { data } = await apiClient.delete(`/ledger/journals/${id}`);
    return data;
  },
};
