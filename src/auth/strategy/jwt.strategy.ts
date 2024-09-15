import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
interface JwtPayload {
    email: string; // or any other properties you want to include
    sub: number; // Typically the user ID
    id: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors(
                [(request: any) => {
                    // Convert cookie here!

                    return request.cookies?.jwt;
                }]
            ), // Extract JWT from Bearer token
            secretOrKey: process.env.JWT_SECRET, // Your JWT secret
        });
    }

    async validate(payload: JwtPayload) {
        // Validate the user based on the payload
        const user = await this.authService.validateUserByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user; // Return the user object
    }
}