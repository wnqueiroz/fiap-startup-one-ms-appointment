import { Injectable } from '@nestjs/common';

import { JwtPayloadDTO } from './dto/jwt-payload.dto';
import { CurrentUserDTO } from './dto/current-user.dto';

@Injectable()
export class AuthService {
  async validate(payload: JwtPayloadDTO): Promise<CurrentUserDTO> {
    return { name: payload.name, email: payload.email, id: payload.sub };
  }
}
