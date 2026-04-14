import {
    Controller, Post, Patch, Get, Body, Param, Req, Res, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, OnboardingDto } from './auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @Throttle({ default: { ttl: 300000, limit: 5 } })
    async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
        const { sessionCookie, user } = await this.authService.signup(dto);
        res.setHeader('Set-Cookie', sessionCookie.serialize());
        return user;
    }

    @Post('login')
    @Throttle({ default: { ttl: 60000, limit: 10 } })
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { sessionCookie, user } = await this.authService.login(dto);
        res.setHeader('Set-Cookie', sessionCookie.serialize());
        return user;
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        // Assume session id is attached to req by global middleware/guard
        if (req.sessionId) {
            const blankCookie = await this.authService.logout(req.sessionId);
            res.setHeader('Set-Cookie', blankCookie.serialize());
        }
        return { success: true };
    }

    @Patch('onboarding')
    onboarding(@Req() req: any, @Body() dto: OnboardingDto) {
        return this.authService.onboarding(req.user.id, dto);
    }

    @Get('check-username/:username')
    checkUsername(@Param('username') username: string) {
        return this.authService.checkUsername(username);
    }

    @Get('me')
    getMe(@Req() req: any) {
        return this.authService.getMe(req.user.id);
    }
}
