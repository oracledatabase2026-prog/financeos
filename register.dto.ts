import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(8) password: string;
  @ApiProperty() @IsString() @MaxLength(50) firstName: string;
  @ApiProperty() @IsString() @MaxLength(50) lastName: string;
  @ApiProperty() @IsString() @MaxLength(100) companyName: string;
}
