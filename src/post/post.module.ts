import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from 'nestjs-prisma';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PrismaModule,
    HttpModule
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule { }
