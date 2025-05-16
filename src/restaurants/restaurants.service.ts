import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CuisineType } from '../common/enums/cuisine-type.enum';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
  ) {}

  private validateCuisine(type: string) {
    const valid = Object.values(CuisineType).includes(type as CuisineType);
    if (!valid) {
      throw new BadRequestException(
        `Invalid cuisine type '${type}'. Valid types: ${Object.values(CuisineType).join(', ')}`,
      );
    }
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepo.find({ relations: ['dishes'] });
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  async create(dto: CreateRestaurantDto): Promise<Restaurant> {
    this.validateCuisine(dto.cuisineType);
    const restaurant = this.restaurantRepo.create(dto);
    return this.restaurantRepo.save(restaurant);
  }

  async update(id: string, dto: UpdateRestaurantDto): Promise<Restaurant> {
    if (dto.cuisineType) {
      this.validateCuisine(dto.cuisineType);
    }
    await this.restaurantRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.restaurantRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
  }
}
