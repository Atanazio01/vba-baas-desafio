import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveUserId } from '../../shared/decorators/active-user-id.decorator';
import { ListWalletTransactionsDto } from './dto/list-wallet-transactions.dto';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Get()
  getBalance(@ActiveUserId() userId: string) {
    return this.service.getBalance(userId);
  }

  @Get('transactions')
  listTransactions(
    @ActiveUserId() userId: string,
    @Query() query: ListWalletTransactionsDto,
  ) {
    return this.service.listTransactions(userId, query);
  }
}
