import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DevOnlyGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        return (process.env.NODE_ENV != "production")
    }
}
