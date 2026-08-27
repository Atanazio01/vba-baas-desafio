import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { PersonType } from '../enums/person-type.enum';

export class RegisterGatewayUserDto {
  @ApiProperty({
    enum: PersonType,
    example: PersonType.PF,
    description: 'PF = pessoa física | PJ = pessoa jurídica',
  })
  @IsEnum(PersonType)
  personType!: PersonType;

  @ApiProperty({
    example: 'Marcos Atanazio',
    description: 'PF: nome completo | PJ: razão social',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Loja do Marcos',
    description:
      'Nome fantasia — recomendado/obrigatório em PJ; PF pode omitir',
  })
  @IsString()
  @IsOptional()
  tradingName?: string;

  @ApiProperty({ example: 'marcosd.atanazio@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '11999998888',
    description: 'Celular com DDD (11 dígitos)',
  })
  @IsString()
  @Length(11, 11)
  phone!: string;

  @ApiProperty({
    example: '13993467094',
    description: 'PF: CPF (11) | PJ: CNPJ (14) — só dígitos',
  })
  @IsString()
  @IsNotEmpty()
  document!: string;

  @ApiProperty({ example: '01310100', description: 'CEP só dígitos' })
  @IsString()
  @IsNotEmpty()
  zipCode!: string;

  @ApiProperty({ example: 'Av. Paulista' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ example: '1000' })
  @IsString()
  @IsNotEmpty()
  number!: string;

  @ApiPropertyOptional({ example: 'Sala 12' })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty({ example: 'Bela Vista' })
  @IsString()
  @IsNotEmpty()
  neighborhood!: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @Length(2, 2)
  state!: string;
}
