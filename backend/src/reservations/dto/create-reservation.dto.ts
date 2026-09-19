import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  tableId: number;

  @IsDateString()
  reservationDate: string; // "YYYY-MM-DD"

  @IsString()
  reservationTime: string; // "HH:MM" or "HH:MM:SS"

  @IsInt()
  @Min(1)
  partySize: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
