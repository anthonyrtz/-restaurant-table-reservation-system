import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';

export class UpdateStatusDto {
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
