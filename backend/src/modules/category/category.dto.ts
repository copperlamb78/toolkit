import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'FRONT END',
    required: true,
  })
  name!: string;
}

export class CreateCategoryBatchDto {
  @ApiProperty({
    description: 'Lista de categorias a serem criadas',
    example: [
      {
        name: 'FRONT END',
      },
      {
        name: 'BACK END',
      },
    ],
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  items!: CreateCategoryDto[];
}
