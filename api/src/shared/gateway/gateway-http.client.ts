import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { PersonType } from '../../modules/gateway-accounts/enums/person-type.enum';

export type GatewayRegisterPayload = {
  personType: PersonType;
  name: string;
  tradingName?: string;
  email: string;
  phone: string;
  document: string;
  zipCode: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
};

type GatewayLoginRaw = {
  access_token: string;
  token_type?: string;
  codigoCliente: number | string;
  chaveLoja: string;
  user: {
    id: string;
    personType: string;
    name: string;
    tradingName?: string;
    email: string;
    document: string;
  };
};

export type GatewayLoginResponse = {
  accessToken: string;
  clientCode: string;
  storeKey: string;
  email: string;
  document: string;
};

export type GatewayMeResponse = {
  email: string;
  document?: string;
  // outros campos que o Lera devolver
};

export type CreatePixPaymentPayload = {
  amount: number;
  payerDocument: string;
  description?: string;
  externalReference?: string;
};

export type GatewayPixPaymentResponse = {
  id?: string;
  txid?: string;
  status?: string;
  emv?: string;
  qrCodeBase64?: string;
  qr_code_base64?: string;
  copyPaste?: string;
  // ajusta após o 1º response real (como no login)
  [key: string]: unknown;
};

export type GatewayRegisterWebhookResponse = {
  message?: string;
  [key: string]: unknown;
};

export type GatewayWalletTransactionsQuery = {
  limit?: number | string;
  status?: 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED' | 'CANCELLED';
  type?: 'PIX' | 'CREDIT_CARD' | 'WITHDRAWAL';
};

export type GatewayWalletTransaction = {
  id: string;
  type: 'PIX' | 'CREDIT_CARD' | 'WITHDRAWAL';
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED' | 'CANCELLED';
  denialReason: string | null;
  amount: number; // centavos
  amountFormatted: string;
  description: string | null;
  message: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type GatewayWalletTransactionsResponse = {
  walletId: string;
  balance: number;
  balanceFormatted: string;
  filters: {
    status: string | null;
    type: string | null;
  };
  transactions: GatewayWalletTransaction[];
};

export type GatewayWalletResponse = {
  id: string;
  userId: string;
  balance: number;
  balanceFormatted: string;
  updatedAt: string;
};

export type CreateCardPaymentPayload = {
  amount: number;
  description?: string;
  externalReference?: string;
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  installments: number;
  feePercent: number;
};

export type GatewayCardPaymentResponse = {
  id?: string;
  status?: string;
  amount?: number;
  feePercent?: number;
  installments?: number;
  brand?: string;
  [key: string]: unknown;
};

export type GatewayFeesQuery = {
  brand?: 'VISA' | 'MASTERCARD' | 'ELO';
};

export type GatewayFeesResponse = unknown; // ajusta no 1º GET real

@Injectable()
export class GatewayHttpClient {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.baseUrl = config.getOrThrow<string>('GATEWAY_BASE_URL');
  }

  async registerUser(payload: GatewayRegisterPayload) {
    try {
      const { data } = await firstValueFrom(
        this.http.post<{ message: string }>(`${this.baseUrl}/users`, payload),
      );
      return data;
    } catch (error) {
      this.rethrow(error);
    }
  }

  async login(
    document: string,
    password: string,
  ): Promise<GatewayLoginResponse> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<GatewayLoginRaw>(`${this.baseUrl}/auth/login`, {
          document,
          password,
        }),
      );
      if (!data.access_token || !data.codigoCliente || !data.chaveLoja) {
        throw new BadGatewayException('Unexpected login response from gateway');
      }
      return {
        accessToken: data.access_token,
        clientCode: String(data.codigoCliente),
        storeKey: data.chaveLoja,
        email: data.user.email,
        document: data.user.document,
      };
    } catch (error) {
      this.rethrow(error);
    }
  }

  async getMe(accessToken: string): Promise<GatewayMeResponse> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<GatewayMeResponse>(`${this.baseUrl}/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (error) {
      this.rethrow(error);
    }
  }

  async createPixPayment(
    accessToken: string,
    payload: CreatePixPaymentPayload,
  ): Promise<GatewayPixPaymentResponse> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<GatewayPixPaymentResponse>(
          `${this.baseUrl}/payments/pix`,
          payload,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        ),
      );
      return data;
    } catch (error) {
      this.rethrow(error);
    }
  }

  async getWallet(accessToken: string): Promise<GatewayWalletResponse> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<GatewayWalletResponse>(`${this.baseUrl}/wallet`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (error) {
      this.rethrow(error);
    }
  }

  async listWalletTransactions(
    accessToken: string,
    query: GatewayWalletTransactionsQuery = {},
  ): Promise<GatewayWalletTransactionsResponse> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<GatewayWalletTransactionsResponse>(
          `${this.baseUrl}/wallet/transactions`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: query,
          },
        ),
      );
      return data;
    } catch (error) {
      this.rethrow(error);
    }
  }

  async getFees(query: GatewayFeesQuery = {}): Promise<GatewayFeesResponse> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<GatewayFeesResponse>(`${this.baseUrl}/fees`, {
          params: query,
        }),
      );
      return data;
    } catch (error) {
      this.rethrow(error);
    }
  }

  async createCardPayment(
    accessToken: string,
    payload: CreateCardPaymentPayload,
  ): Promise<GatewayCardPaymentResponse> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<GatewayCardPaymentResponse>(
          `${this.baseUrl}/payments/card`,
          payload,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        ),
      );
      return data;
    } catch (error) {
      this.rethrow(error);
    }
  }

  async registerWebhook(
    accessToken: string,
    payload: { event: string; url: string; secret?: string },
  ): Promise<GatewayRegisterWebhookResponse> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<GatewayRegisterWebhookResponse>(
          `${this.baseUrl}/webhooks`,
          payload,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        ),
      );
      return data;
    } catch (error) {
      this.rethrow(error);
    }
  }

  // responsável por reverter o erro do gateway para um erro do NestJS
  private rethrow(error: unknown): never {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data as
        { message?: string | string[] } | undefined;
      const rawMessage = data?.message;
      const message = Array.isArray(rawMessage)
        ? rawMessage.join(', ')
        : (rawMessage ?? error.message ?? 'Gateway request failed');
      if (status === 401 || status === 403) {
        throw new UnauthorizedException(message);
      }
      if (status === 409) {
        throw new ConflictException(message);
      }
      throw new BadGatewayException(message);
    }
    throw error;
  }
}
