import {
    Controller, Post, Patch, Get, Body, Param,
    UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, OnboardingDto } from './auth.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * POST /api/auth/signup
     * Rate-limited: 5 per 5 minutes
     */
    @Post('signup')
    @Throttle({ default: { ttl: 300000, limit: 5 } })
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    /**
     * POST /api/auth/login
     * Rate-limited: 10 per minute (brute-force protection)
     */
    @Post('login')
    @Throttle({ default: { ttl: 60000, limit: 10 } })
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    /**
     * PATCH /api/auth/onboarding
     * Requires auth — sets username, DOB, gender, county → profileComplete=true
     */
    @Patch('onboarding')
    @UseGuards(JwtAuthGuard)
    onboarding(@Req() req: any, @Body() dto: OnboardingDto) {
        return this.authService.onboarding(req.user.id, dto);
    }

    /**
     * GET /api/auth/check-username/:username
     * Public — check availability before submitting onboarding form
     */
    @Get('check-username/:username')
    checkUsername(@Param('username') username: string) {
        return this.authService.checkUsername(username);
    }

    /**
     * GET /api/auth/me
     * Returns the authenticated user's profile
     */
    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() req: any) {
        return this.authService.getMe(req.user.id);
    }
}
