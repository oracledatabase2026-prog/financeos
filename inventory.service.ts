import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}
  async getProducts(companyId: string) {
    return this.prisma.product.findMany({ where: { companyId, isActive: true }, include: { category: true, stockItems: { include: { warehouse: true } } }, orderBy: { name: 'asc' } });
  }
  async getWarehouses(companyId: string) { return this.prisma.warehouse.findMany({ where: { companyId, isActive: true } }); }
  async getStockLevels(companyId: string) {
    const products = await this.prisma.product.findMany({ where: { companyId, isActive: true }, include: { stockItems: { include: { warehouse: { select: { name: true } } } }, category: { select: { name: true } } } });
    return products.map((p) => ({ id: p.id, sku: p.sku, name: p.name, category: p.category?.name, reorderPoint: p.reorderPoint, totalQuantity: p.stockItems.reduce((s, si) => s + Number(si.quantity), 0), stockByWarehouse: p.stockItems.map((si) => ({ warehouse: si.warehouse.name, quantity: Number(si.quantity), value: Number(si.quantity) * Number(si.avgCost) })) }));
  }
  async getMovements(companyId: string) {
    return this.prisma.stockMovement.findMany({ where: { companyId }, include: { product: { select: { name: true, sku: true } }, warehouse: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 100 });
  }
  async recordMovement(companyId: string, dto: any) {
    const { productId, warehouseId, type, quantity, unitCost, reference, notes } = dto;
    await this.prisma.$transaction(async (tx) => {
      await tx.stockMovement.create({ data: { companyId, productId, warehouseId, type, quantity, unitCost: unitCost || 0, reference, notes } });
      const si = await tx.stockItem.findUnique({ where: { productId_warehouseId: { productId, warehouseId } } });
      if (type === 'IN') {
        const newQty = Number(si?.quantity || 0) + quantity;
        const newCost = si ? (Number(si.quantity) * Number(si.avgCost) + quantity * (unitCost||0)) / newQty : (unitCost||0);
        await tx.stockItem.upsert({ where: { productId_warehouseId: { productId, warehouseId } }, update: { quantity: newQty, avgCost: newCost }, create: { productId, warehouseId, quantity: newQty, avgCost: unitCost||0 } });
      } else if (type === 'OUT') {
        const newQty = Number(si?.quantity || 0) - quantity;
        if (newQty < 0) throw new Error('Insufficient stock');
        await tx.stockItem.update({ where: { productId_warehouseId: { productId, warehouseId } }, data: { quantity: newQty } });
      }
    });
    return { message: 'Movement recorded' };
  }
}
