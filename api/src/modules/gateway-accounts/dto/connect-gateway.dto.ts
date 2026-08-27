import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectGatewayDto {
  @IsString()
  @IsNotEmpty()
  document!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
