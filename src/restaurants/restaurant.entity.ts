import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Dish } from '../dishes/dish.entity';
import { CuisineType } from '../common/enums/cuisine-type.enum';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('text')
  address: string;

  @Column({ type: 'enum', enum: CuisineType })
  cuisineType: CuisineType;

  @Column({ nullable: true })
  website: string;

  @ManyToMany(() => Dish, (dish) => dish.restaurants, {
    cascade: true,
  })
  @JoinTable({
    name: 'restaurant_dishes',
    joinColumn: { name: 'restaurant_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'dish_id', referencedColumnName: 'id' },
  })
  dishes: Dish[];
}
