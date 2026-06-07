import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
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

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'O email do usuário',
    example: 'john@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'A senha do usuário (mínimo 6 caracteres)',
    example: 'secret123',
    required: false,
  })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Confirmação da senha',
    example: 'secret123',
    required: false,
  })
  @IsOptional()
  @MinLength(6)
  confirmPassword?: string;

  @ApiProperty({
    description: 'Descrição do usuário',
    example: 'Desenvolvedor Full Stack',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Avatar do usuário',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Link do Github',
    example: 'https://github.com/johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  linkGithub?: string;

  @ApiProperty({
    description: 'Link do LinkedIn',
    example: 'https://linkedin.com/in/johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  linkLinkedin?: string;

  @ApiProperty({
    description: 'Link do Instagram',
    example: 'https://instagram.com/johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  linkInstagram?: string;

  @ApiProperty({
    description: 'Link do Twitter',
    example: 'https://twitter.com/johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  linkTwitter?: string;

  @ApiProperty({
    description: 'Nome de usuário (username)',
    example: 'johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Áreas de atuação',
    example: ['Frontend', 'Backend'],
    required: false,
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workAreas?: string[];
}
