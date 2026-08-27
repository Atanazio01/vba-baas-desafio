import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';

export class RegisterWebhookDto {
  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.PAYMENT_PIX,
  })
  @IsEnum(TransactionType)
  event!: TransactionType;

  @ApiProperty({
    example: 'https://seu-ngrok.ngrok-free.dev/webhooks/lera-box/pix',
  })
  @IsUrl({ require_tld: false })
  url!: string;

  @ApiPropertyOptional({
    example: 'mesmo-valor-do-WEBHOOK_HMAC_SECRET',
    description: 'Opcional — usa .env se omitir',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  secret?: string;
}
