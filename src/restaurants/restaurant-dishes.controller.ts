import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { RestaurantDishesService } from './restaurant-dishes.service';
import { Dish } from '../dishes/dish.entity';
import { Restaurant } from './restaurant.entity';

@Controller('restaurants/:restaurantId/dishes')
export class RestaurantDishesController {
  constructor(
    private readonly restaurantDishesService: RestaurantDishesService,
  ) {}

  @Post(':dishId')
  addDishToRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ): Promise<Restaurant> {
    return this.restaurantDishesService.addDishToRestaurant(
      restaurantId,
      dishId,
    );
  }

  @Get()
  findDishesFromRestaurant(
    @Param('restaurantId') restaurantId: string,
  ): Promise<Dish[]> {
    return this.restaurantDishesService.findDishesFromRestaurant(restaurantId);
  }

  @Get(':dishId')
  findDishFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ): Promise<Dish> {
    return this.restaurantDishesService.findDishFromRestaurant(
      restaurantId,
      dishId,
    );
  }

  @Put()
  updateDishesFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Body() dishIds: string[],
  ): Promise<Dish[]> {
    return this.restaurantDishesService.updateDishesFromRestaurant(
      restaurantId,
      dishIds,
    );
  }

  @Delete(':dishId')
  deleteDishFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ): Promise<void> {
    return this.restaurantDishesService.deleteDishFromRestaurant(
      restaurantId,
      dishId,
    );
  }
}
