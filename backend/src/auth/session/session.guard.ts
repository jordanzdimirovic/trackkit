import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';
import { User } from '@prisma/client';

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(private sessionService: SessionService<User>) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Extract
        let req: Request = context.switchToHttp().getRequest<Request>();
        const sessionToken: string = req.cookies['session'] as string;

        // Check against the session service
        let [valid, user] = await this.sessionService.validate(sessionToken);
        
        if (!valid) {
            throw new UnauthorizedException("Session invalid or expired")
        }

        // Contextualise this request downstream
        req['user'] = user;

        return true;
    }

    
}