import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateWorkAreasDto {
  @ApiProperty({
    description: 'Nome da área de atuação',
    example: 'User Interface',
    required: true,
  })
  @IsNotEmpty()
  name!: string;
}

export class CreateWorkAreasBatchDto {
  @ApiProperty({
    description: 'Lista de áreas de atuação a serem criadas',
    example: [
      {
        name: 'User Interface',
      },
      {
        name: 'Backend Development',
      },
    ],
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  items!: CreateWorkAreasDto[];
}
