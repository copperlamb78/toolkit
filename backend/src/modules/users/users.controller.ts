import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Patch,
  Param,
  ApiConsumes,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastro de usuário' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Dados de entrada inválidos ou usuário já existe (por exemplo, email duplicado, senhas não coincidem).',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuários retornada com sucesso.',
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('photosList'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário atualizado com sucesso.',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() file: any,
  ) {
    return this.usersService.updateUser(id, updateUserDto, file);
  }
}
