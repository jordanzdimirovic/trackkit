import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthController } from './google/google-auth.controller';
import { GoogleStrategy } from './google/google.strat';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SessionGuard } from './session/session.guard';
import { SessionService } from './session/session.service';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthController } from './auth.controller';
@Module({
  imports: [
    PassportModule.register({defaultStrategy: "google"}),
    CacheModule.register()
  ],
  exports: [
    SessionGuard
  ],
  providers: [
    SessionGuard,
    AuthService,
    SessionService,
    GoogleStrategy,
    {
      provide: JwtService,
      useFactory: (config: ConfigService) => {
        return new JwtService({
          secret: config.get<string>("JWT_SECRET")
        });
      },
      inject: [ConfigService]
    },
    SessionService
  ],
  controllers: [GoogleAuthController, AuthController]
})
export class AuthModule {}