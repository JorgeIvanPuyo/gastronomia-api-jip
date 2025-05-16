import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from './dish.entity';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { DishCategory } from '../common/enums/dish-category.enum';

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
  ) {}

  private validateCategory(category: string) {
    const valid = Object.values(DishCategory).includes(
      category as DishCategory,
    );
    if (!valid) {
      throw new BadRequestException(
        `Invalid category '${category}'. Valid categories: ${Object.values(
          DishCategory,
        ).join(', ')}`,
      );
    }
  }

  async findAll(): Promise<Dish[]> {
    return this.dishRepo.find({ relations: ['restaurants'] });
  }

  async findOne(id: string): Promise<Dish> {
    const dish = await this.dishRepo.findOne({
      where: { id },
      relations: ['restaurants'],
    });
    if (!dish) {
      throw new NotFoundException(`Dish with id ${id} not found`);
    }
    return dish;
  }

  async create(dto: CreateDishDto): Promise<Dish> {
    this.validateCategory(dto.category);
    const dish = this.dishRepo.create(dto);
    return this.dishRepo.save(dish);
  }

  async update(id: string, dto: UpdateDishDto): Promise<Dish> {
    if (dto.category) {
      this.validateCategory(dto.category);
    }
    if (dto.price != null && dto.price < 0) {
      throw new BadRequestException('price must be a positive number');
    }
    await this.dishRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.dishRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Dish with id ${id} not found`);
    }
  }
}
