import { Injectable } from '@nestjs/common';
import { GatewayHttpClient } from '../../shared/gateway/gateway-http.client';
import { ListFeesDto } from './dto/list-fees.dto';

@Injectable()
export class FeesService {
  constructor(private readonly gatewayHttp: GatewayHttpClient) {}

  async getFees(query: ListFeesDto) {
    return this.gatewayHttp.getFees(query);
  }
}
