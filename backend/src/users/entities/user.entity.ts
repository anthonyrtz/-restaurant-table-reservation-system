import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // always stored bcrypt-hashed, never plain text

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => Reservation, (reservation) => reservation.customer)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;
}
