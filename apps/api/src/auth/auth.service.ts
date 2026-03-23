import {
    Injectable, UnauthorizedException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto, OnboardingDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // ─── Signup ────────────────────────────────────────────────────────────────

    async signup(dto: SignupDto) {
        // Check if email is taken
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email is already registered');

        const passwordHash = await bcrypt.hash(dto.password, 12);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                phoneNumber: dto.phoneNumber || null,
            },
        });

        const token = this.signToken(user.id, user.email, user.username);

        return {
            access_token: token,
            user: this.sanitizeUser(user),
        };
    }

    // ─── Login ─────────────────────────────────────────────────────────────────

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        if (user.isBanned) throw new UnauthorizedException('Account has been suspended');

        // Update last active
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastActiveAt: new Date() },
        });

        const token = this.signToken(user.id, user.email, user.username);
        return {
            access_token: token,
            user: this.sanitizeUser(user),
        };
    }

    // ─── Onboarding ────────────────────────────────────────────────────────────

    async onboarding(userId: string, dto: OnboardingDto) {
        // Check username availability
        const taken = await this.prisma.user.findFirst({
            where: { username: dto.username, id: { not: userId } },
        });
        if (taken) throw new ConflictException('Username is already taken');

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
                county: dto.county,
                profileComplete: true,
            },
        });

        return this.sanitizeUser(user);
    }

    // ─── Check Username ────────────────────────────────────────────────────────

    async checkUsername(username: string) {
        const user = await this.prisma.user.findUnique({ where: { username } });
        return { available: !user };
    }

    // ─── Me ────────────────────────────────────────────────────────────────────

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

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private signToken(id: string, email: string | null, username: string | null) {
        return this.jwtService.sign({
            sub: id,
            email,
            username,
        });
    }

    private sanitizeUser(user: any) {
        const { passwordHash, ...safe } = user;
        return safe;
    }
}
