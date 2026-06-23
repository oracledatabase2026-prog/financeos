import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ReportsService } from './reports.service';

@ApiTags('Reports') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('reports')
export class ReportsController {
  constructor(private s: ReportsService) {}
  @Get('income-statement') getIS(@GetUser() u: any, @Query('from') from: string, @Query('to') to: string) { return this.s.getIncomeStatement(u.companyId, new Date(from), new Date(to)); }
  @Get('trial-balance') getTB(@GetUser() u: any, @Query('from') from: string, @Query('to') to: string) { return this.s.getTrialBalance(u.companyId, new Date(from), new Date(to)); }
  @Get('aging-receivables') getAging(@GetUser() u: any) { return this.s.getAgingReceivables(u.companyId); }
  @Get('vat-report') getVat(@GetUser() u: any, @Query('from') from: string, @Query('to') to: string) { return this.s.getVatReport(u.companyId, new Date(from), new Date(to)); }
}
