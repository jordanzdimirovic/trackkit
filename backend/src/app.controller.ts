import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express"

@Controller()
export class AppController {
    constructor() { }
    @Get()
    home(@Req() req): string {
        console.log(req.cookies);
        if (req.user)
            return `Home page! I (the server) recognise you as:\n\n${req.user}\n\nHave a good day!`
        else
            return `I don't know you! <a href='/auth/google/login'>Login please.</a>`
    }

    @UseGuards(AuthGuard("google"))
    @Get("private")
    priv(@Req() req: Request): string {
        console.log(req.cookies);
        if (req.user)
            return `Home page! I (the server) recognise you as:\n\n${req.user}\n\nHave a good day!`
        else
            return `I don't know you! <a href='/auth/google/login'>Login please.</a>`
    }
}
