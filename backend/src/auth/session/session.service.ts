import { CACHE_MANAGER, CacheManagerOptions } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache, CacheManagerStore } from 'cache-manager';
import base64url from 'base64url';
import * as crypto from "crypto"

@Injectable()
export class SessionService<T> {
    constructor (@Inject(CACHE_MANAGER) private cache: Cache) {}
    async establish(value: T, expirySeconds: number = undefined): Promise<string> {
        // Generate a session token
        // Probability of collision 1 / 2 ** (8*64) so stop complaining
        const sessionToken: string = base64url(crypto.randomBytes(64)); // Generates unicode bytes '0' through 'z'

        // Store in the (abstracted) in-memory store
        await this.cache.set(
            sessionToken,
            value,
            expirySeconds * (10**3)
        );

        // If we wish to ensure resiliency, could write to the DB here too
        return sessionToken;
    }

    async validate(token: string): Promise<[boolean, T?]> {
        // Obtain from the store
        const res = await this.cache.get<T>(token);
        
        return [
            Boolean(res),
            res
        ]
    }

    async retire(token: string): Promise<void> {
        await this.cache.del(token);
    }
}
