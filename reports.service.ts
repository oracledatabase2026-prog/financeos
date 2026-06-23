import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getIncomeStatement(companyId: string, from: Date, to: Date) {
    const lines = await this.prisma.journalLine.findMany({
      where: { journal: { companyId, date: { gte: from, lte: to }, status: 'POSTED' }, account: { type: { in: ['REVENUE','EXPENSE'] } } },
      include: { account: { select: { code: true, name: true, type: true } } },
    });
    const totals: Record<string, any> = {};
    for (const l of lines) {
      const a = l.account;
      if (!totals[a.code]) totals[a.code] = { name: a.name, type: a.type, net: 0 };
      if (a.type === 'REVENUE') totals[a.code].net += Number(l.credit) - Number(l.debit);
      if (a.type === 'EXPENSE') totals[a.code].net += Number(l.debit) - Number(l.credit);
    }
    const revenues = Object.entries(totals).filter(([,v]) => v.type === 'REVENUE').map(([code,v]) => ({ code, ...v }));
    const expenses = Object.entries(totals).filter(([,v]) => v.type === 'EXPENSE').map(([code,v]) => ({ code, ...v }));
    const totalRevenue = revenues.reduce((s, r) => s + r.net, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.net, 0);
    const netProfit = totalRevenue - totalExpenses;
    return { period: { from, to }, revenues, expenses, totalRevenue, totalExpenses, netProfit, profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0 };
  }

  async getTrialBalance(companyId: string, from: Date, to: Date) {
    const lines = await this.prisma.journalLine.findMany({
      where: { journal: { companyId, date: { gte: from, lte: to }, status: 'POSTED' } },
      include: { account: { select: { code: true, name: true, type: true } } },
    });
    const totals: Record<string, any> = {};
    for (const l of lines) {
      const a = l.account;
      if (!totals[a.code]) totals[a.code] = { name: a.name, type: a.type, totalDebit: 0, totalCredit: 0 };
      totals[a.code].totalDebit += Number(l.debit);
      totals[a.code].totalCredit += Number(l.credit);
    }
    const entries = Object.entries(totals).map(([code, v]) => ({ code, ...v, balance: v.totalDebit - v.totalCredit }));
    const totalDebit = entries.reduce((s, e) => s + e.totalDebit, 0);
    const totalCredit = entries.reduce((s, e) => s + e.totalCredit, 0);
    return { period: { from, to }, entries, totalDebit, totalCredit, isBalanced: Math.abs(totalDebit - totalCredit) < 0.01 };
  }

  async getAgingReceivables(companyId: string) {
    const invoices = await this.prisma.salesInvoice.findMany({ where: { companyId, status: { in: ['SENT','PARTIAL','OVERDUE'] } }, include: { customer: { select: { name: true, code: true } } } });
    const now = new Date();
    const buckets = { current: 0, days30: 0, days60: 0, days90: 0, over90: 0 };
    for (const inv of invoices) {
      const outstanding = Number(inv.total) - Number(inv.amountPaid);
      const days = Math.floor((now.getTime() - inv.dueDate.getTime()) / 86400000);
      if (days <= 0) buckets.current += outstanding;
      else if (days <= 30) buckets.days30 += outstanding;
      else if (days <= 60) buckets.days60 += outstanding;
      else if (days <= 90) buckets.days90 += outstanding;
      else buckets.over90 += outstanding;
    }
    return { ...buckets, total: Object.values(buckets).reduce((s, v) => s + v, 0) };
  }

  async getVatReport(companyId: string, from: Date, to: Date) {
    const [sales, purchases] = await Promise.all([
      this.prisma.salesInvoice.aggregate({ where: { companyId, date: { gte: from, lte: to } }, _sum: { taxAmount: true, subtotal: true, total: true } }),
      this.prisma.purchaseInvoice.aggregate({ where: { companyId, date: { gte: from, lte: to } }, _sum: { taxAmount: true, subtotal: true, total: true } }),
    ]);
    const outputVat = Number(sales._sum.taxAmount) || 0;
    const inputVat = Number(purchases._sum.taxAmount) || 0;
    return { period: { from, to }, outputVat, inputVat, netVatDue: outputVat - inputVat, status: outputVat >= inputVat ? 'PAYABLE' : 'REFUNDABLE' };
  }
}
