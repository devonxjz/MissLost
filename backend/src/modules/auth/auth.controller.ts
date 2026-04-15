import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập' })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req.ip);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất' })
  logout(@CurrentUser() user: any, @Res() res: Response) {
    // Clear the HTTP-only cookie
    res.clearCookie('access_token', {
      httpOnly: process.env.COOKIE_HTTP_ONLY !== 'false',
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax',
      path: process.env.COOKIE_PATH || '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });
    return this.authService.logout(user.id);
  }

  @Public()
  @Get('verify-email')
  @ApiOperation({ summary: 'Xác thực email' })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Quên mật khẩu' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đặt lại mật khẩu' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google - Redirect to Google' })
  googleLogin() {
    // This route will redirect to Google OAuth automatically by the guard
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth Callback' })
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Fixed: Handle OAuth error from Passport
    if (req.query.error) {
      return res.redirect(`${frontendUrl}/auth/login?error=${req.query.error}`);
    }

    try {
      const profile = req.user;
      const result = await this.authService.googleLogin(profile, req.ip);
      
      // Fixed: Use HTTP-only cookies instead of URL params to prevent token leakage
      res.cookie('access_token', result.access_token, {
        httpOnly: process.env.COOKIE_HTTP_ONLY !== 'false',
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (match JWT expiry)
        path: process.env.COOKIE_PATH || '/',
        domain: process.env.COOKIE_DOMAIN || undefined,
      });

      // Redirect to frontend with minimal data (no token in URL)
      const callbackUrl = `${frontendUrl}/auth/google-callback?user=${encodeURIComponent(JSON.stringify(result.user))}`;
      res.redirect(callbackUrl);
    } catch (error) {
      // Fixed: Handle any errors during login
      console.error('Google login error:', error);
      res.redirect(`${frontendUrl}/auth/login?error=google_login_failed`);
    }
  }
}
