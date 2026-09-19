import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TablesModule } from '../tables/tables.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), TablesModule],
  providers: [ReservationsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
