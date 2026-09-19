import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('reservations')
@UseGuards(JwtAuthGuard) // every reservation route requires login
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // POST /reservations — any logged-in user books for themselves
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(user.id, dto);
  }

  // GET /reservations — staff/admin only: the full booking list
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  findAll() {
    return this.reservationsService.findAll();
  }

  // GET /reservations/mine — any logged-in user: just their own bookings
  @Get('mine')
  findMine(@CurrentUser() user: any) {
    return this.reservationsService.findMine(user.id);
  }

  // GET /reservations/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.findOne(id);
  }

  // PATCH /reservations/:id — owner or staff/admin can edit details
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
    @CurrentUser() user: any,
  ) {
    return this.reservationsService.update(id, dto, user.id, user.role);
  }

  // PATCH /reservations/:id/status — staff/admin only: confirm/complete/cancel
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.reservationsService.updateStatus(id, dto);
  }

  // DELETE /reservations/:id — owner or staff/admin can cancel/remove
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.reservationsService.remove(id, user.id, user.role);
  }
}
