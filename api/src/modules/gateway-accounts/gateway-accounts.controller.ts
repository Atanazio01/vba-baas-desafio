import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  @Get('status')
  status(@ActiveUserId() userId: string) {
    return this.service.getStatus(userId);
  }
}
