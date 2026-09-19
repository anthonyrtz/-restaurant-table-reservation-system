import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableStatus } from './entities/table.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  // GET /tables — anyone can browse the table list (no login required, like a menu page)
  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  // GET /tables/available — filter by status, e.g. GET /tables/available?status=available
  @Get('available')
  findAvailable(@Query('status') status: TableStatus = TableStatus.AVAILABLE) {
    return this.tablesService.findByStatus(status);
  }

  // GET /tables/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.findOne(id);
  }

  // POST /tables — staff/admin only: add a new table
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  // PATCH /tables/:id — staff/admin only: edit capacity/status/location
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTableDto) {
    return this.tablesService.update(id, dto);
  }

  // DELETE /tables/:id — admin only: remove a table
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.remove(id);
  }
}
