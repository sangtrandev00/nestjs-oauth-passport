// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService) { }

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
}