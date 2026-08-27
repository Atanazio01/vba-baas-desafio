import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePixCheckoutDto {
  @IsInt()
  @Min(1)
  amountCents!: number;

  @IsString()
  @IsNotEmpty()
  payerDocument!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
