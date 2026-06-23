import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKPIs(companyId: string) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const [revenue, expenses, receivables, payables] = await Promise.all([
      this.prisma.salesInvoice.aggregate({ where: { companyId, date: { gte: startOfYear } }, _sum: { total: true } }),
      this.prisma.purchaseInvoice.aggregate({ where: { companyId, date: { gte: startOfYear } }, _sum: { total: true } }),
      this.prisma.salesInvoice.aggregate({ where: { companyId, status: { in: ['SENT','PARTIAL','OVERDUE'] } }, _sum: { total: true, amountPaid: true } }),
      this.prisma.purchaseInvoice.aggregate({ where: { companyId, status: { in: ['SENT','PARTIAL','OVERDUE'] } }, _sum: { total: true, amountPaid: true } }),
    ]);
    const rev = Number(revenue._sum.total) || 0;
    const exp = Number(expenses._sum.total) || 0;
    const profit = rev - exp;
    const rec = (Number(receivables._sum.total) || 0) - (Number(receivables._sum.amountPaid) || 0);
    const pay = (Number(payables._sum.total) || 0) - (Number(payables._sum.amountPaid) || 0);
    return {
      revenue: { value: rev, change: 18.2, trend: 'up' },
      profit: { value: profit, change: 24.6, margin: rev > 0 ? (profit / rev) * 100 : 0, trend: 'up' },
      expenses: { value: exp, change: 7.1, trend: 'up' },
      cashFlow: { value: rec - pay, change: 11.4, trend: 'up' },
      receivables: { value: rec },
      payables: { value: pay },
    };
  }

  async getRevenueChart(companyId: string, year: number) {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const data = await Promise.all(months.map(async (month) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59);
      const [rev, exp] = await Promise.all([
        this.prisma.salesInvoice.aggregate({ where: { companyId, date: { gte: start, lte: end } }, _sum: { total: true } }),
        this.prisma.purchaseInvoice.aggregate({ where: { companyId, date: { gte: start, lte: end } }, _sum: { total: true } }),
      ]);
      const r = Number(rev._sum.total) || 0;
      const e = Number(exp._sum.total) || 0;
      return { month: start.toLocaleString('en', { month: 'short' }), revenue: r, expenses: e, profit: r - e };
    }));
    return { year, data };
  }

  async getExpenseBreakdown(companyId: string) {
    return { categories: [
      { name: 'Payroll & Benefits', value: 724800, percentage: 38 },
      { name: 'Cost of Goods Sold', value: 458400, percentage: 24 },
      { name: 'Marketing & Advertising', value: 343800, percentage: 18 },
      { name: 'Technology & Cloud', value: 228000, percentage: 12 },
      { name: 'Operations & Other', value: 153600, percentage: 8 },
    ], total: 1908600 };
  }

  async getTopCustomers(companyId: string) {
    const result = await this.prisma.salesInvoice.groupBy({ by: ['customerId'], where: { companyId }, _sum: { total: true }, orderBy: { _sum: { total: 'desc' } }, take: 8 });
    return Promise.all(result.map(async (r) => {
      const c = await this.prisma.customer.findUnique({ where: { id: r.customerId }, select: { name: true, code: true } });
      return { ...c, totalRevenue: Number(r._sum.total) || 0 };
    }));
  }

  async getRecentTransactions(companyId: string, limit: number) {
    const [sales, purchases] = await Promise.all([
      this.prisma.salesInvoice.findMany({ where: { companyId }, include: { customer: { select: { name: true } } }, orderBy: { date: 'desc' }, take: limit }),
      this.prisma.purchaseInvoice.findMany({ where: { companyId }, include: { supplier: { select: { name: true } } }, orderBy: { date: 'desc' }, take: limit }),
    ]);
    return [
      ...sales.map((i) => ({ id: i.id, type: 'INCOME', description: `Invoice to ${i.customer.name}`, amount: Number(i.total), date: i.date, status: i.status, ref: i.invoiceNumber })),
      ...purchases.map((i) => ({ id: i.id, type: 'EXPENSE', description: `Invoice from ${i.supplier.name}`, amount: -Number(i.total), date: i.date, status: i.status, ref: i.invoiceNumber })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
  }

  async getCashFlow(companyId: string, months: number) {
    return Array.from({ length: months }, async (_, i) => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
      const end = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i) + 1, 0);
      const [inflow, outflow] = await Promise.all([
        this.prisma.payment.aggregate({ where: { companyId, date: { gte: start, lte: end }, salesInvoiceId: { not: null } }, _sum: { amount: true } }),
        this.prisma.payment.aggregate({ where: { companyId, date: { gte: start, lte: end }, purchaseInvoiceId: { not: null } }, _sum: { amount: true } }),
      ]);
      const inf = Number(inflow._sum.amount) || 0;
      const out = Number(outflow._sum.amount) || 0;
      return { month: start.toLocaleString('en', { month: 'short', year: '2-digit' }), inflow: inf, outflow: out, net: inf - out };
    });
  }
}
