import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewayAccount } from './entities/gateway-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GatewayAccount])],
  exports: [TypeOrmModule],
})
export class GatewayAccountsModule {}
