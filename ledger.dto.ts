import { IsString, IsOptional, IsArray, IsNumber, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAccountDto {
  @IsString() code: string;
  @IsString() name: string;
  @IsString() type: string;
  @IsOptional() @IsString() nameAr?: string;
  @IsOptional() @IsString() parentId?: string;
}

class JournalLineDto {
  @IsString() accountId: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() debit: number;
  @IsNumber() credit: number;
}
export class CreateJournalDto {
  @IsDateString() date: string;
  @IsString() description: string;
  @IsOptional() @IsString() reference?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => JournalLineDto) lines: JournalLineDto[];
}
