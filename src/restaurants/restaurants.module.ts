import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantsService } from './restaurants.service';
import { RestaurantDishesService } from './restaurant-dishes.service';
import { Dish } from '../dishes/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Dish])],
  providers: [RestaurantsService, RestaurantDishesService],
  exports: [RestaurantsService, RestaurantDishesService],
})
export class RestaurantsModule {}
