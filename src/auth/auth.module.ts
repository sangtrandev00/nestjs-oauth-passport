import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { GithubStrategy } from './strategy/github.strategy';

@Module({
  providers: [AuthService, GoogleStrategy, FacebookStrategy, GithubStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
