import apiClient from '../api-client';
export const payrollApi = {
  getEmployees: async () => (await apiClient.get('/payroll/employees')).data,
  getDepartments: async () => (await apiClient.get('/payroll/departments')).data,
  getPayrollEntries: async (period?: string) => (await apiClient.get('/payroll/entries', { params: { period } })).data,
  generatePayroll: async (body: any) => (await apiClient.post('/payroll/generate', body)).data,
};
