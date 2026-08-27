import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { CardBrand } from '../../../shared/enums/card-brand.enum';

export class CreateCardCheckoutDto {
  @IsInt()
  @Min(1)
  amountCents!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  @IsString()
  @IsNotEmpty()
  cardHolder!: string;

  @IsString()
  @Length(2, 2)
  expiryMonth!: string;

  @IsString()
  @Length(4, 4)
  expiryYear!: string;

  @IsString()
  @Length(3, 4)
  cvv!: string;

  @IsInt()
  @Min(1)
  @Max(21)
  installments!: number;

  /** Taxa exata de GET /fees (brand + installments) */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  feePercent!: number;

  @IsEnum(CardBrand)
  brand!: CardBrand;
}
