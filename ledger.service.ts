import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountType, JournalStatus } from '@prisma/client';

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  async getAccounts(companyId: string, type?: string) {
    return this.prisma.account.findMany({
      where: { companyId, ...(type && { type: type as AccountType }) },
      orderBy: { code: 'asc' },
    });
  }
  async createAccount(companyId: string, dto: any) {
    return this.prisma.account.create({ data: { ...dto, companyId } });
  }
  async getJournals(companyId: string, from?: string, to?: string, status?: string) {
    return this.prisma.journalEntry.findMany({
      where: { companyId, ...(from && to && { date: { gte: new Date(from), lte: new Date(to) } }), ...(status && { status: status as JournalStatus }) },
      include: { lines: { include: { account: { select: { code: true, name: true } } }, orderBy: { lineOrder: 'asc' } }, createdBy: { select: { firstName: true, lastName: true } } },
      orderBy: { date: 'desc' }, take: 100,
    });
  }
  async getJournal(companyId: string, id: string) {
    const j = await this.prisma.journalEntry.findFirst({ where: { id, companyId }, include: { lines: { include: { account: true }, orderBy: { lineOrder: 'asc' } }, createdBy: { select: { firstName: true, lastName: true } } } });
    if (!j) throw new NotFoundException('Not found');
    return j;
  }
  async createJournal(companyId: string, userId: string, dto: any) {
    const totalDebit = dto.lines.reduce((s: number, l: any) => s + l.debit, 0);
    const totalCredit = dto.lines.reduce((s: number, l: any) => s + l.credit, 0);
    if (Math.abs(totalDebit - totalCredit) > 0.01) throw new BadRequestException('Debits must equal credits');
    const last = await this.prisma.journalEntry.findFirst({ where: { companyId }, orderBy: { refNumber: 'desc' }, select: { refNumber: true } });
    const num = last ? parseInt(last.refNumber.split('-').pop() || '0') : 0;
    const refNumber = `JE-${new Date().getFullYear()}-${String(num + 1).padStart(3, '0')}`;
    return this.prisma.journalEntry.create({
      data: { companyId, refNumber, date: new Date(dto.date), description: dto.description, reference: dto.reference, status: 'DRAFT', totalDebit, totalCredit, createdById: userId,
        lines: { create: dto.lines.map((l: any, i: number) => ({ accountId: l.accountId, description: l.description, debit: l.debit, credit: l.credit, lineOrder: i })) } },
      include: { lines: { include: { account: true } } },
    });
  }
  async postJournal(companyId: string, id: string, userId: string) {
    const j = await this.prisma.journalEntry.findFirst({ where: { id, companyId } });
    if (!j) throw new NotFoundException('Not found');
    if (j.status === 'POSTED') throw new BadRequestException('Already posted');
    return this.prisma.journalEntry.update({ where: { id }, data: { status: 'POSTED', approvedById: userId, approvedAt: new Date(), postedAt: new Date() } });
  }
  async deleteJournal(companyId: string, id: string) {
    const j = await this.prisma.journalEntry.findFirst({ where: { id, companyId } });
    if (!j) throw new NotFoundException('Not found');
    if (j.status === 'POSTED') throw new BadRequestException('Cannot delete posted entries');
    await this.prisma.journalEntry.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
