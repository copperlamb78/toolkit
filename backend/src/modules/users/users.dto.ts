import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'O email do usuário',
    example: 'john@gmail.com',
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'A senha do usuário (mínimo 6 caracteres)',
    example: 'secret123',
    required: true,
  })
  @MinLength(6)
  password!: string;

  @ApiProperty({
    description: 'Confirmação da senha',
    example: 'secret123',
    required: true,
  })
  @MinLength(6)
  confirmPassword?: string;
}
