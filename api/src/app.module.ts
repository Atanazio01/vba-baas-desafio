import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { CheckoutLinksModule } from './modules/checkout-links/checkout-links.module';
import { GatewayAccountsModule } from './modules/gateway-accounts/gateway-accounts.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallets/wallet.module';
import { WebhookEventsModule } from './modules/webhook-events/webhook-events.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';

@Module({
  imports: [
    UsersModule,
    GatewayAccountsModule,
    CheckoutLinksModule,
    OrdersModule,
    TransactionModule,
    WithdrawalsModule,
    WebhookEventsModule,
    AuthModule,
    WalletModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // só em dev — cria/atualiza tabelas a partir das entities
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD, // protege todas as rotas
      useClass: AuthGuard, // usa o guard de autenticação
    },
  ],
})
export class AppModule {}
