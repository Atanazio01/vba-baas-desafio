import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoService } from '../../shared/gateway/crypto.service';
import { GatewayHttpClient } from '../../shared/gateway/gateway-http.client';
import { ConnectGatewayDto } from './dto/connect-gateway.dto';
import { RegisterGatewayUserDto } from './dto/register-gateway-user.dto';
import { GatewayAccount } from './entities/gateway-account.entity';

@Injectable()
export class GatewayAccountsService {
  constructor(
    @InjectRepository(GatewayAccount)
    private readonly repo: Repository<GatewayAccount>,
    private readonly gatewayHttp: GatewayHttpClient,
    private readonly crypto: CryptoService,
  ) {}

  async register(dto: RegisterGatewayUserDto) {
    // Só encaminha — row no MySQL nasce no connect
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

  /** Uso interno (checkout, wallet…) */
  async getDecryptedToken(userId: string): Promise<string> {
    const account = await this.repo.findOne({ where: { userId } });

    if (!account) {
      throw new NotFoundException('Gateway account not connected');
    }

    return this.crypto.decrypt(account.accessTokenEncrypted);
  }
}
