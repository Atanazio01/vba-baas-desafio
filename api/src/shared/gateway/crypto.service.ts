import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class CryptoService {
  private readonly key: Buffer;

  constructor(config: ConfigService) {
    const raw = config.getOrThrow<string>('GATEWAY_ENCRYPTION_KEY');
    this.key = Buffer.from(raw, 'base64');

    if (this.key.length !== 32) {
      throw new Error('GATEWAY_ENCRYPTION_KEY must be 32 bytes long');
    }
  }

  encrypt(plainText: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const decrypted = Buffer.concat([
      cipher.update(plainText, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return [
      iv.toString('base64'),
      tag.toString('base64'),
      decrypted.toString('base64'),
    ].join(':');
  }

  decrypt(encrypted: string): string {
    const [ivB64, tagB64, cipherB64] = encrypted.split(':');
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.key,
      Buffer.from(ivB64, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(cipherB64, 'base64')),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}
