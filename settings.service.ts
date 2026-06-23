import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}
  async getCompany(companyId: string) { return this.prisma.company.findUnique({ where: { id: companyId } }); }
  async updateCompany(companyId: string, dto: any) { return this.prisma.company.update({ where: { id: companyId }, data: dto }); }
  async getTaxes(companyId: string) { return this.prisma.tax.findMany({ where: { companyId, isActive: true }, orderBy: { name: 'asc' } }); }
}
