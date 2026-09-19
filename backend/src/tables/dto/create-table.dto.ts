import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTableDto {
  @IsString()
  tableNumber: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsString()
  location?: string;
}
