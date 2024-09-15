// src/auth/auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { sign } from 'jsonwebtoken';
import { HttpService } from '@nestjs/axios'; // Add this import
import { lastValueFrom } from 'rxjs';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private httpService: HttpService) { }

    async validateUserById(userId: number) {
        const resUser = await this.prisma.user.findUnique({ where: { id: userId } });
        return resUser;
    }

    async validateUserByEmail(email: string) {
        const resUser = await this.prisma.user.findUnique({ where: { email } });
        return resUser;
    }

    async validateUser(profile: any): Promise<any> {

        const user = await this.prisma.user.findUnique({
            where: {
                email: profile.emails[0].value
            }
        });

        if (!user) {
            const newUser = await this.prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    name: profile.displayName
                }
            });
        }


        // Here you can implement your user validation logic
        return { id: profile.id, name: profile.displayName, email: profile.emails[0].value };
    }

    generateJwt(user: any) {
        return sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Set expiration time
        });
    }

    async getOauthGoogleToken(code: string) {
        const body = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
            grant_type: 'authorization_code',
        };

        const { data } = await axios.post(
            'https://oauth2.googleapis.com/token',
            body,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        return data;
    }

    async getGoogleUser(tokens: { id_token: string; access_token: string }) {
        const { data }: AxiosResponse<any> = await lastValueFrom(this.httpService.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            params: {
                access_token: tokens.access_token,
                alt: 'json',
            },
            headers: {
                Authorization: `Bearer ${tokens.id_token}`,
            },
        })
        );

        return data;
    }

    async handleGoogleAuth(code: string) {
        const data = await this.getOauthGoogleToken(code);
        const { id_token, access_token } = data;
        const googleUser = await this.getGoogleUser({ id_token, access_token });

        if (!googleUser.verified_email) {
            throw new HttpException('Google email not verified', HttpStatus.FORBIDDEN);
        }

        const manual_access_token = sign(
            { email: googleUser.email, type: 'access_token' },
            process.env.AC_PRIVATE_KEY,
            { expiresIn: '15m' },
        );

        const manual_refresh_token = sign(
            { email: googleUser.email, type: 'refresh_token' },
            process.env.RF_PRIVATE_KEY,
            { expiresIn: '100d' },
        );

        return { manual_access_token, manual_refresh_token };
    }

    generateTokens(googleUser: any) {
        const manual_access_token = sign(
            { email: googleUser.email, type: 'access_token' },
            process.env.AC_PRIVATE_KEY,
            { expiresIn: '15m' }
        );

        const manual_refresh_token = sign(
            { email: googleUser.email, type: 'refresh_token' },
            process.env.RF_PRIVATE_KEY,
            { expiresIn: '100d' }
        );

        return { manual_access_token, manual_refresh_token };
    }


    async refreshAccessToken(refreshToken: string) {
        const response = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data; // This will contain the new access token and possibly a new refresh token
    }

}