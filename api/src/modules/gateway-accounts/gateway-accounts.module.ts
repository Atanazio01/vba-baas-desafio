import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewayModule } from '../../shared/gateway/gateway.module';
import { GatewayAccount } from './entities/gateway-account.entity';
import { GatewayAccountsController } from './gateway-accounts.controller';
import { GatewayAccountsService } from './gateway-accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([GatewayAccount]), GatewayModule],
  controllers: [GatewayAccountsController],
  providers: [GatewayAccountsService],
  exports: [GatewayAccountsService],
})
export class GatewayAccountsModule {}
