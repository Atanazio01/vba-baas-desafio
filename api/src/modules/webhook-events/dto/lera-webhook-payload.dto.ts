import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LeraWebhookPayloadDto {
  @ApiPropertyOptional({ example: 'PAYMENT_PIX' })
  event?: string;

  @ApiProperty({
    example: 'APPROVED',
    enum: ['PENDING', 'APPROVED', 'DENIED', 'EXPIRED', 'CANCELLED'],
  })
  status!: string;

  @ApiProperty({
    example: 'PIX-dd830a28-0b3c-447e-b5e3-c8c6bdab14a6',
    description: 'Mesmo externalReference do checkout/saque',
  })
  externalReference!: string;

  @ApiPropertyOptional({
    example: '8e3c71b5-9638-4bc3-a5cd-448686a4c575',
    description: 'ID da transação no Lera',
  })
  transactionId?: string;

  @ApiPropertyOptional({
    example: 'LB1909F53DC1FEAA015C97',
    description: 'TXID Pix (quando aplicável)',
  })
  txid?: string;

  @ApiProperty({ example: 20000, description: 'Valor em centavos' })
  amount!: number;

  @ApiPropertyOptional({ example: 'INSUFFICIENT_BALANCE' })
  denialReason?: string | null;
}
