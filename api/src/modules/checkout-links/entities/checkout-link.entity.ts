import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PaymentMethod } from '../enums/payment-method.enum';
import { CheckoutLinkStatus } from '../enums/status.enum';

@Entity('checkout_links')
export class CheckoutLink {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'public_id', unique: true })
  publicId!: string;

  @Column({ name: 'external_reference', unique: true })
  externalReference!: string;

  @Column({ name: 'amount_cents', type: 'int' })
  amountCents!: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  method!: PaymentMethod;

  @Column({ type: 'enum', enum: CheckoutLinkStatus })
  status!: CheckoutLinkStatus;

  @Column({
    name: 'fee_percent',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  feePercent!: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  brand!: string | null;

  @Column({ type: 'int', nullable: true })
  installments!: number | null;

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt!: Date | null;

  @Column({ name: 'gateway_payment_id', type: 'varchar', nullable: true })
  gatewayPaymentId!: string | null;

  @Column({ name: 'pix_emv', type: 'text', nullable: true })
  pixEmv!: string | null;

  @Column({ name: 'pix_qr_base64', type: 'text', nullable: true })
  pixQrBase64!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
