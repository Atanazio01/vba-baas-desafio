import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';

export class RegisterWebhookDto {
  @IsEnum(TransactionType)
  event!: TransactionType;

  @IsUrl({ require_tld: false }) // false = aceita ngrok / localhost em dev
  url!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  secret?: string;
}
