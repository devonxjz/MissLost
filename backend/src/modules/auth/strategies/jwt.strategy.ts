import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { getSupabaseClient } from '../../../config/supabase.config';
import { UnauthorizedException } from '../../../common/exceptions/app.exception';

export interface JwtPayload {
  sub: string;  // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
