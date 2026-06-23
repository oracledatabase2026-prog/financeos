import apiClient from '../api-client';

// ─── INVOICES ─────────────────────────────────
export const invoicesApi = {
  getCustomers: async () => (await apiClient.get('/invoices/customers')).data,
  getSuppliers: async () => (await apiClient.get('/invoices/suppliers')).data,
  getSalesInvoices: async (status?: string) => (await apiClient.get('/invoices/sales', { params: { status } })).data,
  getPurchaseInvoices: async (status?: string) => (await apiClient.get('/invoices/purchases', { params: { status } })).data,
  getSalesInvoice: async (id: string) => (await apiClient.get(`/invoices/sales/${id}`)).data,
  recordSalesPayment: async (id: string, body: any) => (await apiClient.post(`/invoices/sales/${id}/payment`, body)).data,
};

// ─── INVENTORY ────────────────────────────────
export const inventoryApi = {
  getProducts: async () => (await apiClient.get('/inventory/products')).data,
  getWarehouses: async () => (await apiClient.get('/inventory/warehouses')).data,
  getStockLevels: async () => (await apiClient.get('/inventory/stock')).data,
  getMovements: async () => (await apiClient.get('/inventory/movements')).data,
  recordMovement: async (body: any) => (await apiClient.post('/inventory/movements', body)).data,
};

// ─── PAYROLL ──────────────────────────────────
export const payrollApi = {
  getEmployees: async () => (await apiClient.get('/payroll/employees')).data,
  getDepartments: async () => (await apiClient.get('/payroll/departments')).data,
  getPayrollEntries: async (period?: string) => (await apiClient.get('/payroll/entries', { params: { period } })).data,
  generatePayroll: async (body: any) => (await apiClient.post('/payroll/generate', body)).data,
};

// ─── REPORTS ──────────────────────────────────
export const reportsApi = {
  getIncomeStatement: async (from: string, to: string) =>
    (await apiClient.get('/reports/income-statement', { params: { from, to } })).data,
  getBalanceSheet: async (date: string) =>
    (await apiClient.get('/reports/balance-sheet', { params: { date } })).data,
  getTrialBalance: async (from: string, to: string) =>
    (await apiClient.get('/reports/trial-balance', { params: { from, to } })).data,
  getCashFlowStatement: async (from: string, to: string) =>
    (await apiClient.get('/reports/cash-flow-statement', { params: { from, to } })).data,
  getAgingReceivables: async () => (await apiClient.get('/reports/aging-receivables')).data,
  getAgingPayables: async () => (await apiClient.get('/reports/aging-payables')).data,
  getVatReport: async (from: string, to: string) =>
    (await apiClient.get('/reports/vat-report', { params: { from, to } })).data,
};

// ─── SETTINGS ─────────────────────────────────
export const settingsApi = {
  getCompany: async () => (await apiClient.get('/settings/company')).data,
  updateCompany: async (body: any) => (await apiClient.put('/settings/company', body)).data,
  getTaxes: async () => (await apiClient.get('/settings/taxes')).data,
};

// ─── USERS ────────────────────────────────────
export const usersApi = {
  getAll: async (search?: string) => (await apiClient.get('/users', { params: { search } })).data,
  getOne: async (id: string) => (await apiClient.get(`/users/${id}`)).data,
  create: async (body: any) => (await apiClient.post('/users', body)).data,
  update: async (id: string, body: any) => (await apiClient.put(`/users/${id}`, body)).data,
  remove: async (id: string) => (await apiClient.delete(`/users/${id}`)).data,
};
