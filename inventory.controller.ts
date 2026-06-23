import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('inventory')
export class InventoryController {
  constructor(private s: InventoryService) {}
  @Get('products') getProducts(@GetUser() u: any) { return this.s.getProducts(u.companyId); }
  @Get('warehouses') getWarehouses(@GetUser() u: any) { return this.s.getWarehouses(u.companyId); }
  @Get('stock') getStock(@GetUser() u: any) { return this.s.getStockLevels(u.companyId); }
  @Get('movements') getMovements(@GetUser() u: any) { return this.s.getMovements(u.companyId); }
  @Post('movements') recordMovement(@GetUser() u: any, @Body() dto: any) { return this.s.recordMovement(u.companyId, dto); }
}
