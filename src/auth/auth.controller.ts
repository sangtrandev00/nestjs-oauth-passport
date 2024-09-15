// src/auth/auth.controller.ts
import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private readonly configService: ConfigService) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
        // Initiates the Google OAuth2 login
        // The AuthGuard will handle the redirection
        console.log("res", req);
    }
    // TODO: Add a decorator to check if the user is already logged in
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res, @Query('code') code: string) {
        // Handle the callback from Google
        const user = req.user; // Get user info
        const jwt = this.authService.generateJwt(user); // Generate JWT

        const expires = new Date();
        const jwtExpire = this.configService.get('JWT_EXPIRATION');
        expires.setSeconds(
            expires.getSeconds() + jwtExpire,
        );

        // Store JWT in a cookie or local storage
        res.cookie('jwt', jwt, { httpOnly: true, expires }); // Example of setting a cookie
        res.redirect('http://localhost:4200'); // Redirect to your frontend

        // Here you can redirect to your frontend or send a response
        // Optionally, you can also send user info or a token
    }

    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuth(@Req() req) {
        // Initiates the Facebook OAuth2 login
    }

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    facebookAuthRedirect(@Req() req) {
        return req.user; // Return user info or redirect
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    async githubAuth(@Req() req) {
        // Initiates the GitHub OAuth2 login
    }

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    githubAuthRedirect(@Req() req) {
        return req.user; // Return user info or redirect
    }
}