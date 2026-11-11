import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { authMapper } from './auth.mapper';
import { Public } from './decorators/public.decorator';
import type { AuthSessionResponseDto } from './dto/auth-session-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './services/auth.service';

@Public()
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<AuthSessionResponseDto> {
    const session = await this.authService.register(
      authMapper.fromRegisterDto(dto),
    );
    return authMapper.toResponse(session);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthSessionResponseDto> {
    const session = await this.authService.login(authMapper.fromLoginDto(dto));
    return authMapper.toResponse(session);
  }
}
