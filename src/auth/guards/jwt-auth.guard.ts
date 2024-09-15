import {
    CanActivate,
    ExecutionContext, Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const authentication = this.getAuthentication(context);

        // Step 5 -> Step 6 ở đây (trả về thông tin của user ở đây!)
        return true
    }

    private getAuthentication(context: ExecutionContext) {
        let authentication: string;
        if (context.getType() === 'rpc') {
            authentication = context.switchToRpc().getData().Authentication;
        } else if (context.getType() === 'http') {
            authentication = context.switchToHttp().getRequest()
                .cookies?.Authentication;
        }
        if (!authentication) {
            throw new UnauthorizedException(
                'No value was provided for Authentication',
            );
        }
        return authentication;
    }

    private addUser(user: any, context: ExecutionContext) {
        if (context.getType() === 'rpc') {
            context.switchToRpc().getData().user = user;
        } else if (context.getType() === 'http') {
            context.switchToHttp().getRequest().user = user;
        }
    }
}
