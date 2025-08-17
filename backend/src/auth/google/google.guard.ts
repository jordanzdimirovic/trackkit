import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
    constructor() {
        super({
            accessType: 'offline',
        });
    }

    // TODO: find a way to change 500s TokenError into a 400 or 403
    // handleRequest<TUser = any>(err: Error, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    //     if (err) {
    //         if (err.name.startsWith("Token")) throw new BadRequestException("Invalid Google OAuth Flow")
    //     }
    //     return user;
    // }
}