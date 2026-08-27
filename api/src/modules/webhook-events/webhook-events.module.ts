import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewayModule } from '../../shared/gateway/gateway.module';
import { CheckoutLink } from '../checkout-links/entities/checkout-link.entity';
import { GatewayAccountsModule } from '../gateway-accounts/gateway-accounts.module';
import { Order } from '../orders/entities/order.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import { WebhookEventsController } from './webhook-events.controller';
import { WebhookEventsService } from './webhook-events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebhookEvent, Order, CheckoutLink, Transaction]),
    GatewayModule,
    GatewayAccountsModule,
  ],
  controllers: [WebhookEventsController],
  providers: [WebhookEventsService],
  exports: [TypeOrmModule, WebhookEventsService],
})
export class WebhookEventsModule {}
