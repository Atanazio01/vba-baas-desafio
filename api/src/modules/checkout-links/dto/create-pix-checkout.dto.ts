import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePixCheckoutDto {
  @ApiProperty({
    example: 15000,
    description: 'Valor em centavos (15000 = R$ 150,00)',
  })
  @IsInt()
  @Min(1)
  amountCents!: number;

  @ApiProperty({
    example: '13993467094',
    description: 'CPF/CNPJ do pagador',
  })
  @IsString()
  @IsNotEmpty()
  payerDocument!: string;

  @ApiPropertyOptional({ example: 'Pedido #123' })
  @IsOptional()
  @IsString()
  description?: string;
}
