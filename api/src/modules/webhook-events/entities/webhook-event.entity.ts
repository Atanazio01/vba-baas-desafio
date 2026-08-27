import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';
import { User } from '../../users/entities/user.entity';
import { WebhookProcessingStatus } from '../enums/processing-status.enum';

@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'event_type', type: 'enum', enum: TransactionType })
  eventType!: TransactionType;

  @Column({ name: 'idempotency_key', type: 'varchar', unique: true })
  idempotencyKey!: string;

  @Column({ name: 'signature_valid', type: 'boolean' })
  signatureValid!: boolean;

  @Column({ name: 'payload', type: 'json' })
  payload!: Record<string, any>;

  @Column({
    name: 'processing_status',
    type: 'enum',
    enum: WebhookProcessingStatus,
  })
  processingStatus!: WebhookProcessingStatus;

  @Column({ name: 'processed_at', type: 'datetime', nullable: true })
  processedAt!: Date | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
