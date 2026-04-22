import {
    Controller, Patch, Post, Get, Body, Param, Req, UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OnboardingDto, SoftAuthGuard } from './better-auth';
import type { Request } from 'express';

// NOTE: signup, login, logout, and session management are all handled
// automatically by Better Auth via the BetterAuthMiddleware.
// Routes: POST /api/auth/sign-up/email, POST /api/auth/sign-in/email,
//         POST /api/auth/sign-out, GET /api/auth/get-session, etc.
//
// This controller only handles custom Kihumba-specific routes.

@Controller('account')
export class AccountController {
    constructor(private readonly authService: AuthService) { }
    
    @Post('forgot-password')
    async forgotPassword(@Body('identifier') identifier: string, @Body('mode') mode: 'magic' | 'reset') {
        console.log(`[AUTH] Recovery request for: ${identifier} (mode: ${mode})`);
        return this.authService.forgotPassword(identifier, mode);
    }

    @Patch('onboarding')
    async onboarding(@Req() req: Request, @Body() dto: OnboardingDto) {
        const user = await this.authService.getCurrentUser(req);
        // Ensure IP is captured even if frontend doesn't send it
        const onboardingData = {
            ...dto,
            registrationIp: dto.registrationIp || req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress,
        };
        return this.authService.onboarding(user.id, onboardingData);
    }

    @Get('check-username/:username')
    @UseGuards(SoftAuthGuard)
    checkUsername(@Param('username') username: string, @Req() req: any) {
        return this.authService.checkUsername(username, req.user?.id);
    }

    @Get('status')
    async getStatus(@Req() req: Request) {
        const userSession = await this.authService.getCurrentUser(req);
        const user = await this.authService.getMe(userSession.id);
        return { 
            profileComplete: user.profileComplete,
            username: user.username 
        };
    }

    @Get('me')
    async getMe(@Req() req: Request) {
        const user = await this.authService.getCurrentUser(req);
        return this.authService.getMe(user.id);
    }
}
