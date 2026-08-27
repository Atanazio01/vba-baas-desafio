import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { PaymentStatus } from '../../shared/enums/payment-status.enum';
import { GatewayHttpClient } from '../../shared/gateway/gateway-http.client';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import { Order } from '../orders/entities/order.entity';
import { CreatePixCheckoutDto } from './dto/create-pix-checkout.dto';
import { CheckoutLink } from './entities/checkout-link.entity';
import { PaymentMethod } from './enums/payment-method.enum';

@Injectable()
export class CheckoutLinksService {
  constructor(
    @InjectRepository(CheckoutLink)
    private readonly linksRepo: Repository<CheckoutLink>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    private readonly gatewayAccounts: GatewayAccountsService,
    private readonly gatewayHttp: GatewayHttpClient,
  ) {}

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
    const qr = pix.qrCodeBase64 ?? pix.qr_code_base64;
    const gatewayPaymentId = pix.id ?? pix.txid ?? null;
    const gatewayStatus = this.mapGatewayStatus(pix.status);

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
      pixEmv: link.pixEmv,
      pixQrBase64: link.pixQrBase64,
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
