import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantTable, TableStatus } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(RestaurantTable)
    private readonly tablesRepository: Repository<RestaurantTable>,
  ) {}

  create(dto: CreateTableDto): Promise<RestaurantTable> {
    const table = this.tablesRepository.create(dto);
    return this.tablesRepository.save(table);
  }

  findAll(): Promise<RestaurantTable[]> {
    return this.tablesRepository.find();
  }

  async findOne(id: number): Promise<RestaurantTable> {
    const table = await this.tablesRepository.findOne({ where: { id } });
    if (!table) throw new NotFoundException(`Table #${id} not found`);
    return table;
  }

  // Simple availability filter for the browsing/booking screen.
  // Real overlap-by-time-slot logic lives in ReservationsService, since it
  // needs to check existing reservations, not just the table's own status flag.
  findByStatus(status: TableStatus): Promise<RestaurantTable[]> {
    return this.tablesRepository.find({ where: { status } });
  }

  async update(id: number, dto: UpdateTableDto): Promise<RestaurantTable> {
    const table = await this.findOne(id);
    Object.assign(table, dto);
    return this.tablesRepository.save(table);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tablesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Table #${id} not found`);
    }
  }
}
