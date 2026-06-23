// ─── src/lib/utils.ts ─────────────────────────
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ─── src/lib/api-client.ts ────────────────────
import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// ─── src/lib/api/auth.ts ──────────────────────
import apiClient from '../api-client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData) => {
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

  refreshToken: async (refreshToken: string) => {
    const { data } = await apiClient.post('/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    return data;
  },
};

// ─── src/lib/api/dashboard.ts ─────────────────
import apiClient from '../api-client';

export const dashboardApi = {
  getKPIs: async () => {
    const { data } = await apiClient.get('/dashboard/kpis');
    return data;
  },

  getRevenueChart: async (year?: number) => {
    const { data } = await apiClient.get('/dashboard/revenue-chart', {
      params: { year },
    });
    return data;
  },

  getExpenseBreakdown: async (period?: string) => {
    const { data } = await apiClient.get('/dashboard/expense-breakdown', {
      params: { period },
    });
    return data;
  },

  getTopCustomers: async () => {
    const { data } = await apiClient.get('/dashboard/top-customers');
    return data;
  },

  getRecentTransactions: async (limit: number = 10) => {
    const { data } = await apiClient.get('/dashboard/recent-transactions', {
      params: { limit },
    });
    return data;
  },

  getCashFlow: async (months: number = 6) => {
    const { data } = await apiClient.get('/dashboard/cash-flow', {
      params: { months },
    });
    return data;
  },
};

// ─── src/lib/api/reports.ts ───────────────────
import apiClient from '../api-client';

export const reportsApi = {
  getIncomeStatement: async (from: string, to: string) => {
    const { data } = await apiClient.get('/reports/income-statement', {
      params: { from, to },
    });
    return data;
  },

  getBalanceSheet: async (date: string) => {
    const { data } = await apiClient.get('/reports/balance-sheet', {
      params: { date },
    });
    return data;
  },

  getTrialBalance: async (from: string, to: string) => {
    const { data } = await apiClient.get('/reports/trial-balance', {
      params: { from, to },
    });
    return data;
  },

  getCashFlowStatement: async (from: string, to: string) => {
    const { data } = await apiClient.get('/reports/cash-flow-statement', {
      params: { from, to },
    });
    return data;
  },

  getAgingReceivables: async () => {
    const { data } = await apiClient.get('/reports/aging-receivables');
    return data;
  },

  getAgingPayables: async () => {
    const { data } = await apiClient.get('/reports/aging-payables');
    return data;
  },

  getVatReport: async (from: string, to: string) => {
    const { data } = await apiClient.get('/reports/vat-report', {
      params: { from, to },
    });
    return data;
  },
};

// ─── src/lib/api/ledger.ts ────────────────────
import apiClient from '../api-client';

export const ledgerApi = {
  getAccounts: async (type?: string) => {
    const { data } = await apiClient.get('/ledger/accounts', {
      params: { type },
    });
    return data;
  },

  createAccount: async (accountData: any) => {
    const { data } = await apiClient.post('/ledger/accounts', accountData);
    return data;
  },

  getJournals: async (from?: string, to?: string, status?: string) => {
    const { data } = await apiClient.get('/ledger/journals', {
      params: { from, to, status },
    });
    return data;
  },

  getJournal: async (id: string) => {
    const { data } = await apiClient.get(`/ledger/journals/${id}`);
    return data;
  },

  createJournal: async (journalData: any) => {
    const { data } = await apiClient.post('/ledger/journals', journalData);
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

// ─── src/lib/api/invoices.ts ──────────────────
import apiClient from '../api-client';

export const invoicesApi = {
  getCustomers: async () => {
    const { data } = await apiClient.get('/invoices/customers');
    return data;
  },

  getSuppliers: async () => {
    const { data } = await apiClient.get('/invoices/suppliers');
    return data;
  },

  getSalesInvoices: async (status?: string) => {
    const { data } = await apiClient.get('/invoices/sales', {
      params: { status },
    });
    return data;
  },

  getPurchaseInvoices: async (status?: string) => {
    const { data } = await apiClient.get('/invoices/purchases', {
      params: { status },
    });
    return data;
  },

  getSalesInvoice: async (id: string) => {
    const { data } = await apiClient.get(`/invoices/sales/${id}`);
    return data;
  },

  recordSalesPayment: async (id: string, paymentData: any) => {
    const { data } = await apiClient.post(`/invoices/sales/${id}/payment`, paymentData);
    return data;
  },
};

// ─── src/lib/api/inventory.ts ─────────────────
import apiClient from '../api-client';

export const inventoryApi = {
  getProducts: async () => {
    const { data } = await apiClient.get('/inventory/products');
    return data;
  },

  getWarehouses: async () => {
    const { data } = await apiClient.get('/inventory/warehouses');
    return data;
  },

  getStockLevels: async () => {
    const { data } = await apiClient.get('/inventory/stock');
    return data;
  },

  getMovements: async () => {
    const { data } = await apiClient.get('/inventory/movements');
    return data;
  },

  recordMovement: async (movementData: any) => {
    const { data } = await apiClient.post('/inventory/movements', movementData);
    return data;
  },
};

// ─── src/lib/api/payroll.ts ───────────────────
import apiClient from '../api-client';

export const payrollApi = {
  getEmployees: async () => {
    const { data } = await apiClient.get('/payroll/employees');
    return data;
  },

  getDepartments: async () => {
    const { data } = await apiClient.get('/payroll/departments');
    return data;
  },

  getPayrollEntries: async (period?: string) => {
    const { data } = await apiClient.get('/payroll/entries', {
      params: { period },
    });
    return data;
  },

  generatePayroll: async (payrollData: any) => {
    const { data } = await apiClient.post('/payroll/generate', payrollData);
    return data;
  },
};

// ─── src/lib/api/settings.ts ──────────────────
import apiClient from '../api-client';

export const settingsApi = {
  getCompany: async () => {
    const { data } = await apiClient.get('/settings/company');
    return data;
  },

  updateCompany: async (companyData: any) => {
    const { data } = await apiClient.put('/settings/company', companyData);
    return data;
  },

  getTaxes: async () => {
    const { data } = await apiClient.get('/settings/taxes');
    return data;
  },
};

// ─── src/lib/api/users.ts ─────────────────────
import apiClient from '../api-client';

export const usersApi = {
  getAll: async (search?: string) => {
    const { data } = await apiClient.get('/users', {
      params: { search },
    });
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  },

  create: async (userData: any) => {
    const { data } = await apiClient.post('/users', userData);
    return data;
  },

  update: async (id: string, userData: any) => {
    const { data } = await apiClient.put(`/users/${id}`, userData);
    return data;
  },

  remove: async (id: string) => {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
  },
};
