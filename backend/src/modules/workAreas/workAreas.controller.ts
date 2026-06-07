import { WorkAreasService } from './workAreas.service';
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
import { CreateWorkAreasBatchDto, CreateWorkAreasDto } from './workAreas.dto';

@ApiTags('Work Areas')
@Controller('work-areas')
export class WorkAreasController {
  constructor(private readonly workAreasService: WorkAreasService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastro de área de atuação' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Área de atuação criada com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Dados de entrada inválidos ou área de atuação já existe (por exemplo, nome duplicado).',
  })
  async create(@Body() createWorkAreasDto: CreateWorkAreasDto) {
    return this.workAreasService.create(createWorkAreasDto);
  }
  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastro de áreas de atuação em lote' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Áreas de atuação criadas com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Dados de entrada inválidos ou áreas de atuação já existem (por exemplo, nome duplicado).',
  })
  async createBatch(@Body() createWorkAreasBatchDto: CreateWorkAreasBatchDto) {
    return await this.workAreasService.createBatch(createWorkAreasBatchDto);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas as áreas de atuação' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de áreas de atuação retornada com sucesso.',
  })
  async findAll() {
    return await this.workAreasService.findAll();
  }
}
