import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { Profile } from "passport";
import { GOOGLE_RESPONSE_ENDPOINT } from "src/config";
import { ConfigService } from "@nestjs/config";
import { $Enums, AuthProvider, Prisma, PrismaClient, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            clientID: config.get<string>("GOOGLE_CLIENT_ID"),
            clientSecret: config.get<string>("GOOGLE_CLIENT_SECRET"),
            callbackURL: config.get<string>("BASE_URL") + GOOGLE_RESPONSE_ENDPOINT,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, cbVerify: VerifyCallback) {
        // DB auth logic
        var user: User = null;

        user = await this.prisma.user.findFirst({
            where: {
                providerId: profile.id
            }
        });

        user = await this.prisma.user.upsert(
            {
                where: {
                    provider_providerId: {
                        providerId: profile.id,
                        provider: AuthProvider.GOOGLE
                    }
                },

                create: {
                    email: profile.emails[0].value,
                    name: `${profile.name.givenName} ${profile.name.familyName}`,
                    provider: AuthProvider.GOOGLE,
                    providerId: profile.id,
                    profilePicUrl: profile.photos[0].value
                },

                update: {
                    name: `${profile.name.givenName} ${profile.name.familyName}`,
                    profilePicUrl: profile.photos[0].value
                }
            }
        )

        cbVerify(null, user);

    }
}