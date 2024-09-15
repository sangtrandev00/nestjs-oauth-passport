// src/auth/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:4000/auth/google/callback',
            scope: ['email', 'profile'],
            accessType: 'offline',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {

        console.log("accessToken", accessToken);
        console.log("refresh", refreshToken);

        if (!profile) {
            console.error('Profile is undefined or null');
            throw new Error('Profile validation failed');
        }

        const user = await this.authService.validateUser(profile);
        return user;
    }
}