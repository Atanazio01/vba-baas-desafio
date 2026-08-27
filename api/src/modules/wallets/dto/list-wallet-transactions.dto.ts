import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';
import { WalletTransactionType } from '../enums/wallet-transaction-type.enum';

export class ListWalletTransactionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum(WalletTransactionType)
  type?: WalletTransactionType;
}
