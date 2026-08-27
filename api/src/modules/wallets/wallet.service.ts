import { Injectable } from '@nestjs/common';
import { GatewayHttpClient } from '../../shared/gateway/gateway-http.client';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import { ListWalletTransactionsDto } from './dto/list-wallet-transactions.dto';

@Injectable()
export class WalletService {
  constructor(
    private readonly gatewayAccounts: GatewayAccountsService,
    private readonly gatewayHttp: GatewayHttpClient,
  ) {}

  async getBalance(userId: string) {
    const token = await this.gatewayAccounts.getDecryptedToken(userId);
    const data = await this.gatewayHttp.getWallet(token);
    return {
      balanceCents: data.balance,
      balanceFormatted: data.balanceFormatted,
      updatedAt: data.updatedAt,
    };
  }

  async listTransactions(userId: string, query: ListWalletTransactionsDto) {
    const token = await this.gatewayAccounts.getDecryptedToken(userId);
    const data = await this.gatewayHttp.listWalletTransactions(token, query);
    return {
      balanceCents: data.balance,
      balanceFormatted: data.balanceFormatted,
      filters: data.filters,
      transactions: data.transactions,
    };
  }
}
