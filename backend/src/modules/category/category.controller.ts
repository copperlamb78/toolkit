import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryBatchDto, CreateCategoryDto } from './category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastro de Categoria' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Categoria criada com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Dados de entrada inválidos ou Categoria já existe (por exemplo, nome duplicado).',
  })
  async create(@Body() CategoryDto: CreateCategoryDto) {
    return this.categoryService.create(CategoryDto);
  }
  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastro de Categorias em lote' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Categorias criadas com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Dados de entrada inválidos ou Categorias já existem (por exemplo, nome duplicado).',
  })
  async createBatch(@Body() createCategoryBatchDto: CreateCategoryBatchDto) {
    return await this.categoryService.createBatch(createCategoryBatchDto);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas as Categorias' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de categorias retornada com sucesso.',
  })
  async findAll() {
    return await this.categoryService.findAll();
  }
}
