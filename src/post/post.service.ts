import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma'; // Ensure you have PrismaService imported
import { Post } from '@prisma/client'; // Import Post type from Prisma

@Injectable()
export class PostService {
    constructor(private readonly prisma: PrismaService) { }

    async createPost(data: { title: string; content: string }, userId: number): Promise<Post> {
        return this.prisma.post.create({
            data: {
                ...data,
                user: {
                    connect: { id: userId }
                }
            },
        });
    }

    async getPosts(): Promise<Post[]> {
        return this.prisma.post.findMany();
    }

    async getPostById(id: number): Promise<Post | null> {
        return this.prisma.post.findUnique({
            where: { id },
        });
    }

    async updatePost(id: number, data: { title?: string; content?: string }): Promise<Post> {
        return this.prisma.post.update({
            where: { id },
            data,
        });
    }

    async deletePost(id: number): Promise<Post> {
        return this.prisma.post.delete({
            where: { id },
        });
    }
}