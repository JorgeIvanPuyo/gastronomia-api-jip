import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { Dish } from '../dishes/dish.entity';
import { RestaurantsService } from './restaurants.service';
import { RestaurantDishesService } from './restaurant-dishes.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantDishesController } from './restaurant-dishes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Dish])],
  providers: [RestaurantsService, RestaurantDishesService],
  controllers: [RestaurantsController, RestaurantDishesController],
  exports: [RestaurantsService, RestaurantDishesService],
})
export class RestaurantsModule {}
