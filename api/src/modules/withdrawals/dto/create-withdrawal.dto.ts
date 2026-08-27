import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

const MAX_AMOUNT_CENTS = 2_147_483_647;

export class CreateWithdrawalDto {
  @ApiProperty({
    example: 5000,
    maximum: MAX_AMOUNT_CENTS,
    description: 'Valor em centavos',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_AMOUNT_CENTS)
  amountCents!: number;

  @ApiProperty({ example: 'marcosd.atanazio@gmail.com' })
  @IsString()
  @IsNotEmpty()
  pixKey!: string;

  @ApiProperty({
    example: '13993467094',
    description: 'CPF titular da chave Pix',
  })
  @IsString()
  @Length(11, 14)
  document!: string;

  @ApiPropertyOptional({ example: 'Saque teste 01' })
  @IsOptional()
  @IsString()
  description?: string;
}
