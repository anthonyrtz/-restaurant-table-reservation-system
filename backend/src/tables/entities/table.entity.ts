import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

export enum TableStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  UNAVAILABLE = 'unavailable', // e.g. under maintenance
}

@Entity('restaurant_tables')
export class RestaurantTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tableNumber: string;

  @Column()
  capacity: number;

  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.AVAILABLE })
  status: TableStatus;

  @Column({ nullable: true })
  location: string; // e.g. "Window side", "Patio", "Main hall"

  @OneToMany(() => Reservation, (reservation) => reservation.table)
  reservations: Reservation[];
}
