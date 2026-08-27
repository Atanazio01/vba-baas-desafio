import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 25000,
    description: 'Valor bruto em centavos',
  })
  @IsInt()
  @Min(1)
  amountCents!: number;

  @ApiPropertyOptional({ example: 'Compra loja online' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '4111111111111111' })
  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  @ApiProperty({ example: 'MARIA SILVA' })
  @IsString()
  @IsNotEmpty()
  cardHolder!: string;

  @ApiProperty({ example: '12' })
  @IsString()
  @Length(2, 2)
  expiryMonth!: string;

  @ApiProperty({ example: '2030' })
  @IsString()
  @Length(4, 4)
  expiryYear!: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @Length(3, 4)
  cvv!: string;

  @ApiProperty({ example: 3, minimum: 1, maximum: 21 })
  @IsInt()
  @Min(1)
  @Max(21)
  installments!: number;

  @ApiProperty({
    example: 3.19,
    description: 'Taxa exata de GET /fees (brand + parcelas)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  feePercent!: number;

  @ApiProperty({ enum: CardBrand, example: CardBrand.VISA })
  @IsEnum(CardBrand)
  brand!: CardBrand;
}
