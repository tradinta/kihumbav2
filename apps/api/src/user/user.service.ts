import {
    Injectable, NotFoundException, ConflictException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const USER_PUBLIC_SELECT = {
    id: true,
    username: true,
    fullName: true,
    avatar: true,
    bio: true,
    tier: true,
    county: true,
    isVerified: true,
    isBanned: true,
    createdAt: true,
    _count: {
        select: { posts: true, followers: true, following: true },
    },
};

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    // ─── Get Public Profile ────────────────────────────────────────────────────

    async getProfile(username: string, requesterId?: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
            select: {
                ...USER_PUBLIC_SELECT,
                followers: requesterId
                    ? { where: { followerId: requesterId }, select: { followerId: true } }
                    : false,
                blocks: requesterId
                    ? { where: { blockerId: requesterId }, select: { blockerId: true } }
                    : false,
            },
        });

        if (!user) throw new NotFoundException('User not found');

        return {
            ...user,
            isFollowing: requesterId ? (user as any).followers?.length > 0 : false,
            isBlocked: requesterId ? (user as any).blocks?.length > 0 : false,
            followers: undefined,
            blocks: undefined,
        };
    }

    // ─── Follow ────────────────────────────────────────────────────────────────

    async follow(followerId: string, followedId: string) {
        if (followerId === followedId) throw new ForbiddenException('You cannot follow yourself');

        // Check if target exists
        const target = await this.prisma.user.findUnique({ where: { id: followedId } });
        if (!target) throw new NotFoundException('User not found');

        // Check if already following
        const existing = await this.prisma.follow.findUnique({
            where: { followerId_followedId: { followerId, followedId } },
        });
        if (existing) return { message: 'Already following' };

        await this.prisma.follow.create({ data: { followerId, followedId } });

        // Create notification
        await this.prisma.notification.create({
            data: {
                type: 'FOLLOW',
                recipientId: followedId,
                senderId: followerId,
            },
        }).catch(() => { }); // non-fatal

        return { message: 'Followed successfully' };
    }

    // ─── Unfollow ──────────────────────────────────────────────────────────────

    async unfollow(followerId: string, followedId: string) {
        await this.prisma.follow.deleteMany({
            where: { followerId, followedId },
        });
        return { message: 'Unfollowed' };
    }

    // ─── Block ─────────────────────────────────────────────────────────────────

    async block(blockerId: string, blockedId: string) {
        if (blockerId === blockedId) throw new ForbiddenException('You cannot block yourself');

        const target = await this.prisma.user.findUnique({ where: { id: blockedId } });
        if (!target) throw new NotFoundException('User not found');

        // Upsert block
        await this.prisma.block.upsert({
            where: { blockerId_blockedId: { blockerId, blockedId } },
            create: { blockerId, blockedId },
            update: {},
        });

        // Remove any follow relationships
        await this.prisma.follow.deleteMany({
            where: {
                OR: [
                    { followerId: blockerId, followedId: blockedId },
                    { followerId: blockedId, followedId: blockerId },
                ],
            },
        });

        return { message: 'User blocked' };
    }

    // ─── Unblock ───────────────────────────────────────────────────────────────

    async unblock(blockerId: string, blockedId: string) {
        await this.prisma.block.deleteMany({ where: { blockerId, blockedId } });
        return { message: 'User unblocked' };
    }

    // ─── Followers / Following Lists ──────────────────────────────────────────

    async getFollowers(userId: string, cursor?: string, limit = 20) {
        const followers = await this.prisma.follow.findMany({
            where: { followedId: userId },
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { followerId_followedId: { followerId: cursor, followedId: userId } } : undefined,
            include: { follower: { select: USER_PUBLIC_SELECT } },
            orderBy: { createdAt: 'desc' },
        });

        const hasMore = followers.length > limit;
        const data = hasMore ? followers.slice(0, limit) : followers;
        return {
            data: data.map((f) => f.follower),
            nextCursor: hasMore ? data[data.length - 1].followerId : null,
            hasMore,
        };
    }

    async getFollowing(userId: string, cursor?: string, limit = 20) {
        const following = await this.prisma.follow.findMany({
            where: { followerId: userId },
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { followerId_followedId: { followerId: userId, followedId: cursor } } : undefined,
            include: { followed: { select: USER_PUBLIC_SELECT } },
            orderBy: { createdAt: 'desc' },
        });

        const hasMore = following.length > limit;
        const data = hasMore ? following.slice(0, limit) : following;
        return {
            data: data.map((f) => f.followed),
            nextCursor: hasMore ? data[data.length - 1].followedId : null,
            hasMore,
        };
    }
}
