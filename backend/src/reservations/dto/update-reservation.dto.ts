import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsInt()
  tableId?: number;

  @IsOptional()
  @IsDateString()
  reservationDate?: string;

  @IsOptional()
  @IsString()
  reservationTime?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  partySize?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
