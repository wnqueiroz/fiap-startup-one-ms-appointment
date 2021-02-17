import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from './jwt.strategy';

import { AuthService } from './auth.service';

const modules = [
  PassportModule,
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const { jwt } = configService.get('app');

      return {
        privateKey: jwt.privateKey,
        signOptions: {
          expiresIn: jwt.expiresIn,
          algorithm: 'RS256',
        },
      };
    },
  }),
];

const providers = [AuthService, JwtStrategy];

@Global()
@Module({
  imports: [...modules],
  exports: [...modules, AuthService],
  providers,
})
export class AuthModule {}
