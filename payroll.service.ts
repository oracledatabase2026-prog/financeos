import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}
  async getEmployees(companyId: string) {
    return this.prisma.employee.findMany({ where: { companyId, status: 'ACTIVE' }, include: { department: true }, orderBy: { firstName: 'asc' } });
  }
  async getDepartments(companyId: string) {
    return this.prisma.department.findMany({ where: { companyId, isActive: true }, include: { employees: { where: { status: 'ACTIVE' } } } });
  }
  async getPayrollEntries(companyId: string, period?: string) {
    return this.prisma.payrollEntry.findMany({ where: { companyId, ...(period && { period }) }, include: { employee: { select: { firstName: true, lastName: true, code: true } } }, orderBy: { createdAt: 'desc' }, take: 100 });
  }
  async generatePayroll(companyId: string, dto: any) {
    const { period } = dto;
    const employees = await this.prisma.employee.findMany({ where: { companyId, status: 'ACTIVE' } });
    const entries = employees.map((emp) => ({ companyId, employeeId: emp.id, period, baseSalary: emp.salary, allowances: 0, deductions: 0, advanceDeduct: 0, taxDeduction: Number(emp.salary) * 0.05, netSalary: Number(emp.salary) * 0.95, status: 'PENDING' as const }));
    await this.prisma.payrollEntry.createMany({ data: entries, skipDuplicates: true });
    return { message: `Payroll generated for ${employees.length} employees` };
  }
}
