// Kihumba — Better Auth central configuration
// This is the single source of truth for all auth behavior.

import * as path from 'path';
import * as dotenv from 'dotenv';

function loadEnv() {
    dotenv.config({ path: path.join(__dirname, '../../.env') });
    dotenv.config({ path: path.join(__dirname, '../../../../.env') });
}

function getCleanEnv(key: string): string {
    const val = process.env[key] || '';
    return val.trim().replace(/^["']|["']$/g, '').trim();
}

loadEnv();

import { 
    CanActivate, ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';
import {
    IsString, IsOptional, IsDateString, IsEnum, Length, Matches,
} from 'class-validator';
import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { phoneNumber, magicLink, twoFactor } from 'better-auth/plugins';
// import { passkey } from '@better-auth/passkey';
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = getCleanEnv('DATABASE_URL');

const prisma = new PrismaClient();

async function sendZeptoEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    const region = getCleanEnv('ZEPTOMAIL_REGION') || 'com'; // e.g., 'com', 'eu', 'in'
    const url = `https://api.zeptomail.${region}/v1.1/email`;
    const apiKey = getCleanEnv('ZEPTOMAIL_API_KEY');
    const fromDomain = getCleanEnv('ZEPTOMAIL_FROM_DOMAIN') || 'kindredcareus.com';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': apiKey!,
            },
            body: JSON.stringify({
                from: {
                    address: `auth@${fromDomain}`,
                    name: 'Kihumba Identity',
                },
                to: [
                    {
                        email_address: {
                            address: to,
                        },
                    },
                ],
                subject: subject,
                htmlbody: html,
            }),
        });

        const result = await response.json();
        if (!response.ok) {
            console.error('❌ ZeptoMail delivery failed:', {
                status: response.status,
                statusText: response.statusText,
                error: result
            });
            throw new Error(`ZeptoMail Error: ${JSON.stringify(result)}`);
        } else {
            console.log(`✅ Identity email dispatched successfully to ${to}`);
        }
    } catch (error: any) {
        console.error('📧 [CRITICAL] Email Engine Failure:', error.message);
        throw error;
    }
}

const authOptions = {
    database: prismaAdapter(prisma, {
        provider: 'postgresql' as const,
    }),
    user: {
        additionalFields: {
            username: { type: 'string' as const },
            profileComplete: { type: 'boolean' as const },
            bio: { type: 'string' as const },
            avatar: { type: 'string' as const },
            isBanned: { type: 'boolean' as const },
            subscriptionTier: { type: 'string' as const },
            subscriptionExpiresAt: { type: 'date' as const },
        },
        changeEmail: {
            enabled: true,
            sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
                const kihumbaTemplate = `
                    <div style="font-family: Inter, sans-serif; background: #000; color: #fff; padding: 60px 40px; border-radius: 16px; border: 1px solid #c5a059; max-width: 500px; margin: 0 auto; text-align: center;">
                        <h1 style="color: #c5a059; font-weight: 900; letter-spacing: 4px; margin-bottom: 30px; text-transform: uppercase;">IDENTITY MIGRATION</h1>
                        <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 30px;">You are requesting to change your Kihumba email to <b>${newEmail}</b>. Click below to verify this change.</p>
                        <a href="${url}" style="display: inline-block; background: #c5a059; color: #000; padding: 16px 32px; border-radius: 4px; text-decoration: none; font-weight: 900; letter-spacing: 2px; font-size: 12px;">
                            CONFIRM NEW EMAIL
                        </a>
                        <p style="font-size: 11px; color: #52525b; margin-top: 50px; font-weight: 700; letter-spacing: 1px;">SECURITY SYSTEM</p>
                    </div>
                `;
                await sendZeptoEmail({ 
                    to: newEmail, 
                    subject: 'Confirm Your New Kihumba Email', 
                    html: kihumbaTemplate 
                });
            }
        }
    },
    emailVerification: {
        sendOnSignUp: false,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            const kihumbaTemplate = `
                <div style="font-family: Inter, sans-serif; background: #000; color: #fff; padding: 60px 40px; border-radius: 16px; border: 1px solid #c5a059; max-width: 500px; margin: 0 auto; text-align: center;">
                    <h1 style="color: #c5a059; font-weight: 900; letter-spacing: 4px; margin-bottom: 30px; text-transform: uppercase;">VERIFY IDENTITY</h1>
                    <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 30px;">Welcome to Kihumba. Click the button below to verify your email address and activate your account.</p>
                    <a href="${url}" style="display: inline-block; background: #c5a059; color: #000; padding: 16px 32px; border-radius: 4px; text-decoration: none; font-weight: 900; letter-spacing: 2px; font-size: 12px;">
                        VERIFY EMAIL
                    </a>
                    <p style="font-size: 11px; color: #52525b; margin-top: 50px; font-weight: 700; letter-spacing: 1px;">SECURITY SYSTEM</p>
                </div>
            `;
            await sendZeptoEmail({ 
                to: user.email, 
                subject: 'Verify Your Kihumba Identity', 
                html: kihumbaTemplate 
            });
        }
    },
    appName: 'Kihumba',
    basePath: '/auth',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
    secret: process.env.BETTER_AUTH_SECRET || 'kihumba-dev-secret-change-before-deploy-32chars!!',

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        sendResetPassword: async ({ user, url }) => {
            const kihumbaTemplate = `
                <div style="font-family: Inter, sans-serif; background: #000; color: #fff; padding: 60px 40px; border-radius: 16px; border: 1px solid #c5a059; max-width: 500px; margin: 0 auto; text-align: center;">
                    <h1 style="color: #c5a059; font-weight: 900; letter-spacing: 4px; margin-bottom: 30px; text-transform: uppercase;">KIHUMBA</h1>
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, #c5a059, transparent); margin-bottom: 30px;"></div>
                    <p style="font-size: 16px; color: #a1a1aa; line-height: 1.6; margin-bottom: 40px;">We'll help you get back to your account right away. Click the button below to reclaim your digital sovereignty.</p>
                    <a href="${url}" style="display: inline-block; background: #c5a059; color: #000; padding: 16px 32px; border-radius: 4px; text-decoration: none; font-weight: 900; letter-spacing: 2px; font-size: 12px; box-shadow: 0 10px 30px rgba(197,160,89,0.2);">
                        RESET PASSWORD
                    </a>
                    <p style="font-size: 11px; color: #52525b; margin-top: 50px; font-weight: 700; letter-spacing: 1px;">THE FUTURE OF KENYAN SOCIAL INFRASTRUCTURE</p>
                </div>
            `;
            await sendZeptoEmail({ to: user.email, subject: 'Reclaim Your Identity', html: kihumbaTemplate });
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24,       // refresh session every 24h
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes
        },
    },

    plugins: [
        phoneNumber({
            sendOTP: ({ phoneNumber: phone, code }) => {
                console.log(`\n🔐 [DEV OTP] Phone: ${phone} → Code: ${code}\n`);
            },
            signUpOnVerification: {
                getTempEmail: (phone) => `${phone.replace(/\+/g, '')}@kihumba.app`,
                getTempName: (phone) => phone,
            },
        }),
        magicLink({
            sendMagicLink: async ({ email, url }) => {
                const kihumbaTemplate = `
                    <div style="font-family: Inter, sans-serif; background: #000; color: #fff; padding: 60px 40px; border-radius: 16px; border: 1px solid #c5a059; max-width: 500px; margin: 0 auto; text-align: center;">
                        <h1 style="color: #c5a059; font-weight: 900; letter-spacing: 4px; margin-bottom: 30px; text-transform: uppercase;">KIHUMBA</h1>
                        <div style="height: 1px; background: linear-gradient(90deg, transparent, #c5a059, transparent); margin-bottom: 30px;"></div>
                        <p style="font-size: 16px; color: #a1a1aa; line-height: 1.6; margin-bottom: 40px;">Your portal to Kihumba is ready. Click the button below to log in instantly.</p>
                        <a href="${url}" style="display: inline-block; background: #c5a059; color: #000; padding: 16px 32px; border-radius: 4px; text-decoration: none; font-weight: 900; letter-spacing: 2px; font-size: 12px; box-shadow: 0 10px 30px rgba(197,160,89,0.2);">
                            MAGIC LOGIN
                        </a>
                        <p style="font-size: 11px; color: #52525b; margin-top: 50px; font-weight: 700; letter-spacing: 1px;">THE FUTURE OF KENYAN SOCIAL INFRASTRUCTURE</p>
                    </div>
                `;
                await sendZeptoEmail({ to: email, subject: 'Kihumba Access Link', html: kihumbaTemplate });
            },
        }),
        twoFactor({
            allowPasswordless: true,
            otpOptions: {
                sendOTP: async ({ user, otp }) => {
                    // Default to Email MFA delivery
                    const template = `
                            <div style="font-family: Inter, sans-serif; background: #000; color: #fff; padding: 60px 40px; border-radius: 16px; border: 1px solid #c5a059; max-width: 500px; margin: 0 auto; text-align: center;">
                                <h1 style="color: #c5a059; font-weight: 900; letter-spacing: 4px; margin-bottom: 30px; text-transform: uppercase;">KIHUMBA SECURITY</h1>
                                <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 30px;">Your multi-factor authentication code is below. Do not share this with anyone.</p>
                                <div style="background: #111; border: 1px solid #c5a059; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #fff; display: inline-block;">
                                    ${otp}
                                </div>
                                <p style="font-size: 11px; color: #52525b; margin-top: 50px; font-weight: 700; letter-spacing: 1px;">SECURITY SYSTEM</p>
                            </div>
                        `;
                        await sendZeptoEmail({ 
                            to: user.email, 
                            subject: 'Your Kihumba MFA Code', 
                            html: template 
                        });
                    // SMS logic would go here if a provider like Twilio was configured
                }
            }
        }),
        // passkey(),
    ],

    databaseHooks: {
        user: {
            update: {
                before: async (data, ctx) => {
                    // Prevention: Ensure the target email isn't already claimed by another entity
                    if (data && data.email && ctx?.context?.session?.user) {
                        const currentUserEmail = ctx.context.session.user.email;

                        if (data.email !== currentUserEmail) {
                            const existingUser = await prisma.user.findUnique({
                                where: { email: data.email }
                            });
                            if (existingUser) {
                                throw new Error("IDENTITY_COLLISION: Target email is already registered to another account.");
                            }
                        }
                    }
                    return { data };
                },
                after: async (data, ctx) => {
                    // Audit: Maintain a historical trail of identity migrations
                    if (data && data.email && ctx?.context?.session?.user) {
                         try {
                            await prisma.securityAuditLog.create({
                                data: {
                                    userId: ctx.context.session.user.id,
                                    event: "EMAIL_CHANGE",
                                    newValue: data.email,
                                    ipAddress: ctx.headers?.get("x-forwarded-for") || null,
                                    userAgent: ctx.headers?.get("user-agent") || null,
                                }
                            });
                         } catch (e) {
                            console.error("Audit Log Failure:", e);
                         }
                    }
                }
            }
        }
    },

    trustedOrigins: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3005',
        'http://localhost:3006',
        'http://localhost:3007',
    ],

    advanced: {
        crossSubDomainCookies: {
            enabled: true,
            domain: process.env.COOKIE_DOMAIN || undefined,
        },
        defaultCookieAttributes: {
            sameSite: "lax" as const,
            secure: process.env.NODE_ENV === 'production',
        }
    },
    // Fix: Properly typed logger or simple level string
    logger: {
        level: "debug" as const,
    },
};

export const auth = betterAuth(authOptions) as any;

import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// ─── Consolidated Utilities ──────────────────────────────────────────────────

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const req = context.switchToHttp().getRequest<any>();
        
        try {
            const session = await auth.api.getSession({
                headers: req.headers as any,
            });

            if (!session?.user) {
                throw new UnauthorizedException('Not authenticated');
            }

            req.user = session.user;
            req.session = session.session;
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}

/**
 * SoftAuthGuard - Allows anonymous access but populates req.user if session exists.
 * Crucial for personalized content views (e.g. knowing if you liked a post).
 */
@Injectable()
export class SoftAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<any>();
        try {
            const session = await auth.api.getSession({
                headers: req.headers as any,
            });
            if (session?.user) {
                req.user = session.user;
                req.session = session.session;
            }
        } catch (e) {
            // Silently allow access for soft auth
        }
        return true;
    }
}

enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHERS = 'OTHERS',
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export class OnboardingDto {
    @IsString()
    @Length(5, 12, { message: 'Username must be 5–12 characters' })
    @Matches(/^[a-z0-9_]+$/, { message: 'Username may only contain letters, numbers, and underscores' })
    username: string;

    @IsOptional() @IsString() fullName?: string;
    @IsDateString() dateOfBirth: string;
    @IsEnum(GenderEnum) gender: GenderEnum;
    @IsString() country: string;
    @IsOptional() @IsString() county?: string;
    @IsOptional() @IsString() countyId?: string;
    @IsOptional() @IsString() subCounty?: string;
    @IsOptional() @IsString() institution?: string;
    @IsOptional() @IsString() accountType?: string;
    @IsOptional() @IsString() town?: string;
    @IsOptional() @IsString() website?: string;
    @IsOptional() @IsString() avatar?: string;
    @IsOptional() @IsString() coverPhoto?: string;
    @IsOptional() @IsString() bio?: string;
    @IsOptional() @IsString({ each: true }) interests?: string[];
    @IsOptional() @IsString() registrationIp?: string;
    @IsOptional() @IsString() registrationDevice?: string;
}
