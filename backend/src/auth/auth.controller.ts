import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session/session.service';
import { User } from '@prisma/client';
import { DevOnlyGuard } from 'src/generic/dev-only/dev-only.guard';
import { Request } from 'express';
import { SessionGuard } from './session/session.guard';
import { SessionUserPayload } from './session/session-user-payload';
import { pick } from 'lodash';

@Controller()
@UseGuards(SessionGuard)
export class AuthController {
    constructor(private sessionService: SessionService<User>){}

    @Get("me")
    getMe (@Req() req: Request): SessionUserPayload {
        return pick(
            req.user as User,
            'email',
            'id',
            'name',
            'profilePicUrl',
            'provider'
        )
    }
}
