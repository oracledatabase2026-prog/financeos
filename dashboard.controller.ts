import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('dashboard')
export class DashboardController {
  constructor(private s: DashboardService) {}
  @Get('kpis') getKPIs(@GetUser() u: any) { return this.s.getKPIs(u.companyId); }
  @Get('revenue-chart') getRevenueChart(@GetUser() u: any, @Query('year') year?: string) { return this.s.getRevenueChart(u.companyId, parseInt(year || String(new Date().getFullYear()))); }
  @Get('expense-breakdown') getExpenseBreakdown(@GetUser() u: any) { return this.s.getExpenseBreakdown(u.companyId); }
  @Get('top-customers') getTopCustomers(@GetUser() u: any) { return this.s.getTopCustomers(u.companyId); }
  @Get('recent-transactions') getRecentTransactions(@GetUser() u: any, @Query('limit') limit?: string) { return this.s.getRecentTransactions(u.companyId, parseInt(limit || '10')); }
  @Get('cash-flow') getCashFlow(@GetUser() u: any, @Query('months') months?: string) { return this.s.getCashFlow(u.companyId, parseInt(months || '6')); }
}
