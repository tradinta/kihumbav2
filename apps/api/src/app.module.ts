import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

@Module({
    imports: [
        // Rate limiting: 100 requests per minute per IP
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 100,
        }]),

        // Global JWT config
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'kihumba-dev-secret',
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
        }),

        PrismaModule,
        AuthModule,
        UserModule,
        PostModule,
    ],
})
export class AppModule { }
