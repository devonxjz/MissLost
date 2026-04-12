import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient } from '../../config/supabase.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  ValidationException,
} from '../../common/exceptions/app.exception';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // ──────────────── REGISTER ────────────────
  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirm_password) {
      throw new ValidationException('Mật khẩu xác nhận không khớp');
    }

    const supabase = getSupabaseClient();

    // Check email duplicate
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', dto.email)
      .maybeSingle();
    if (existing) throw new ConflictException('Email đã được đăng ký');

    const password_hash = await bcrypt.hash(dto.password, 12);

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        full_name: dto.full_name,
        email: dto.email,
        password_hash,
        student_id: dto.student_id ?? null,
        role: 'user',
        status: 'active',
      })
      .select('id, email, full_name, role, status')
      .single();

    if (error) throw new ConflictException(error.message);

    // Create email verify token
    const token = uuidv4();
    await supabase.from('auth_tokens').insert({
      user_id: user.id,
      token,
      type: 'email_verify',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    // TODO: Send verification email with token

    return {
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      user: { id: user.id, email: user.email, full_name: user.full_name },
    };
  }

  // ──────────────── LOGIN ────────────────
  async login(dto: LoginDto, ip?: string) {
    const supabase = getSupabaseClient();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', dto.email)
      .single();

    if (error || !user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    const passwordOk = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordOk) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    if (user.status === 'pending_verify') {
      throw new UnauthorizedException('Vui lòng xác thực email trước khi đăng nhập');
    }
    if (user.status === 'suspended') {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = uuidv4();
    const refresh_hash = await bcrypt.hash(refresh_token, 10);

    await supabase.from('refresh_tokens').insert({
      user_id: user.id,
      token_hash: refresh_hash,
      ip_address: ip ?? null,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Update last login
    await supabase.from('users').update({ last_login_at: new Date().toISOString() }).eq('id', user.id);

    const { password_hash: _ph, ...safeUser } = user;
    return { access_token, refresh_token, user: safeUser };
  }

  // ──────────────── LOGOUT ────────────────
  async logout(userId: string) {
    const supabase = getSupabaseClient();
    await supabase
      .from('refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('revoked_at', null);
    return { message: 'Đăng xuất thành công' };
  }

  // ──────────────── VERIFY EMAIL ────────────────
  async verifyEmail(token: string) {
    const supabase = getSupabaseClient();

    const { data: authToken } = await supabase
      .from('auth_tokens')
      .select('*')
      .eq('token', token)
      .eq('type', 'email_verify')
      .is('used_at', null)
      .single();

    if (!authToken) throw new ValidationException('Token xác thực không hợp lệ hoặc đã hết hạn');
    if (new Date(authToken.expires_at) < new Date()) {
      throw new ValidationException('Token xác thực đã hết hạn');
    }

    await supabase
      .from('users')
      .update({ status: 'active', email_verified_at: new Date().toISOString() })
      .eq('id', authToken.user_id);

    await supabase
      .from('auth_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', authToken.id);

    return { message: 'Xác thực email thành công! Bạn có thể đăng nhập ngay.' };
  }

  // ──────────────── FORGOT PASSWORD ────────────────
  async forgotPassword(dto: ForgotPasswordDto) {
    const supabase = getSupabaseClient();

    const { data: user } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', dto.email)
      .maybeSingle();

    // Always return success to prevent email enumeration
    if (!user) return { message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.' };

    const token = uuidv4();
    await supabase.from('auth_tokens').insert({
      user_id: user.id,
      token,
      type: 'password_reset',
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
    });

    // TODO: Send password reset email

    return { message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.' };
  }

  // ──────────────── RESET PASSWORD ────────────────
  async resetPassword(dto: ResetPasswordDto) {
    if (dto.new_password !== dto.confirm_password) {
      throw new ValidationException('Mật khẩu xác nhận không khớp');
    }

    const supabase = getSupabaseClient();

    const { data: authToken } = await supabase
      .from('auth_tokens')
      .select('*')
      .eq('token', dto.token)
      .eq('type', 'password_reset')
      .is('used_at', null)
      .single();

    if (!authToken) throw new ValidationException('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
    if (new Date(authToken.expires_at) < new Date()) {
      throw new ValidationException('Token đặt lại mật khẩu đã hết hạn');
    }

    const password_hash = await bcrypt.hash(dto.new_password, 12);

    await supabase.from('users').update({ password_hash }).eq('id', authToken.user_id);
    await supabase
      .from('auth_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', authToken.id);

    // Revoke all refresh tokens
    await supabase
      .from('refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('user_id', authToken.user_id);

    return { message: 'Đặt lại mật khẩu thành công!' };
  }
}
