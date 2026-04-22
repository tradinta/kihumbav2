import {
    Injectable, NotFoundException, ConflictException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { AlgoliaService } from '../search/algolia/algolia.service';
import { BadgeService } from './badge.service';

const USER_PUBLIC_SELECT = {
    id: true,
    username: true,
    fullName: true,
    avatar: true,
    coverPhoto: true,
    bio: true,
    county: true,
    countyId: true,
    subCounty: true,
    institution: true,
    accountType: true,
    isReserved: true,
    website: true,
    isVerified: true,
    isBanned: true,
    privateAccount: true,
    searchEngineIndexing: true,
    gender: true,
    createdAt: true,
    _count: {
        select: { 
            posts: true, 
            followers: true, 
            following: true,
            marketListings: true,
            kaoListings: true
        },
    },
    badges: {
        include: { badge: true }
    },
    sellerProfile: true,
    partnerProfile: true
};

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
        private algoliaService: AlgoliaService,
        private badgeService: BadgeService
    ) { }
    
    async isMutualFollow(userAId: string, userBId: string): Promise<boolean> {
        if (!userAId || !userBId) return false;
        const count = await this.prisma.follow.count({
            where: {
                status: 'ACCEPTED',
                OR: [
                    { followerId: userAId, followedId: userBId },
                    { followerId: userBId, followedId: userAId }
                ]
            }
        });
        return count === 2;
    }

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
                mutes: requesterId
                    ? { where: { muterId: requesterId }, select: { muterId: true } }
                    : false,
            },
        });

        if (!user) throw new NotFoundException('User not found');

        const isOwner = requesterId === user.id;
        const isFriend = requesterId ? await this.isMutualFollow(user.id, requesterId) : false;

        // ─── Privacy Guard: Private Account ───
        if (user.privateAccount && !isOwner && !isFriend) {
            // Return "Ghost" restricted profile - NO Hard Error, just restricted data
            return {
                id: user.id,
                username: user.username,
                fullName: !user.searchEngineIndexing && !requesterId ? 'IDENTITY_LOCKED' : user.fullName,
                avatar: !user.searchEngineIndexing && !requesterId ? null : user.avatar,
                gender: user.gender,
                isPrivate: true,
                isFriend: false,
                isOwner: false,
                _count: { 
                    posts: 0, 
                    followers: user._count.followers, 
                    following: user._count.following 
                }
            } as any;
        }

        // ─── Privacy Guard: Identity Masking (Search Indexing OFF) ───
        if (!user.searchEngineIndexing && !requesterId) {
            return {
                ...user,
                fullName: 'IDENTITY_LOCKED',
                avatar: null,
                bio: null,
                website: null,
                isIdentityMasked: true,
                isPrivate: user.privateAccount,
                isFriend: false,
                isOwner: false
            };
        }

        // Async trigger to sync badges and login streaks if it's the user's own profile
        if (isOwner) {
            await this.checkSubscriptionStatus(user.id);
            this.badgeService.recordLogin(user.id).catch(() => {});
        } else {
            // Just sync badges for public view
            this.badgeService.syncUserBadges(user.id).catch(() => {});
        }

        // Returning badges directly for the trophy case.
        return {
            ...user,
            isOwner,
            isFriend,
            isPrivate: user.privateAccount,
            followStatus: requesterId ? (user as any).followers?.[0]?.status : null,
            isFollowing: requesterId ? (user as any).followers?.[0]?.status === 'ACCEPTED' : false,
            isBlocked: requesterId ? (user as any).blocks?.length > 0 : false,
            isMuted: requesterId ? (user as any).mutes?.length > 0 : false,
            badges: (user as any).badges?.map((ub: any) => ({
                ...ub.badge,
                awardedAt: ub.awardedAt
            })) || [],
            followers: undefined,
            blocks: undefined,
            mutes: undefined,
        };
    }

    // ─── Follow ────────────────────────────────────────────────────────────────

    async follow(followerId: string, followedId: string) {
        if (followerId === followedId) throw new ForbiddenException('You cannot follow yourself');

        // Check if target exists
        const target = await this.prisma.user.findUnique({ where: { id: followedId } });
        if (!target) throw new NotFoundException('User not found');

        // Check if already following or pending
        const existing = await this.prisma.follow.findUnique({
            where: { followerId_followedId: { followerId, followedId } },
        });
        if (existing) return { message: existing.status === 'PENDING' ? 'Request pending' : 'Already following' };

        const status = target.privateAccount ? 'PENDING' : 'ACCEPTED';
        await this.prisma.follow.create({ data: { followerId, followedId, status } });

        // Create notification (Real-time Handshake)
        this.notificationService.createNotification({
            type: status === 'PENDING' ? 'FOLLOW_REQUEST' : 'FOLLOW',
            recipientId: followedId,
            senderId: followerId,
        }).catch(() => { }); // non-fatal

        return { message: status === 'PENDING' ? 'Request sent' : 'Followed successfully', status };
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

    // ─── Mute ──────────────────────────────────────────────────────────────────

    async mute(muterId: string, mutedId: string) {
        if (muterId === mutedId) throw new ForbiddenException('You cannot mute yourself');

        const target = await this.prisma.user.findUnique({ where: { id: mutedId } });
        if (!target) throw new NotFoundException('User not found');

        await this.prisma.mute.upsert({
            where: { muterId_mutedId: { muterId, mutedId } },
            create: { muterId, mutedId },
            update: {},
        });

        return { message: 'User muted' };
    }

    // ─── Unmute ────────────────────────────────────────────────────────────────

    async unmute(muterId: string, mutedId: string) {
        await this.prisma.mute.deleteMany({ where: { muterId, mutedId } });
        return { message: 'User unmuted' };
    }

    // ─── Followers / Following Lists ──────────────────────────────────────────

    async getFollowers(userId: string, requesterId?: string, cursor?: string, limit = 20) {
        // Privacy Rule: If not self, max 12 total.
        const isSelf = requesterId === userId;
        const finalLimit = isSelf ? limit : Math.min(limit, 12);

        const followers = await this.prisma.follow.findMany({
            where: { followedId: userId, status: 'ACCEPTED' },
            take: finalLimit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { followerId_followedId: { followerId: cursor, followedId: userId } } : undefined,
            include: { follower: { select: USER_PUBLIC_SELECT } },
            orderBy: { createdAt: 'desc' },
        });

        const hasMore = isSelf ? (followers.length > limit) : false;
        const data = hasMore ? followers.slice(0, limit) : followers;
        
        return {
            data: data.map((f) => f.follower),
            nextCursor: hasMore ? data[data.length - 1].followerId : null,
            hasMore,
        };
    }

    async getFollowing(userId: string, requesterId?: string, cursor?: string, limit = 20) {
        // Privacy Rule: If not self, max 12 total.
        const isSelf = requesterId === userId;
        const finalLimit = isSelf ? limit : Math.min(limit, 12);

        const following = await this.prisma.follow.findMany({
            where: { followerId: userId, status: 'ACCEPTED' },
            take: finalLimit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { followerId_followedId: { followerId: userId, followedId: cursor } } : undefined,
            include: { followed: { select: USER_PUBLIC_SELECT } },
            orderBy: { createdAt: 'desc' },
        });

        const hasMore = isSelf ? (following.length > limit) : false;
        const data = hasMore ? following.slice(0, limit) : following;

        return {
            data: data.map((f) => f.followed),
            nextCursor: hasMore ? data[data.length - 1].followedId : null,
            hasMore,
        };
    }

    async getFriends(userId: string) {
        // Find users where (Follower=Self AND Followed=Target) AND (Follower=Target AND Followed=Self)
        // This is a bit complex in a single prisma query with these relations
        // We'll get all accepted following and filter by who follows us back
        const following = await this.prisma.follow.findMany({
            where: { followerId: userId, status: 'ACCEPTED' },
            select: { followedId: true }
        });
        const followingIds = following.map(f => f.followedId);

        const mutuals = await this.prisma.follow.findMany({
            where: {
                followerId: { in: followingIds },
                followedId: userId,
                status: 'ACCEPTED'
            },
            include: { follower: { select: USER_PUBLIC_SELECT } }
        });

        return mutuals.map(m => m.follower);
    }

    async getUserTribes(userId: string) {
        const memberships = await this.prisma.tribeMember.findMany({
            where: { userId, isBanned: false },
            include: {
                tribe: {
                    select: { id: true, name: true, slug: true, logo: true, cover: true, _count: { select: { members: true } } }
                }
            }
        });
        return memberships.map(m => m.tribe);
    }

    async getFollowRequests(userId: string) {
        return this.prisma.follow.findMany({
            where: { followedId: userId, status: 'PENDING' },
            include: { follower: { select: USER_PUBLIC_SELECT } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async handleFollowRequest(followedId: string, followerId: string, accept: boolean) {
        if (accept) {
            await this.prisma.follow.update({
                where: { followerId_followedId: { followerId, followedId } },
                data: { status: 'ACCEPTED' }
            });
            
            // Notify acceptance
            this.notificationService.createNotification({
                type: 'FOLLOW_ACCEPT',
                recipientId: followerId,
                senderId: followedId,
            }).catch(() => {});
            
            return { message: 'Follow request accepted' };
        } else {
            await this.prisma.follow.delete({
                where: { followerId_followedId: { followerId, followedId } }
            });
            return { message: 'Follow request rejected' };
        }
    }
    async updateProfile(userId: string, dto: any) {
        // ... (existing logic)
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                fullName: dto.name,
                bio: dto.bio,
                county: dto.location,
                website: dto.website,
                avatar: dto.avatar,
                coverPhoto: dto.coverPhoto,
                privateAccount: dto.privateAccount,
                searchEngineIndexing: dto.searchEngineIndexing,
            }
        });

        // 🚀 Index in Algolia
        this.algoliaService.indexUser(user).catch(() => {});

        return user;
    }

    async getSuggestedFollows(userId: string, limit = 10) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { county: true, subCounty: true, institution: true }
        });

        if (!user) return [];

        const suggested = await this.prisma.user.findMany({
            where: {
                id: { not: userId },
                searchEngineIndexing: true,
                isBanned: false,
                AND: [
                    { followers: { none: { followerId: userId } } },
                    { blockedBy: { none: { blockerId: userId } } },
                    { blocks: { none: { blockedId: userId } } },
                    {
                        OR: [
                            { institution: user.institution },
                            { subCounty: user.subCounty },
                            { county: user.county }
                        ]
                    }
                ]
            },
            select: USER_PUBLIC_SELECT,
            take: limit
        });

        return suggested.map(s => {
            let reason = "Suggested for you";
            if (s.institution && s.institution === user.institution) reason = "From your school";
            else if (s.subCounty && s.subCounty === user.subCounty) reason = "In your sub-county";
            else if (s.county && s.county === user.county) reason = "In your county";

            return { ...s, suggestionReason: reason };
        });
    }

    async searchUsers(query: string, limit = 15) {
        if (!query || query.length < 1) return [];
        
        return this.prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { fullName: { contains: query, mode: 'insensitive' } }
                ],
                isBanned: false,
                searchEngineIndexing: true
            },
            select: USER_PUBLIC_SELECT,
            take: limit
        });
    }

    async updateTier(userId: string, tier: string) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionTier: tier as any,
                subscriptionExpiresAt: expiryDate
            }
        });

        // Index in Algolia if needed
        this.algoliaService.indexUser(user).catch(() => {});

        return user;
    }

    async checkSubscriptionStatus(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { subscriptionTier: true, subscriptionExpiresAt: true }
        });

        if (user && user.subscriptionTier !== 'FREE' && user.subscriptionExpiresAt) {
            if (new Date() > new Date(user.subscriptionExpiresAt)) {
                // Subscription expired, reset to FREE
                const updatedUser = await this.prisma.user.update({
                    where: { id: userId },
                    data: {
                        subscriptionTier: 'FREE',
                        subscriptionExpiresAt: null
                    }
                });
                
                // Sync with Algolia
                this.algoliaService.indexUser(updatedUser).catch(() => {});
                
                return true;
            }
        }
        return false;
    }
}
