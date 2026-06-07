import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProjectsDto {
  @ApiProperty({
    description: 'ID do usuário que criou o projeto',
    example: '64b8c9f1e4b0a2d3c4e5f6g7',
    required: true,
  })
  @IsNotEmpty()
  userId!: string;
  @ApiProperty({
    description: 'Nome do projeto',
    example: 'Meu Projeto Incrível',
    required: true,
  })
  @IsNotEmpty()
  name!: string;
  @ApiProperty({
    description: 'Descrição do projeto',
    example: 'Este é um projeto incrível que estou desenvolvendo.',
    required: true,
  })
  @IsNotEmpty()
  description!: string;
  @ApiProperty({
    description: 'Lista de URLs das fotos do projeto',
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg',
    ],
    required: true,
  })
  @IsNotEmpty()
  photosList!: string[];
  @ApiProperty({
    description: 'categoria do projeto',
    example: 'FRONT END',
    required: true,
  })
  @IsNotEmpty()
  category!: string;
}

//

export class CreateProjectsControllerDto {
  @ApiProperty({
    description: 'ID do usuário que criou o projeto',
    example: '64b8c9f1e4b0a2d3c4e5f6g7',
    required: true,
  })
  @IsNotEmpty()
  userId!: string;
  @ApiProperty({
    description: 'Nome do projeto',
    example: 'Meu Projeto Incrível',
    required: true,
  })
  @IsNotEmpty()
  name!: string;
  @ApiProperty({
    description: 'Descrição do projeto',
    example: 'Este é um projeto incrível que estou desenvolvendo.',
    required: true,
  })
  @IsNotEmpty()
  description!: string;
  @ApiProperty({
    description: 'Lista de arquivos das fotos do projeto',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
  })
  photosList!: any[];
  @ApiProperty({
    description: 'categoria do projeto',
    example: 'FRONT END',
    required: true,
  })
  @IsNotEmpty()
  category!: string;
}
