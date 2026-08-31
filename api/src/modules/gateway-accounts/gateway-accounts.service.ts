import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { CryptoService } from '../../shared/gateway/crypto.service';
import { GatewayHttpClient } from '../../shared/gateway/gateway-http.client';
import { ConnectGatewayDto } from './dto/connect-gateway.dto';
import { RegisterGatewayUserDto } from './dto/register-gateway-user.dto';
import { GatewayAccount } from './entities/gateway-account.entity';

@Injectable()
export class GatewayAccountsService {
  private readonly logger = new Logger(GatewayAccountsService.name);

  constructor(
    @InjectRepository(GatewayAccount)
    private readonly repo: Repository<GatewayAccount>,
    private readonly gatewayHttp: GatewayHttpClient,
    private readonly crypto: CryptoService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterGatewayUserDto) {
    return this.gatewayHttp.registerUser(dto);
  }

  async connect(userId: string, dto: ConnectGatewayDto) {
    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) {
      throw new ConflictException('Gateway account already connected');
    }

    const login = await this.gatewayHttp.login(dto.document, dto.password);

    const account = this.repo.create({
      userId,
      gatewayEmail: login.email,
      gatewayDocument: login.document,
      clientCode: login.clientCode,
      storeKey: login.storeKey,
      accessTokenEncrypted: this.crypto.encrypt(login.accessToken),
    });

    await this.repo.save(account);
    await this.registerDefaultWebhooks(login.accessToken);

    return {
      connected: true,
      gatewayEmail: account.gatewayEmail,
    };
  }

  async reconnect(userId: string, dto: ConnectGatewayDto) {
    const account = await this.repo.findOne({ where: { userId } });

    if (!account) {
      throw new NotFoundException('Gateway account not connected');
    }

    const login = await this.gatewayHttp.login(dto.document, dto.password);

    account.gatewayEmail = login.email;
    account.gatewayDocument = login.document;
    account.clientCode = login.clientCode;
    account.storeKey = login.storeKey;
    account.accessTokenEncrypted = this.crypto.encrypt(login.accessToken);

    await this.repo.save(account);
    await this.registerDefaultWebhooks(login.accessToken);

    return {
      connected: true,
      gatewayEmail: account.gatewayEmail,
    };
  }

  async getStatus(userId: string) {
    const account = await this.repo.findOne({ where: { userId } });

    if (!account) {
      return { connected: false };
    }

    return {
      connected: true,
      gatewayEmail: account.gatewayEmail,
      clientCode: account.clientCode,
    };
  }

  async getDecryptedToken(userId: string): Promise<string> {
    const account = await this.repo.findOne({ where: { userId } });
    if (!account) {
      throw new NotFoundException('Gateway account not connected');
    }
    try {
      return this.crypto.decrypt(account.accessTokenEncrypted);
    } catch (err) {
      this.logger.warn('Failed to decrypt access token', err);
      throw new UnauthorizedException(
        'Sessão Lera inválida. Reconecte sua conta.',
      );
    }
  }

  private async registerDefaultWebhooks(accessToken: string): Promise<void> {
    const baseUrl = this.config
      .getOrThrow<string>('API_PUBLIC_URL')
      .replace(/\/$/, '');
    const secret = this.config.get<string>('WEBHOOK_HMAC_SECRET');

    const webhooks = [
      {
        event: TransactionType.PAYMENT_PIX,
        url: `${baseUrl}/webhooks/lera-box/pix`,
      },
      {
        event: TransactionType.PAYMENT_CARD,
        url: `${baseUrl}/webhooks/lera-box/card`,
      },
      {
        event: TransactionType.WITHDRAWAL,
        url: `${baseUrl}/webhooks/lera-box/withdrawal`,
      },
    ];

    for (const webhook of webhooks) {
      try {
        await this.gatewayHttp.registerWebhook(accessToken, {
          event: webhook.event,
          url: webhook.url,
          secret,
        });
        this.logger.log(
          `Webhook registered: ${webhook.event} -> ${webhook.url}`,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        this.logger.warn(
          `Webhook registration failed for ${webhook.event}: ${message}`,
        );
      }
    }
  }
}
