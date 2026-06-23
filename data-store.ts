import { create } from 'zustand';
interface DataState {
  kpis: any | null; revenueChart: any | null; transactions: any[];
  setKPIs: (k: any) => void; setRevenueChart: (d: any) => void; setTransactions: (t: any[]) => void;
}
export const useDataStore = create<DataState>((set) => ({
  kpis: null, revenueChart: null, transactions: [],
  setKPIs: (kpis) => set({ kpis }),
  setRevenueChart: (revenueChart) => set({ revenueChart }),
  setTransactions: (transactions) => set({ transactions }),
}));
