import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateTableDto {
  @IsString()
  tableNumber: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  floor?: number;
}
