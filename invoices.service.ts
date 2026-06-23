import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}
  async getCustomers(companyId: string) { return this.prisma.customer.findMany({ where: { companyId, isActive: true }, orderBy: { name: 'asc' } }); }
  async getSuppliers(companyId: string) { return this.prisma.supplier.findMany({ where: { companyId, isActive: true }, orderBy: { name: 'asc' } }); }
  async getSalesInvoices(companyId: string, status?: string) {
    return this.prisma.salesInvoice.findMany({
      where: { companyId, ...(status && { status: status as InvoiceStatus }) },
      include: { customer: { select: { name: true, code: true } } }, orderBy: { date: 'desc' }, take: 100,
    });
  }
  async getPurchaseInvoices(companyId: string, status?: string) {
    return this.prisma.purchaseInvoice.findMany({
      where: { companyId, ...(status && { status: status as InvoiceStatus }) },
      include: { supplier: { select: { name: true, code: true } } }, orderBy: { date: 'desc' }, take: 100,
    });
  }
  async getSalesInvoice(companyId: string, id: string) {
    const inv = await this.prisma.salesInvoice.findFirst({ where: { id, companyId }, include: { customer: true, items: { include: { product: true } }, payments: true } });
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }
  async recordSalesPayment(companyId: string, invoiceId: string, dto: any) {
    const inv = await this.getSalesInvoice(companyId, invoiceId);
    const newPaid = Number(inv.amountPaid) + dto.amount;
    const newStatus = newPaid >= Number(inv.total) ? 'PAID' : 'PARTIAL';
    await this.prisma.$transaction([
      this.prisma.payment.create({ data: { companyId, salesInvoiceId: invoiceId, date: new Date(dto.date), amount: dto.amount, method: dto.method || 'BANK', reference: dto.reference } }),
      this.prisma.salesInvoice.update({ where: { id: invoiceId }, data: { amountPaid: newPaid, status: newStatus as InvoiceStatus } }),
    ]);
    return { message: 'Payment recorded' };
  }
}
