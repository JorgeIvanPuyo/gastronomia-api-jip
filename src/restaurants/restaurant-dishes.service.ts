import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Dish } from '../dishes/dish.entity';

@Injectable()
export class RestaurantDishesService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
  ) {}

  // 1. addDishToRestaurant
  async addDishToRestaurant(
    restaurantId: string,
    dishId: string,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant ${restaurantId} not found`);
    }
    const dish = await this.dishRepo.findOneBy({ id: dishId });
    if (!dish) {
      throw new NotFoundException(`Dish ${dishId} not found`);
    }
    // evitar duplicados
    if (restaurant.dishes.some((d) => d.id === dishId)) {
      throw new BadRequestException(
        `Dish ${dishId} already added to restaurant ${restaurantId}`,
      );
    }
    restaurant.dishes.push(dish);
    return this.restaurantRepo.save(restaurant);
  }

  // 2. findDishesFromRestaurant
  async findDishesFromRestaurant(restaurantId: string): Promise<Dish[]> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant ${restaurantId} not found`);
    }
    return restaurant.dishes;
  }

  // 3. findDishFromRestaurant
  async findDishFromRestaurant(
    restaurantId: string,
    dishId: string,
  ): Promise<Dish> {
    const dishes = await this.findDishesFromRestaurant(restaurantId);
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) {
      throw new NotFoundException(
        `Dish ${dishId} not associated to restaurant ${restaurantId}`,
      );
    }
    return dish;
  }

  // 4. updateDishesFromRestaurant
  async updateDishesFromRestaurant(
    restaurantId: string,
    dishIds: string[], // lista completa de dish IDs a asociar
  ): Promise<Dish[]> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant ${restaurantId} not found`);
    }
    // buscar todos los Dish
    const dishes = await this.dishRepo.findByIds(dishIds);
    if (dishes.length !== dishIds.length) {
      throw new BadRequestException(`Some dishes not found`);
    }
    restaurant.dishes = dishes;
    await this.restaurantRepo.save(restaurant);
    return restaurant.dishes;
  }

  // 5. deleteDishFromRestaurant
  async deleteDishFromRestaurant(
    restaurantId: string,
    dishId: string,
  ): Promise<void> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant ${restaurantId} not found`);
    }
    const initialCount = restaurant.dishes.length;
    restaurant.dishes = restaurant.dishes.filter((d) => d.id !== dishId);
    if (restaurant.dishes.length === initialCount) {
      throw new NotFoundException(
        `Dish ${dishId} not associated to restaurant ${restaurantId}`,
      );
    }
    await this.restaurantRepo.save(restaurant);
  }
}
