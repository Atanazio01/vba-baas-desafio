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
import { User } from '../../users/entities/user.entity';
import { WithdrawalDestinationType } from '../enums/withdrawal-destination-type.enum';

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    name: 'gateway_withdrawal_id',
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  gatewayWithdrawalId!: string | null;

  @Column({ name: 'amount_cents', type: 'int' })
  amountCents!: number;

  @Column({
    name: 'destination_type',
    type: 'enum',
    enum: WithdrawalDestinationType,
  })
  destinationType!: WithdrawalDestinationType;

  @Column({ name: 'pix_key', type: 'varchar', nullable: true })
  pixKey!: string | null;

  @Column({ name: 'status', type: 'enum', enum: PaymentStatus })
  status!: PaymentStatus;

  @Column({ name: 'gateway_payload', type: 'json', nullable: true })
  gatewayPayload!: Record<string, any> | null;

  @Column({ name: 'bank_code', type: 'varchar', nullable: true })
  bankCode!: string | null;

  @Column({ name: 'bank_branch', type: 'varchar', nullable: true })
  bankBranch!: string | null;

  @Column({ name: 'account_number', type: 'varchar', nullable: true })
  accountNumber!: string | null;

  @Column({ name: 'account_type', type: 'varchar', nullable: true })
  accountType!: string | null; // ex: CHECKING, SAVINGS — confere no Swagger

  @Column({ name: 'account_holder_name', type: 'varchar', nullable: true })
  accountHolderName!: string | null;

  @Column({ name: 'account_holder_document', type: 'varchar', nullable: true })
  accountHolderDocument!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
