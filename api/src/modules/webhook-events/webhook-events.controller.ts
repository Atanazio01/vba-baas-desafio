import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ActiveUserId } from '../../shared/decorators/active-user-id.decorator';
import { IsPublic } from '../../shared/decorators/is-public.decorator';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { RegisterWebhookDto } from './dto/register-webhook.dto';
import { WebhookEventsService } from './webhook-events.service';

@Controller('webhooks')
export class WebhookEventsController {
  constructor(private readonly service: WebhookEventsService) {}

  @Post('register')
  register(@ActiveUserId() userId: string, @Body() dto: RegisterWebhookDto) {
    return this.service.register(userId, dto);
  }

  /** Lera chama isto — sem JWT */
  @IsPublic()
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
  @Post('lera-box/withdrawal')
  receiveWithdrawal(
    @Body() body: Record<string, unknown>,
    @Headers('x-lera-box-signature') signature: string | undefined,
  ) {
    return this.service.handleWithdrawalIncoming(body, signature);
  }
}
