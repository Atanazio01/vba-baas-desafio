import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActiveUserId } from '../../shared/decorators/active-user-id.decorator';
import { ConnectGatewayDto } from './dto/connect-gateway.dto';
import { RegisterGatewayUserDto } from './dto/register-gateway-user.dto';
import { GatewayAccountsService } from './gateway-accounts.service';

@ApiTags('Gateway Accounts')
@ApiBearerAuth()
@Controller('gateway-accounts')
export class GatewayAccountsController {
  constructor(private readonly service: GatewayAccountsService) {}

  @Post('register')
  register(@Body() dto: RegisterGatewayUserDto) {
    return this.service.register(dto);
  }

  @Post('connect')
  connect(@ActiveUserId() userId: string, @Body() dto: ConnectGatewayDto) {
    return this.service.connect(userId, dto);
  }

  @Post('reconnect')
  @ApiOperation({
    summary: 'Renova token Lera de conta já vinculada',
    description:
      'Refaz login no gateway com documento/senha e atualiza o access token criptografado.',
  })
  reconnect(@ActiveUserId() userId: string, @Body() dto: ConnectGatewayDto) {
    return this.service.reconnect(userId, dto);
  }

  @Get('status')
  status(@ActiveUserId() userId: string) {
    return this.service.getStatus(userId);
  }
}
