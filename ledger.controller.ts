import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { LedgerService } from './ledger.service';

@ApiTags('General Ledger') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('ledger')
export class LedgerController {
  constructor(private s: LedgerService) {}
  @Get('accounts') getAccounts(@GetUser() u: any, @Query('type') t?: string) { return this.s.getAccounts(u.companyId, t); }
  @Post('accounts') createAccount(@GetUser() u: any, @Body() dto: any) { return this.s.createAccount(u.companyId, dto); }
  @Get('journals') getJournals(@GetUser() u: any, @Query('from') f?: string, @Query('to') t?: string, @Query('status') s?: string) { return this.s.getJournals(u.companyId, f, t, s); }
  @Get('journals/:id') getJournal(@GetUser() u: any, @Param('id') id: string) { return this.s.getJournal(u.companyId, id); }
  @Post('journals') createJournal(@GetUser() u: any, @Body() dto: any) { return this.s.createJournal(u.companyId, u.id, dto); }
  @Put('journals/:id/post') postJournal(@GetUser() u: any, @Param('id') id: string) { return this.s.postJournal(u.companyId, id, u.id); }
  @Delete('journals/:id') deleteJournal(@GetUser() u: any, @Param('id') id: string) { return this.s.deleteJournal(u.companyId, id); }
}
