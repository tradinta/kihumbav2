import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BadgeService {
    private logger = new Logger(BadgeService.name);
    constructor(private prisma: PrismaService) {}

    /**
     * Call this when a user logs in or views their profile to ensure 
     * their badges are up to date.
     */
    async syncUserBadges(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { 
                _count: { select: { followers: true, kaoListings: true } },
                badges: { include: { badge: true } }
            }
        });

        if (!user) return;

        const currentBadgeNames = user.badges.map(ub => ub.badge.name);
        const badgesToAward: string[] = [];

        // ─── 0. Welcome Badge (Always given) ───
        badgesToAward.push('Welcome');

        // ─── 1. Pioneer Badges (Based on numericId) ───
        const rank = user.numericId;
        if (rank <= 100) badgesToAward.push('Pioneer 100');
        else if (rank <= 250) badgesToAward.push('Pioneer 250');
        else if (rank <= 1000) badgesToAward.push('Early Adopter');
        else if (rank <= 10000) badgesToAward.push('Kihumba Vanguard');

        // ─── 2. KAO Landlord Badges ───
        const kaoCount = user._count.kaoListings;
        if (kaoCount >= 100) badgesToAward.push('Kao Dynasty');
        else if (kaoCount >= 50) badgesToAward.push('Kao Tycoon');
        else if (kaoCount >= 10) badgesToAward.push('Kao Realtor');
        else if (kaoCount >= 1) badgesToAward.push('Kao Settler');

        // ─── 3. Influencer Badges ───
        const followers = user._count.followers;
        if (followers >= 1000000) badgesToAward.push('Mega-Influencer');
        else if (followers >= 500000) badgesToAward.push('Macro-Influencer');
        else if (followers >= 100000) badgesToAward.push('Mid-tier Influencer');
        else if (followers >= 10000) badgesToAward.push('Micro-influencer');
        else if (followers >= 1000) badgesToAward.push('Nano-influencer');

        // ─── 4. Login Streak Badges ───
        const streak = user.loginStreak;
        if (streak >= 365) badgesToAward.push('Kihumba Legend');
        else if (streak >= 180) badgesToAward.push('Kihumba Veteran');
        else if (streak >= 30) badgesToAward.push('Monthly Regular');
        else if (streak >= 7) badgesToAward.push('Weekly Warrior');

        // Award missing badges
        for (const badgeName of badgesToAward) {
            if (!currentBadgeNames.includes(badgeName)) {
                await this.awardBadge(userId, badgeName);
            }
        }
    }

    private async awardBadge(userId: string, badgeName: string) {
        // Ensure the badge master record exists
        let badge = await this.prisma.badge.findUnique({ where: { name: badgeName } });
        
        if (!badge) {
            // Seed it if missing (using default values for now)
            badge = await this.prisma.badge.create({
                data: {
                    name: badgeName,
                    category: this.getCategory(badgeName),
                    rarity: this.getRarity(badgeName),
                    icon: 'Award' // Default icon
                }
            });
        }

        try {
            await this.prisma.userBadge.create({
                data: {
                    userId,
                    badgeId: badge.id
                }
            });
        } catch (e: any) {
            // P2002 is Prisma's code for Unique Constraint Violation
            if (e.code === 'P2002') {
                this.logger.debug(`Badge ${badgeName} already awarded to user ${userId}. Skipping.`);
            } else {
                this.logger.error(`Failed to award badge ${badgeName}: ${e.message}`);
                throw e;
            }
        }
    }

    private getCategory(name: string): string {
        if (name.includes('Pioneer') || name.includes('Early')) return 'PIONEER';
        if (name.includes('Kao')) return 'KAO';
        if (name.includes('influencer')) return 'INFLUENCER';
        return 'STREAK';
    }

    private getRarity(name: string): string {
        if (name.includes('100') || name.includes('Legend') || name.includes('Mega')) return 'LEGENDARY';
        if (name.includes('250') || name.includes('Veteran') || name.includes('Macro')) return 'EPIC';
        if (name.includes('1000') || name.includes('Tycoon') || name.includes('Mid')) return 'RARE';
        return 'COMMON';
    }

    /**
     * Logic to update streak on login
     */
    async recordLogin(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) return;

        const now = new Date();
        const lastLogin = user.lastLoginAt;
        
        if (!lastLogin) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { loginStreak: 1, lastLoginAt: now }
            });
            return;
        }

        const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day!
            await this.prisma.user.update({
                where: { id: userId },
                data: { loginStreak: { increment: 1 }, lastLoginAt: now }
            });
        } else if (diffDays > 1) {
            // Streak broken
            await this.prisma.user.update({
                where: { id: userId },
                data: { loginStreak: 1, lastLoginAt: now }
            });
        } else {
            // Same day login, just update timestamp
            await this.prisma.user.update({
                where: { id: userId },
                data: { lastLoginAt: now }
            });
        }

        // Sync badges after streak update
        await this.syncUserBadges(userId);
    }
}
