import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'O email do usuário',
  })
  @IsEmail({}, { message: 'O email deve ser um email válido' })
  @IsNotEmpty({ message: 'O email não pode ser vazio' })
  email!: string;

  @ApiProperty({ example: 'Senha123', description: 'A senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A senha não pode ser vazia' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password!: string;
}
