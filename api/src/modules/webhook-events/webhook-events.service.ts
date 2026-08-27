import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { Repository } from 'typeorm';
import { PaymentStatus } from '../../shared/enums/payment-status.enum';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { GatewayHttpClient } from '../../shared/gateway/gateway-http.client';
import { CheckoutLink } from '../checkout-links/entities/checkout-link.entity';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import { Order } from '../orders/entities/order.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { RegisterWebhookDto } from './dto/register-webhook.dto';
import { WebhookEvent } from './entities/webhook-event.entity';
import { WebhookProcessingStatus } from './enums/processing-status.enum';

type LeraPaymentWebhook = {
  event?: string;
  status?: string;
  transactionId?: string;
  externalReference?: string;
  txid?: string;
  amount?: number;
  denialReason?: string | null;
  [key: string]: unknown;
};

@Injectable()
export class WebhookEventsService {
  private readonly logger = new Logger(WebhookEventsService.name);

  constructor(
    @InjectRepository(WebhookEvent)
    private readonly eventsRepo: Repository<WebhookEvent>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(CheckoutLink)
    private readonly linksRepo: Repository<CheckoutLink>,
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    private readonly gatewayAccounts: GatewayAccountsService,
    private readonly gatewayHttp: GatewayHttpClient,
    private readonly config: ConfigService,
  ) {}

  async register(userId: string, dto: RegisterWebhookDto) {
    const token = await this.gatewayAccounts.getDecryptedToken(userId);
    const secret = dto.secret ?? this.config.get<string>('WEBHOOK_HMAC_SECRET');
    return this.gatewayHttp.registerWebhook(token, {
      event: dto.event,
      url: dto.url,
      secret,
    });
  }

  async handleIncoming(
    eventType: TransactionType,
    body: LeraPaymentWebhook,
    signature: string | undefined,
  ) {
    const externalReference = body.externalReference;
    const idempotencyKey =
      body.transactionId ??
      createHash('sha256').update(JSON.stringify(body)).digest('hex');

    this.logger.log(
      `Webhook ${eventType} ref=${externalReference} status=${body.status}`,
    );

    const existing = await this.eventsRepo.findOne({
      where: { idempotencyKey },
    });
    if (existing) {
      return { ok: true, status: WebhookProcessingStatus.SKIPPED };
    }

    if (!externalReference) {
      return { ok: false, error: 'missing externalReference' };
    }

    const order = await this.ordersRepo.findOne({
      where: { externalReference },
    });
    if (!order) {
      this.logger.warn(`Order not found for ${externalReference}`);
      return { ok: false, error: 'order not found' };
    }

    const signatureValid = this.verifySignature(body, signature);

    const event = await this.eventsRepo.save(
      this.eventsRepo.create({
        userId: order.userId,
        eventType,
        idempotencyKey,
        signatureValid,
        payload: body,
        processingStatus: WebhookProcessingStatus.PENDING,
        processedAt: null,
        errorMessage: null,
      }),
    );

    if (!signatureValid) {
      event.processingStatus = WebhookProcessingStatus.SKIPPED;
      event.errorMessage = 'Invalid signature';
      event.processedAt = new Date();
      await this.eventsRepo.save(event);
      return { ok: false, status: WebhookProcessingStatus.SKIPPED };
    }

    try {
      event.processingStatus = WebhookProcessingStatus.PROCESSING;
      await this.eventsRepo.save(event);

      const status = this.mapStatus(body.status);
      order.status = status;
      if (status === PaymentStatus.APPROVED) {
        order.paidAt = new Date();
      }
      await this.ordersRepo.save(order);

      const link = await this.linksRepo.findOne({
        where: { id: order.checkoutLinkId },
      });
      if (link) {
        link.status = status;
        link.gatewayPaymentId =
          body.transactionId ?? body.txid ?? link.gatewayPaymentId;
        await this.linksRepo.save(link);
      }

      const existingTx = await this.txRepo.findOne({
        where: { externalReference },
      });
      if (!existingTx) {
        await this.txRepo.save(
          this.txRepo.create({
            userId: order.userId,
            orderId: order.id,
            checkoutLinkId: order.checkoutLinkId,
            gatewayPaymentId: body.transactionId ?? body.txid ?? null,
            externalReference,
            type: eventType,
            status,
            amountCents: body.amount ?? order.amountCents,
            feePercent: link?.feePercent ?? null,
            gatewayPayload: body,
          }),
        );
      }

      event.processingStatus = WebhookProcessingStatus.PROCESSED;
      event.processedAt = new Date();
      await this.eventsRepo.save(event);

      return { ok: true, status: WebhookProcessingStatus.PROCESSED };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'process failed';
      event.processingStatus = WebhookProcessingStatus.FAILED;
      event.errorMessage = message;
      event.processedAt = new Date();
      await this.eventsRepo.save(event);
      this.logger.error(message);
      return { ok: false, status: WebhookProcessingStatus.FAILED };
    }
  }

  private verifySignature(
    body: LeraPaymentWebhook,
    signature: string | undefined,
  ): boolean {
    const secret = this.config.get<string>('WEBHOOK_HMAC_SECRET');
    if (!secret || !signature) {
      return false;
    }

    const expected = createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    try {
      const a = Buffer.from(expected, 'utf8');
      const b = Buffer.from(signature, 'utf8');
      if (a.length !== b.length) {
        return false;
      }
      return timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  private mapStatus(status?: string): PaymentStatus {
    switch (status) {
      case 'APPROVED':
        return PaymentStatus.APPROVED;
      case 'DENIED':
        return PaymentStatus.DENIED;
      case 'EXPIRED':
        return PaymentStatus.EXPIRED;
      case 'CANCELLED':
        return PaymentStatus.CANCELLED;
      default:
        return PaymentStatus.PENDING;
    }
  }
}
