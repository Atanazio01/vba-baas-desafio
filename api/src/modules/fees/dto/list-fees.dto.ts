import { IsEnum, IsOptional } from 'class-validator';
import { CardBrand } from '../../../shared/enums/card-brand.enum';

export class ListFeesDto {
  @IsOptional()
  @IsEnum(CardBrand)
  brand?: CardBrand;
}
