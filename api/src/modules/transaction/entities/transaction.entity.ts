import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';
import { CheckoutLink } from '../../checkout-links/entities/checkout-link.entity';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { TransactionType } from '../enums/transaction-type.enum';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'order_id', type: 'uuid', nullable: true })
  orderId!: string | null;

  @ManyToOne(() => Order, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'order_id' })
  order!: Order | null;

  @Column({ name: 'checkout_link_id', type: 'uuid', nullable: true })
  checkoutLinkId!: string | null;

  @ManyToOne(() => CheckoutLink, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'checkout_link_id' })
  checkoutLink!: CheckoutLink | null;

  @Column({ name: 'gateway_payment_id', type: 'varchar', nullable: true })
  gatewayPaymentId!: string | null;

  @Column({ name: 'external_reference' })
  externalReference!: string;

  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @Column({ name: 'status', type: 'enum', enum: PaymentStatus })
  status!: PaymentStatus;

  @Column({ name: 'amount_cents', type: 'int' })
  amountCents!: number;

  @Column({
    name: 'fee_percent',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  feePercent!: string | null;

  @Column({ name: 'gateway_payload', type: 'json' })
  gatewayPayload!: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
