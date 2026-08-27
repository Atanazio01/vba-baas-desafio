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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_AMOUNT_CENTS)
  amountCents!: number;

  @IsString()
  @IsNotEmpty()
  pixKey!: string;

  /** CPF titular da chave Pix — Lera exige */
  @IsString()
  @Length(11, 14)
  document!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
