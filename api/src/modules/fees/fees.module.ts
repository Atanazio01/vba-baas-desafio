import { Module } from '@nestjs/common';
import { GatewayModule } from '../../shared/gateway/gateway.module';
import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';

@Module({
  imports: [GatewayModule],
  controllers: [FeesController],
  providers: [FeesService],
})
export class FeesModule {}
