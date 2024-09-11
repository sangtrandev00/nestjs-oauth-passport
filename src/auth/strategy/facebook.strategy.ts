// src/auth/facebook.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: 'http://localhost:4000/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'photos', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        const user = await this.authService.validateUser(profile);
        return user;
    }
}