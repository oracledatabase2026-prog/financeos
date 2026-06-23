import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { PayrollService } from './payroll.service';

@ApiTags('Payroll') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('payroll')
export class PayrollController {
  constructor(private s: PayrollService) {}
  @Get('employees') getEmployees(@GetUser() u: any) { return this.s.getEmployees(u.companyId); }
  @Get('departments') getDepartments(@GetUser() u: any) { return this.s.getDepartments(u.companyId); }
  @Get('entries') getEntries(@GetUser() u: any, @Query('period') p?: string) { return this.s.getPayrollEntries(u.companyId, p); }
  @Post('generate') generate(@GetUser() u: any, @Body() dto: any) { return this.s.generatePayroll(u.companyId, dto); }
}
