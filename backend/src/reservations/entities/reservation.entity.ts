import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RestaurantTable } from '../../tables/entities/table.entity';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations, { eager: true })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Column()
  customerId: number;

  @ManyToOne(() => RestaurantTable, (table) => table.reservations, {
    eager: true,
  })
  @JoinColumn({ name: 'tableId' })
  table: RestaurantTable;

  @Column()
  tableId: number;

  @Column({ type: 'date' })
  reservationDate: string; // e.g. "2026-09-25"

  @Column({ type: 'time' })
  reservationTime: string; // e.g. "19:30:00"

  @Column()
  partySize: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
