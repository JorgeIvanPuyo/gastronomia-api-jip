import { IsString, IsNotEmpty, IsEnum, IsUrl } from 'class-validator';
import { CuisineType } from '../../common/enums/cuisine-type.enum';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(CuisineType, {
    message: `cuisineType must be one of: ${Object.values(CuisineType).join(', ')}`,
  })
  cuisineType: CuisineType;

  @IsUrl({}, { message: 'website must be a valid URL' })
  website: string;
}
