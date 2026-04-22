import {
    Injectable, UnauthorizedException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { auth, OnboardingDto } from './better-auth';
import type { Request } from 'express';

const RESERVED_USERNAMES = [
    'admin', 'kihumba', 'settings', 'profile', 'auth', 'api', 'null', 'undefined',
    'root', 'support', 'help', 'jobs', 'blog', 'status', 'dev', 'developer',
];

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
    ) { }

    // ─── Get Current User from Better Auth Session ──────────────────────────

    async getCurrentUser(req: Request) {
        const session = await auth.api.getSession({
            headers: req.headers as any,
        });
        if (!session?.user) throw new UnauthorizedException('Not authenticated');
        return session.user;
    }

    // ─── Onboarding ────────────────────────────────────────────────────────

    async onboarding(userId: string, dto: OnboardingDto) {
        // Validation check (double safety)
        const check = await this.checkUsername(dto.username, userId);
        if (!check.available) throw new ConflictException(check.message || 'Username not available');

        // Age check — must be at least 13
        const dob = new Date(dto.dateOfBirth);
        const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 13) throw new BadRequestException('You must be at least 13 years old');

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                username: dto.username,
                fullName: dto.fullName || null,
                dateOfBirth: dob,
                gender: dto.gender as any,
                country: dto.country,
                county: dto.county,
                town: dto.town,
                website: dto.website,
                avatar: dto.avatar,
                bio: dto.bio || null,
                coverPhoto: dto.coverPhoto,
                interests: dto.interests,
                profileComplete: true,
                registrationIp: dto.registrationIp,
                registrationDevice: dto.registrationDevice,
            },
        });

        return this.sanitizeUser(user);
    }

    // ─── Check Username ────────────────────────────────────────────────────

    async checkUsername(username: string, userId?: string) {
        const normalized = username.toLowerCase().trim();

        if (normalized.length < 5 || normalized.length > 12) {
            return { available: false, message: 'Username must be 5-12 characters' };
        }

        if (!/^[a-z0-9_]+$/.test(normalized)) {
            return { available: false, message: 'Username may only contain letters, numbers, and underscores' };
        }

        if (RESERVED_USERNAMES.includes(normalized)) {
            return { available: false, message: 'This username is reserved' };
        }

        const user = await this.prisma.user.findUnique({ where: { username: normalized } });
        if (user && user.id !== userId) {
            return { available: false, message: 'Username is already taken' };
        }

        return { 
            available: true, 
            message: 'Username is available. Note: some usernames may be reserved or reclaimed.' 
        };
    }

    // ─── Forgot Password / Identity Recovery ───────────────────────────────
    async forgotPassword(identifier: string, mode: 'magic' | 'reset' = 'reset') {
        const normalized = identifier.toLowerCase().trim();

        // Find user by email or username
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: normalized },
                    { username: normalized }
                ]
            }
        });

        if (!user) {
            throw new BadRequestException("We couldn't find an account with that identifier.");
        }

        if (mode === 'magic') {
            // Trigger Magic Link flow
            await (auth.api as any).signInMagicLink({
                body: {
                    email: user.email,
                    callbackURL: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?magic_login=true`,
                },
                headers: new Headers(),
            });
        } else {
            // Trigger Reset Password flow
            await (auth.api as any).forgetPassword({
                body: {
                    email: user.email,
                    redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`,
                },
                headers: new Headers(),
            });
        }

        // Mask email: racerdustin744@gmail.com -> r***n744@gmail.com
        const [local, domain] = user.email.split('@');
        const maskedLocal = local.length > 4
            ? local.substring(0, 1) + '***' + local.substring(local.length - 1)
            : local + '***';
        
        return {
            success: true,
            email: `${maskedLocal}@${domain}`,
            message: `Instructions dispatched to ${maskedLocal}@${domain}`
        };
    }

    // ─── Me ────────────────────────────────────────────────────────────────

    async getMe(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: { select: { posts: true, followers: true, following: true } },
            },
        });
        if (!user) throw new UnauthorizedException('User not found');
        return this.sanitizeUser(user);
    }

    // ─── Helpers ───────────────────────────────────────────────────────────

    private sanitizeUser(user: any) {
        const { passwordHash, ...safe } = user;
        return safe;
    }
}
