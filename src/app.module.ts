import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot(), AuthModule, PostModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
