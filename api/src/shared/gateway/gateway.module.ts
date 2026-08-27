import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { GatewayHttpClient } from './gateway-http.client';

@Module({
  imports: [HttpModule],
  providers: [GatewayHttpClient, CryptoService],
  exports: [GatewayHttpClient, CryptoService],
})
export class GatewayModule {}
