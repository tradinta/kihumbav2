import { Module } from '@nestjs/common';
import { AccountController } from './auth.controller';
import { BetterAuthController } from './better-auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './better-auth';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AccountController, BetterAuthController],
    providers: [AuthService, AuthGuard],
    exports: [AuthService, AuthGuard],
})
export class AuthModule {}
