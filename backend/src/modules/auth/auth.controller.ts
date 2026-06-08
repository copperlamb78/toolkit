import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso, retorna o token de acesso.',
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.' })
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto);
  }
}
