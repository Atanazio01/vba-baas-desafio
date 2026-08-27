import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { PaymentStatus } from '../../shared/enums/payment-status.enum';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { GatewayHttpClient } from '../../shared/gateway/gateway-http.client';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import { Transaction } from '../transaction/entities/transaction.entity';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { Withdrawal } from './entities/withdrawal.entity';
import { WithdrawalDestinationType } from './enums/withdrawal-destination-type.enum';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalsRepo: Repository<Withdrawal>,
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    private readonly gatewayAccounts: GatewayAccountsService,
    private readonly gatewayHttp: GatewayHttpClient,
  ) {}

  async create(userId: string, dto: CreateWithdrawalDto) {
    const token = await this.gatewayAccounts.getDecryptedToken(userId);
    const externalReference = `WITHDRAWAL-${randomUUID()}`;

    const withdrawal = await this.withdrawalsRepo.save(
      this.withdrawalsRepo.create({
        userId,
        externalReference,
        amountCents: dto.amountCents,
        destinationType: WithdrawalDestinationType.PIX,
        pixKey: dto.pixKey,
        accountHolderDocument: dto.document,
        status: PaymentStatus.PENDING,
        gatewayWithdrawalId: null,
        gatewayPayload: null,
        bankCode: null,
        bankBranch: null,
        accountNumber: null,
        accountType: null,
        accountHolderName: null,
      }),
    );

    const gateway = await this.gatewayHttp.createWithdrawal(token, {
      amount: dto.amountCents,
      pixKey: dto.pixKey,
      document: dto.document,
      description: dto.description,
      externalReference,
    });

    const gatewayStatus = this.mapGatewayStatus(gateway.status);
    withdrawal.gatewayWithdrawalId = gateway.id ?? null;
    withdrawal.status = gatewayStatus;
    withdrawal.gatewayPayload = gateway;

    await this.withdrawalsRepo.save(withdrawal);

    if (gatewayStatus === PaymentStatus.APPROVED) {
      await this.mirrorTransaction({
        userId,
        externalReference,
        gatewayPaymentId: withdrawal.gatewayWithdrawalId,
        status: gatewayStatus,
        amountCents: withdrawal.amountCents,
        gatewayPayload: gateway,
      });
    }

    return {
      id: withdrawal.id,
      externalReference: withdrawal.externalReference,
      amountCents: withdrawal.amountCents,
      status: withdrawal.status,
      destinationType: withdrawal.destinationType,
      pixKey: withdrawal.pixKey,
      gatewayWithdrawalId: withdrawal.gatewayWithdrawalId,
    };
  }

  async findById(userId: string, id: string) {
    const withdrawal = await this.withdrawalsRepo.findOne({
      where: { id, userId },
    });
    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    return {
      id: withdrawal.id,
      externalReference: withdrawal.externalReference,
      amountCents: withdrawal.amountCents,
      status: withdrawal.status,
      destinationType: withdrawal.destinationType,
      pixKey: withdrawal.pixKey,
      gatewayWithdrawalId: withdrawal.gatewayWithdrawalId,
      createdAt: withdrawal.createdAt,
      updatedAt: withdrawal.updatedAt,
    };
  }

  private async mirrorTransaction(params: {
    userId: string;
    externalReference: string;
    gatewayPaymentId: string | null;
    status: PaymentStatus;
    amountCents: number;
    gatewayPayload: Record<string, unknown>;
  }) {
    const exists = await this.txRepo.findOne({
      where: { externalReference: params.externalReference },
    });
    if (exists) return;

    await this.txRepo.save(
      this.txRepo.create({
        userId: params.userId,
        orderId: null,
        checkoutLinkId: null,
        gatewayPaymentId: params.gatewayPaymentId,
        externalReference: params.externalReference,
        type: TransactionType.WITHDRAWAL,
        status: params.status,
        amountCents: params.amountCents,
        feePercent: null,
        gatewayPayload: params.gatewayPayload,
      }),
    );
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
