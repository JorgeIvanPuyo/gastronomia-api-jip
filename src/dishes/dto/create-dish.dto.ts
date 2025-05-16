import { IsString, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import { DishCategory } from '../../common/enums/dish-category.enum';

export class CreateDishDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'price must be a positive number' })
  price: number;

  @IsEnum(DishCategory, {
    message: `category must be one of: ${Object.values(DishCategory).join(
      ', ',
    )}`,
  })
  category: DishCategory;
}
