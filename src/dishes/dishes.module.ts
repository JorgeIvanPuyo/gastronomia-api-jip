import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './dish.entity';
import { DishesService } from './dishes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  providers: [DishesService],
  exports: [DishesService],
})
export class DishesModule {}
