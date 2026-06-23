import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { SettingsService } from './settings.service';

@ApiTags('Settings') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('settings')
export class SettingsController {
  constructor(private s: SettingsService) {}
  @Get('company') getCompany(@GetUser() u: any) { return this.s.getCompany(u.companyId); }
  @Put('company') updateCompany(@GetUser() u: any, @Body() dto: any) { return this.s.updateCompany(u.companyId, dto); }
  @Get('taxes') getTaxes(@GetUser() u: any) { return this.s.getTaxes(u.companyId); }
}
