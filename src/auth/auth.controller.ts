// src/auth/auth.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
        // Initiates the Google OAuth2 login

        console.log("res", req);
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return req.user; // Return user info or redirect
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