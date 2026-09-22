import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { TableStatus } from '../entities/table.entity';

export class UpdateTableDto {
  @IsOptional()
  @IsString()
  tableNumber?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  floor?: number;

  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;
}
