import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, search?: string) {
    return this.prisma.user.findMany({
      where: { companyId, ...(search && { OR: [{ email: { contains: search, mode: 'insensitive' } }, { firstName: { contains: search, mode: 'insensitive' } }] }) },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, lastLoginAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  async findOne(companyId: string, id: string) {
    const user = await this.prisma.user.findFirst({ where: { id, companyId }, select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async create(companyId: string, dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already exists');
    const { password, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, 12);
    return this.prisma.user.create({ data: { ...rest, companyId, passwordHash }, select: { id: true, email: true, firstName: true, lastName: true, role: true } });
  }
  async update(companyId: string, id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({ where: { id, companyId } });
    if (!user) throw new NotFoundException('User not found');
    const data: any = { ...dto };
    if (dto.password) { data.passwordHash = await bcrypt.hash(dto.password, 12); delete data.password; }
    return this.prisma.user.update({ where: { id }, data, select: { id: true, email: true, firstName: true, lastName: true, role: true } });
  }
  async remove(companyId: string, id: string) {
    const user = await this.prisma.user.findFirst({ where: { id, companyId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.update({ where: { id }, data: { isActive: false } });
    return { message: 'User deactivated' };
  }
}
