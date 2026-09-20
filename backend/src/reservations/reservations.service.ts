import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import {
  Reservation,
  ReservationStatus,
} from './entities/reservation.entity';
import { TablesService } from '../tables/tables.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    private readonly tablesService: TablesService,
  ) {}

  async create(
    customerId: number,
    dto: CreateReservationDto,
  ): Promise<Reservation> {
    // Confirms the table actually exists before booking against it.
    const table = await this.tablesService.findOne(dto.tableId);

    if (dto.partySize > table.capacity) {
      throw new ConflictException(
        `Table ${table.tableNumber} only seats ${table.capacity}, but the party size is ${dto.partySize}`,
      );
    }

    await this.assertNoConflict(
      dto.tableId,
      dto.reservationDate,
      dto.reservationTime,
    );

    const reservation = this.reservationsRepository.create({
      ...dto,
      customerId,
      status: ReservationStatus.PENDING,
    });
    return this.reservationsRepository.save(reservation);
  }

  findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      order: { reservationDate: 'ASC', reservationTime: 'ASC' },
    });
  }

  findMine(customerId: number): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { customerId },
      order: { reservationDate: 'ASC', reservationTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation #${id} not found`);
    }
    return reservation;
  }

  async update(
    id: number,
    dto: UpdateReservationDto,
    requestingUserId: number,
    requestingUserRole: string,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);
    this.assertOwnerOrStaff(reservation, requestingUserId, requestingUserRole);

    if (dto.tableId || dto.reservationDate || dto.reservationTime) {
      await this.assertNoConflict(
        dto.tableId ?? reservation.tableId,
        dto.reservationDate ?? reservation.reservationDate,
        dto.reservationTime ?? reservation.reservationTime,
        id, // exclude this reservation itself from the conflict check
      );
    }

    Object.assign(reservation, dto);
    return this.reservationsRepository.save(reservation);
  }

  // Separate from update() because changing status is a staff/admin action,
  // distinct from a customer editing their own booking details.
  async updateStatus(id: number, dto: UpdateStatusDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    reservation.status = dto.status;
    return this.reservationsRepository.save(reservation);
  }

  async remove(
    id: number,
    requestingUserId: number,
    requestingUserRole: string,
  ): Promise<void> {
    const reservation = await this.findOne(id);
    this.assertOwnerOrStaff(reservation, requestingUserId, requestingUserRole);
    await this.reservationsRepository.delete(id);
  }

  private assertOwnerOrStaff(
    reservation: Reservation,
    requestingUserId: number,
    requestingUserRole: string,
  ) {
    const isOwner = reservation.customerId === requestingUserId;
    const isStaffOrAdmin =
      requestingUserRole === 'staff' || requestingUserRole === 'admin';
    if (!isOwner && !isStaffOrAdmin) {
      throw new ForbiddenException('This is not your reservation');
    }
  }

  // A table can only hold one active reservation for a given date+time.
  // This is the one piece of real business logic in this module — everything
  // else here is standard CRUD.
  private async assertNoConflict(
    tableId: number,
    date: string,
    time: string,
    excludeReservationId?: number,
  ) {
    const clashes = await this.reservationsRepository.find({
      where: {
        tableId,
        reservationDate: date,
        reservationTime: time,
        status: Not(ReservationStatus.CANCELLED),
        ...(excludeReservationId ? { id: Not(excludeReservationId) } : {}),
      },
    });
    if (clashes.length > 0) {
      throw new ConflictException(
        'This table is already reserved for that date and time',
      );
    }
  }
}
