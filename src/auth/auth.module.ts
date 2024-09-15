import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { GithubStrategy } from './strategy/github.strategy';
import { PrismaModule } from 'nestjs-prisma';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' }, // Token expiration time
        }),
        PrismaModule,
        HttpModule,
        ConfigModule
    ],
    providers: [AuthService, GoogleStrategy, FacebookStrategy, GithubStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule { }
