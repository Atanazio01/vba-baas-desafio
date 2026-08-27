import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';
import { CheckoutLink } from '../../checkout-links/entities/checkout-link.entity';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'checkout_link_id', type: 'uuid', unique: true })
  checkoutLinkId!: string;

  @OneToOne(() => CheckoutLink, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'checkout_link_id' })
  checkoutLink!: CheckoutLink;

  @Column({ name: 'external_reference', unique: true })
  externalReference!: string;

  @Column({ name: 'amount_cents', type: 'int' })
  amountCents!: number;

  @Column({ name: 'status', type: 'enum', enum: PaymentStatus })
  status!: PaymentStatus;

  @Column({ name: 'paid_at', type: 'datetime', nullable: true })
  paidAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
