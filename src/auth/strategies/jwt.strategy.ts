import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { settings } from '../../settings';
import { CheckService } from '../../other.services/check.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService,
    private readonly checkService: CheckService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: settings.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    const userId = payload.userId;
    const isDeviceOk = await this.checkService.isDeviceExistByUserIdAndDeviceId(payload.userId, payload.deviceId)
    if(!isDeviceOk){
      return null
    }
    if (userId) {
      return { userId };
    } else {
      return null;
    }
  }
}
