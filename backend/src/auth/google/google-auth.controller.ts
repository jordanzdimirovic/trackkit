import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleOAuthGuard } from './google.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SessionService } from '../session/session.service';
import { User } from '@prisma/client';

@Controller('google')
export class GoogleAuthController {
    private readonly sessionExpirySeconds: number;
    constructor(private sessionService: SessionService<User>, private config: ConfigService){
        this.sessionExpirySeconds = config.get<number>("AUTH_GOOGLE_SESSION_EXPIRY");
    }
    @Get("login")
    @UseGuards(AuthGuard("google"))
    googleLogin(): void { } // Empty as the guard handles the flow

    @Get("response")
    @UseGuards(AuthGuard("google"))
    async googleResponse(@Req() req: Request & {user: User}, @Res({passthrough: true}) res: Response): Promise<void> {
        // req.user will be populated
        // Generate and provide JWT as a cookie

        // 1. create it
        let sessionToken: string = await this.sessionService.establish(req.user, this.sessionExpirySeconds);

        // 2. add cookie
        res.cookie(
            "session", sessionToken, {
                httpOnly: (process.env.NODE_ENV == "production")
            }
        );

        // 3. redirect to home page
        res.redirect(this.config.get<string>("BASE_URL"));
    }
}
