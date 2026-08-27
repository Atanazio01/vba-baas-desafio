import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SendCheckoutEmailDto {
  @ApiProperty({ example: 'cliente@email.com' })
  @IsEmail()
  @IsNotEmpty()
  to!: string;

  @ApiPropertyOptional({ example: 'Referente ao serviço de consultoria.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
