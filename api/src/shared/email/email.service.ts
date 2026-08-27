import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

type SendCheckoutLinkParams = {
  to: string;
  checkoutUrl: string;
  amountFormatted: string;
  method: string;
  senderName?: string;
  customMessage?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.getOrThrow<string>('RESEND_API_KEY'));
    this.from = this.config.getOrThrow<string>('EMAIL_FROM');
  }

  async sendCheckoutLinkEmail(params: SendCheckoutLinkParams): Promise<void> {
    const {
      to,
      checkoutUrl,
      amountFormatted,
      method,
      senderName,
      customMessage,
    } = params;

    const greeting = senderName
      ? `<p>Olá,</p><p><strong>${senderName}</strong> enviou um link de pagamento para você.</p>`
      : `<p>Olá,</p><p>Você recebeu um link de pagamento.</p>`;

    const extra = customMessage
      ? `<p style="color:#495057">${customMessage}</p>`
      : '';

    const html = `
      <div style="font-family:DM Sans,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
        ${greeting}
        ${extra}
        <div style="background:#F8F9FA;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0"><strong>Valor:</strong> ${amountFormatted}</p>
          <p style="margin:8px 0 0"><strong>Forma:</strong> ${method}</p>
        </div>
        <a href="${checkoutUrl}"
           style="display:inline-block;background:#40C057;color:#fff;text-decoration:none;
                  padding:12px 24px;border-radius:8px;font-weight:600">
          Pagar agora
        </a>
        <p style="margin-top:24px;font-size:12px;color:#868E96">
          Ou copie o link: ${checkoutUrl}
        </p>
      </div>
    `;

    const { error } = await this.resend.emails.send({
      from: this.from,
      to: [to],
      subject: `Link de pagamento — ${amountFormatted}`,
      html,
    });

    if (error) {
      this.logger.error(`Resend error: ${JSON.stringify(error)}`);
      throw new Error(error.message);
    }
  }
}
