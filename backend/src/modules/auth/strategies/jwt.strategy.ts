import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { getSupabaseClient } from '../../../config/supabase.config';
import { UnauthorizedException } from '../../../common/exceptions/app.exception';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string;  // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Extract JWT from Authorization header first, then fall back to cookie.
 * This supports both regular login (token in header) and Google OAuth (token in cookie).
 */
function extractJwtFromHeaderOrCookie(req: Request): string | null {
  // 1. Try Authorization header first
  const fromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (fromHeader) return fromHeader;

  // 2. Fall back to cookie
  if (req.cookies && req.cookies.access_token) {
    return req.cookies.access_token;
  }

  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: extractJwtFromHeaderOrCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    const supabase = getSupabaseClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, status, full_name')
      .eq('id', payload.sub)
      .single();

    if (error || !user) throw new UnauthorizedException('Token không hợp lệ');
    if (user.status === 'suspended') throw new UnauthorizedException('Tài khoản đã bị khóa');

    return user;
  }
}
