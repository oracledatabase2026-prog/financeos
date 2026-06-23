import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(8) password: string;
  @ApiProperty() @IsString() firstName: string;
  @ApiProperty() @IsString() lastName: string;
  @ApiProperty() @IsEnum(['SUPER_ADMIN','CFO','ACCOUNTANT','HR_MANAGER','VIEWER']) role: string;
  @IsOptional() @IsString() phone?: string;
}
export class UpdateUserDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() @MinLength(8) password?: string;
  @IsOptional() @IsEnum(['SUPER_ADMIN','CFO','ACCOUNTANT','HR_MANAGER','VIEWER']) role?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
