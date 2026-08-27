import { Body, Controller, Headers, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ActiveUserId } from '../../shared/decorators/active-user-id.decorator';
import { IsPublic } from '../../shared/decorators/is-public.decorator';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { LeraWebhookPayloadDto } from './dto/lera-webhook-payload.dto';
import { RegisterWebhookDto } from './dto/register-webhook.dto';
import { WebhookEventsService } from './webhook-events.service';

@ApiTags('Webhook Events')
@Controller('webhooks')
export class WebhookEventsController {
  constructor(private readonly service: WebhookEventsService) {}

  @ApiBearerAuth()
  @Post('register')
  register(@ActiveUserId() userId: string, @Body() dto: RegisterWebhookDto) {
    return this.service.register(userId, dto);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Receiver webhook Pix (Lera chama — sem JWT)' })
  @ApiHeader({
    name: 'x-lera-box-signature',
    required: false,
    description: 'HMAC-SHA256 do body com WEBHOOK_HMAC_SECRET',
  })
  @ApiBody({ type: LeraWebhookPayloadDto })
  @Post('lera-box/pix')
  receivePix(
    @Body() body: Record<string, unknown>,
    @Headers('x-lera-box-signature') signature: string | undefined,
  ) {
    return this.service.handleIncoming(
      TransactionType.PAYMENT_PIX,
      body,
      signature,
    );
  }

  @IsPublic()
  @ApiOperation({ summary: 'Receiver webhook cartão (Lera chama — sem JWT)' })
  @ApiHeader({
    name: 'x-lera-box-signature',
    required: false,
    description: 'HMAC-SHA256 do body com WEBHOOK_HMAC_SECRET',
  })
  @ApiBody({ type: LeraWebhookPayloadDto })
  @Post('lera-box/card')
  receiveCard(
    @Body() body: Record<string, unknown>,
    @Headers('x-lera-box-signature') signature: string | undefined,
  ) {
    return this.service.handleIncoming(
      TransactionType.PAYMENT_CARD,
      body,
      signature,
    );
  }

  @IsPublic()
  @ApiOperation({ summary: 'Receiver webhook saque (Lera chama — sem JWT)' })
  @ApiHeader({
    name: 'x-lera-box-signature',
    required: false,
    description: 'HMAC-SHA256 do body com WEBHOOK_HMAC_SECRET',
  })
  @ApiBody({ type: LeraWebhookPayloadDto })
  @Post('lera-box/withdrawal')
  receiveWithdrawal(
    @Body() body: Record<string, unknown>,
    @Headers('x-lera-box-signature') signature: string | undefined,
  ) {
    return this.service.handleWithdrawalIncoming(body, signature);
  }
}
