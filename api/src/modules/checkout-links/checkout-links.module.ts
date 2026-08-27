import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewayModule } from '../../shared/gateway/gateway.module';
import { GatewayAccountsModule } from '../gateway-accounts/gateway-accounts.module';
import { Order } from '../orders/entities/order.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { CheckoutLinksController } from './checkout-links.controller';
import { CheckoutLinksService } from './checkout-links.service';
import { CheckoutLink } from './entities/checkout-link.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckoutLink, Order, Transaction]),
    GatewayAccountsModule,
    GatewayModule,
    TransactionModule,
  ],
  controllers: [CheckoutLinksController],
  providers: [CheckoutLinksService],
  exports: [CheckoutLinksService],
})
export class CheckoutLinksModule {}
