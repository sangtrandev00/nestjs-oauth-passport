import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard if you want to protect routes

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @UseGuards(AuthGuard('jwt')) // Protect this route with JWT guard
    @Post()
    async createPost(@Body() data: { title: string; content: string }, @Req() req) {
        return this.postService.createPost(data, req.user.id);
    }

    @UseGuards(AuthGuard('jwt')) // Protect this route with JWT guard
    @Get()
    async getPosts() {
        return this.postService.getPosts();
    }

    @UseGuards(AuthGuard('jwt')) // Protect this route with JWT guard
    @Get(':id')
    async getPostById(@Param('id') id: number) {
        return this.postService.getPostById(id);
    }

    @UseGuards(AuthGuard('jwt')) // Protect this route with JWT guard
    @Put(':id')
    async updatePost(@Param('id') id: number, @Body() data: { title?: string; content?: string }) {
        return this.postService.updatePost(id, data);
    }

    @UseGuards(AuthGuard('jwt')) // Protect this route with JWT guard
    @Delete(':id')
    async deletePost(@Param('id') id: number) {
        return this.postService.deletePost(id);
    }
}