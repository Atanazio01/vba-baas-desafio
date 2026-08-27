import { Module } from '@nestjs/common';
import { GatewayModule } from '../../shared/gateway/gateway.module';
import { GatewayAccountsModule } from '../gateway-accounts/gateway-accounts.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [GatewayModule, GatewayAccountsModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
