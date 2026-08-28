import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { EmailService } from '../../shared/email/email.service';
import { PaymentStatus } from '../../shared/enums/payment-status.enum';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { GatewayHttpClient } from '../../shared/gateway/gateway-http.client';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import { Order } from '../orders/entities/order.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { UsersService } from '../users/users.service';
import { CreateCardCheckoutDto } from './dto/create-card-checkout.dto';
import { CreatePixCheckoutDto } from './dto/create-pix-checkout.dto';
import { SendCheckoutEmailDto } from './dto/send-checkout-email.dto';
import { CheckoutLink } from './entities/checkout-link.entity';
import { PaymentMethod } from './enums/payment-method.enum';

@Injectable()
export class CheckoutLinksService {
  constructor(
    @InjectRepository(CheckoutLink)
    private readonly linksRepo: Repository<CheckoutLink>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    private readonly gatewayAccounts: GatewayAccountsService,
    private readonly gatewayHttp: GatewayHttpClient,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  private resolvePixCreateStatus(
    pix: {
      status?: string;
      emv?: string;
      copyPaste?: string;
      qrCodeBase64?: string;
      qr_code_base64?: string;
    },
    emv: string | null,
    qr: string | null,
  ): PaymentStatus {
    const mapped = this.mapGatewayStatus(pix.status);

    // Se o status do pix for aprovado, retorna o status aprovado
    if (mapped === PaymentStatus.APPROVED) return mapped;

    // Se o pix tiver emv ou qr, retorna o status pendente
    if (emv || qr) return PaymentStatus.PENDING;

    return mapped;
  }

  private normalizeQrBase64(value: string | undefined): string | null {
    if (!value) return null;

    const trimmed = value.trim();
    const match = /^data:image\/[a-z+]+;base64,(.+)$/i.exec(trimmed);

    return match ? match[1] : trimmed;
  }

  private async mirrorTransaction(params: {
    userId: string;
    orderId: string;
    checkoutLinkId: string;
    externalReference: string;
    gatewayPaymentId: string | null;
    type: TransactionType;
    status: PaymentStatus;
    amountCents: number;
    feePercent: string | null;
    gatewayPayload: Record<string, unknown>;
  }) {
    const exists = await this.txRepo.findOne({
      where: { externalReference: params.externalReference },
    });
    if (exists) return;

    await this.txRepo.save(this.txRepo.create(params));
  }

  async createPix(userId: string, dto: CreatePixCheckoutDto) {
    const token = await this.gatewayAccounts.getDecryptedToken(userId);

    const publicId = randomUUID().replace(/-/g, '').slice(0, 12);
    const externalReference = `PIX-${randomUUID()}`;

    const link = await this.linksRepo.save(
      this.linksRepo.create({
        userId,
        publicId,
        externalReference,
        amountCents: dto.amountCents,
        method: PaymentMethod.PIX,
        status: PaymentStatus.PENDING,
        feePercent: null,
        brand: null,
        installments: null,
        expiresAt: null,
        gatewayPaymentId: null,
        pixEmv: null,
        pixQrBase64: null,
      }),
    );

    const order = await this.ordersRepo.save(
      this.ordersRepo.create({
        userId,
        checkoutLinkId: link.id,
        externalReference,
        amountCents: dto.amountCents,
        status: PaymentStatus.PENDING,
        paidAt: null,
      }),
    );

    const pix = await this.gatewayHttp.createPixPayment(token, {
      amount: dto.amountCents,
      payerDocument: dto.payerDocument,
      description: dto.description,
      externalReference,
    });

    const emv = pix.emv ?? pix.copyPaste;
    const qr = this.normalizeQrBase64(pix.qrCodeBase64 ?? pix.qr_code_base64);
    const gatewayPaymentId = pix.id ?? pix.txid ?? null;
    const gatewayStatus = this.resolvePixCreateStatus(pix, emv ?? null, qr);

    link.pixEmv = emv ?? null;
    link.pixQrBase64 = qr ?? null;
    link.gatewayPaymentId = gatewayPaymentId;
    link.status = gatewayStatus;

    order.status = gatewayStatus;
    if (gatewayStatus === PaymentStatus.APPROVED) {
      order.paidAt = new Date();
    }

    await this.linksRepo.save(link);
    await this.ordersRepo.save(order);

    if (gatewayStatus === PaymentStatus.APPROVED) {
      await this.mirrorTransaction({
        userId,
        orderId: order.id,
        checkoutLinkId: link.id,
        externalReference,
        gatewayPaymentId: link.gatewayPaymentId,
        type: TransactionType.PAYMENT_PIX,
        status: gatewayStatus,
        amountCents: link.amountCents,
        feePercent: link.feePercent,
        gatewayPayload: pix,
      });
    }

    return {
      id: link.id,
      publicId: link.publicId,
      externalReference: link.externalReference,
      amountCents: link.amountCents,
      status: link.status,
      method: link.method,
      orderId: order.id,
      pixEmv: link.pixEmv,
      pixQrBase64: link.pixQrBase64,
      gatewayPaymentId: link.gatewayPaymentId,
      paidAt: order.paidAt,
    };
  }

  async createCard(userId: string, dto: CreateCardCheckoutDto) {
    const token = await this.gatewayAccounts.getDecryptedToken(userId);

    const publicId = randomUUID().replace(/-/g, '').slice(0, 12);
    const externalReference = `CARD-${randomUUID()}`;

    const link = await this.linksRepo.save(
      this.linksRepo.create({
        userId,
        publicId,
        externalReference,
        amountCents: dto.amountCents,
        method: PaymentMethod.CARD,
        status: PaymentStatus.PENDING,
        feePercent: String(dto.feePercent),
        brand: dto.brand,
        installments: dto.installments,
        expiresAt: null,
        gatewayPaymentId: null,
        pixEmv: null,
        pixQrBase64: null,
      }),
    );

    const order = await this.ordersRepo.save(
      this.ordersRepo.create({
        userId,
        checkoutLinkId: link.id,
        externalReference,
        amountCents: dto.amountCents,
        status: PaymentStatus.PENDING,
        paidAt: null,
      }),
    );

    const card = await this.gatewayHttp.createCardPayment(token, {
      amount: dto.amountCents,
      description: dto.description,
      externalReference,
      cardNumber: dto.cardNumber,
      cardHolder: dto.cardHolder,
      expiryMonth: dto.expiryMonth,
      expiryYear: dto.expiryYear,
      cvv: dto.cvv,
      installments: dto.installments,
      feePercent: dto.feePercent,
    });

    const gatewayPaymentId = card.id ?? null;
    const gatewayStatus = this.mapGatewayStatus(card.status);

    link.gatewayPaymentId = gatewayPaymentId;
    link.status = gatewayStatus;
    order.status = gatewayStatus;
    if (gatewayStatus === PaymentStatus.APPROVED) {
      order.paidAt = new Date();
    }

    await this.linksRepo.save(link);
    await this.ordersRepo.save(order);

    if (gatewayStatus === PaymentStatus.APPROVED) {
      await this.mirrorTransaction({
        userId,
        orderId: order.id,
        checkoutLinkId: link.id,
        externalReference,
        gatewayPaymentId: link.gatewayPaymentId,
        type: TransactionType.PAYMENT_CARD,
        status: gatewayStatus,
        amountCents: link.amountCents,
        feePercent: link.feePercent,
        gatewayPayload: card,
      });
    }

    return {
      id: link.id,
      publicId: link.publicId,
      externalReference: link.externalReference,
      amountCents: link.amountCents,
      status: link.status,
      method: link.method,
      brand: link.brand,
      installments: link.installments,
      feePercent: link.feePercent,
      orderId: order.id,
      gatewayPaymentId: link.gatewayPaymentId,
      paidAt: order.paidAt,
    };
  }

  async findByPublicId(publicId: string) {
    const link = await this.linksRepo.findOne({ where: { publicId } });
    if (!link) {
      return null;
    }

    return {
      publicId: link.publicId,
      amountCents: link.amountCents,
      status: link.status,
      method: link.method,
      ...(link.method === PaymentMethod.PIX && {
        pixEmv: link.pixEmv,
        pixQrBase64: link.pixQrBase64,
      }),
      ...(link.method === PaymentMethod.CARD && {
        brand: link.brand,
        installments: link.installments,
        feePercent: link.feePercent,
      }),
    };
  }

  private formatAmount(cents: number): string {
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  private methodLabel(method: PaymentMethod): string {
    return method === PaymentMethod.PIX ? 'Pix' : 'Cartão';
  }

  async sendCheckoutLinkEmail(
    userId: string,
    publicId: string,
    dto: SendCheckoutEmailDto,
  ) {
    const link = await this.linksRepo.findOne({ where: { publicId } });

    if (!link) {
      throw new NotFoundException('Checkout link not found');
    }

    if (link.userId !== userId) {
      throw new ForbiddenException('You do not own this checkout link');
    }

    const user = await this.usersService.getProfile(userId);
    const frontendUrl = this.config
      .getOrThrow<string>('FRONTEND_URL')
      .replace(/\/$/, '');
    const checkoutUrl = `${frontendUrl}/checkout/${link.publicId}`;

    await this.emailService.sendCheckoutLinkEmail({
      to: dto.to,
      checkoutUrl,
      amountFormatted: this.formatAmount(link.amountCents),
      method: this.methodLabel(link.method),
      senderName: user.name,
      customMessage: dto.message,
    });

    return {
      sent: true,
      to: dto.to,
      checkoutUrl,
    };
  }

  private mapGatewayStatus(status?: string): PaymentStatus {
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
