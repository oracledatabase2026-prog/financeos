import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@ApiTags('Users') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get() findAll(@GetUser() u: any, @Query('search') s?: string) { return this.usersService.findAll(u.companyId, s); }
  @Get(':id') findOne(@GetUser() u: any, @Param('id') id: string) { return this.usersService.findOne(u.companyId, id); }
  @Post() create(@GetUser() u: any, @Body() dto: CreateUserDto) { return this.usersService.create(u.companyId, dto); }
  @Put(':id') update(@GetUser() u: any, @Param('id') id: string, @Body() dto: UpdateUserDto) { return this.usersService.update(u.companyId, id, dto); }
  @Delete(':id') remove(@GetUser() u: any, @Param('id') id: string) { return this.usersService.remove(u.companyId, id); }
}
