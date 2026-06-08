import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectsControllerDto } from './projects.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FilesInterceptor('photosList'))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastro de Projeto' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Projeto criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Dados de entrada inválidos ou Projeto já existe (por exemplo, nome duplicado).',
  })
  async create(
    @UploadedFiles() files: any[],
    @Body() createProjectsControllerDto: CreateProjectsControllerDto,
  ) {
    return this.projectsService.create(createProjectsControllerDto, files);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar Projetos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de projetos retornada com sucesso.',
  })
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get('/category/:category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar Projetos por categoria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de projetos por categoria retornada com sucesso.',
  })
  async findByCategory(@Param('category') category: string) {
    return this.projectsService.findByCategory(category);
  }
}
