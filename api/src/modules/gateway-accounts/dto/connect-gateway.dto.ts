import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectGatewayDto {
  @ApiProperty({
    example: '13993467094',
    description: 'CPF/CNPJ do e-mail Lera',
  })
  @IsString()
  @IsNotEmpty()
  document!: string;

  @ApiProperty({
    example: 'SenhaDoEmail123!',
    description: 'Senha recebida no cadastro Lera',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
