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
  @IsEnum(PersonType)
  personType!: PersonType;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  tradingName?: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @Length(11, 11)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  document!: string;

  @IsString()
  @IsNotEmpty()
  zipCode!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  number!: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsNotEmpty()
  neighborhood!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @Length(2, 2)
  state!: string;
}
