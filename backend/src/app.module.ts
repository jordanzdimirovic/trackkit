import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from './prisma/prisma.module';
import { SessionGuard } from './auth/session/session.guard';
import { GenericModule } from './generic/generic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables available everywhere
    }),
    AuthModule,
    RouterModule.register([
      {
        path: "auth",
        module: AuthModule
      }
    ]),
    PrismaModule,
    GenericModule
  ],
  controllers: [AppController],
  providers: [PrismaClient],
})
export class AppModule {}
