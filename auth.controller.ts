import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) { return this.authService.login(dto); }

  @Post('register')
  register(@Body() dto: RegisterDto) { return this.authService.register(dto); }

  @Post('refresh') @UseGuards(JwtRefreshGuard) @HttpCode(HttpStatus.OK)
  refreshTokens(@GetUser() user: any) { return this.authService.refreshTokens(user.id, user.refreshToken); }

  @Post('logout') @UseGuards(JwtAuthGuard) @HttpCode(HttpStatus.OK)
  logout(@GetUser('id') userId: string) { return this.authService.logout(userId); }

  @Get('me') @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  getProfile(@GetUser() user: any) { return this.authService.getProfile(user.id); }
}
