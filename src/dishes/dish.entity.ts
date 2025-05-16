import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { DishCategory } from '../common/enums/dish-category.enum';

@Entity('dishes')
export class Dish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 8, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: DishCategory })
  category: DishCategory;

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.dishes)
  restaurants: Restaurant[];
}
