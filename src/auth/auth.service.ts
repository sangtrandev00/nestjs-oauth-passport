// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async validateUser(profile: any): Promise<any> {

        console.log("profile", profile);

        // Here you can implement your user validation logic
        return { id: profile.id, name: profile.displayName, email: profile.emails[0].value };
    }
}