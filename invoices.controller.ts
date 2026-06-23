import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { InvoicesService } from './invoices.service';

@ApiTags('Invoices') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('invoices')
export class InvoicesController {
  constructor(private s: InvoicesService) {}
  @Get('customers') getCustomers(@GetUser() u: any) { return this.s.getCustomers(u.companyId); }
  @Get('suppliers') getSuppliers(@GetUser() u: any) { return this.s.getSuppliers(u.companyId); }
  @Get('sales') getSales(@GetUser() u: any, @Query('status') s?: string) { return this.s.getSalesInvoices(u.companyId, s); }
  @Get('purchases') getPurchases(@GetUser() u: any, @Query('status') s?: string) { return this.s.getPurchaseInvoices(u.companyId, s); }
  @Get('sales/:id') getSale(@GetUser() u: any, @Param('id') id: string) { return this.s.getSalesInvoice(u.companyId, id); }
  @Post('sales/:id/payment') payment(@GetUser() u: any, @Param('id') id: string, @Body() dto: any) { return this.s.recordSalesPayment(u.companyId, id, dto); }
}
