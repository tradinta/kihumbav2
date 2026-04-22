import { Injectable, NotFoundException, ForbiddenException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTribeDto, UpdateTribeDto, JoinTribeDto, ManageMemberDto, TribeReportDto } from './tribe.dto';
import { TribeRole, TribePrivacy } from '@prisma/client';

@Injectable()
export class TribeService {
    constructor(private prisma: PrismaService) { }

    // ─── Create Tribe ─────────────────────────────────────────────────────────

    async checkExists(slug: string): Promise<{ exists: boolean }> {
        const tribe = await this.prisma.tribe.findUnique({
            where: { slug }
        });
        return { exists: !!tribe };
    }

    async create(userId: string, dto: CreateTribeDto) {
        const slug = dto.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        if (slug.length < 10) {
            throw new BadRequestException('Tribe handle (username) must be at least 10 characters long.');
        }

        // Verify slug uniqueness
        const existing = await this.prisma.tribe.findUnique({ where: { slug } });
        if (existing) throw new BadRequestException('A tribe with this handle already exists.');

        return await this.prisma.$transaction(async (tx) => {
            const tribe = await tx.tribe.create({
                data: {
                    name: dto.name,
                    slug,
                    bio: dto.bio,
                    category: dto.category,
                    privacy: dto.privacy,
                    logo: dto.logo,
                    cover: dto.cover,
                    creatorId: userId,
                    rules: dto.rules || [],
                },
            });

            // Add creator as Admin member
            await tx.tribeMember.create({
                data: {
                    userId,
                    tribeId: tribe.id,
                    role: TribeRole.ADMIN,
                },
            });

            // Add questions if private
            if (dto.privacy === TribePrivacy.PRIVATE && dto.questions && dto.questions.length > 0) {
                await tx.tribeQuestion.createMany({
                    data: dto.questions.map(q => ({
                        text: q,
                        tribeId: tribe.id,
                    })),
                });
            }

            return tribe;
        });
    }

    // ─── Join Tribe ───────────────────────────────────────────────────────────

    async join(userId: string, tribeId: string, dto: JoinTribeDto) {
        const tribe = await this.prisma.tribe.findUnique({
            where: { id: tribeId },
            include: { questions: true },
        });

        if (!tribe) throw new NotFoundException('Tribe not found');

        // Check if already a member
        const existingMember = await this.prisma.tribeMember.findUnique({
            where: { userId_tribeId: { userId, tribeId } },
        });

        if (existingMember) {
            if (existingMember.isBanned) throw new ForbiddenException('You are banned from this tribe');
            throw new ConflictException('You are already a member of this tribe');
        }

        if (tribe.privacy === TribePrivacy.PUBLIC) {
            return await this.prisma.tribeMember.create({
                data: { userId, tribeId, role: TribeRole.MEMBER },
            });
        }

        if (tribe.privacy === TribePrivacy.PRIVATE) {
            // Check for pending request
            const existingRequest = await this.prisma.tribeJoinRequest.findFirst({
                where: { userId, tribeId, status: 'PENDING' }
            });
            if (existingRequest) throw new ConflictException('You already have a pending join request');

            return await this.prisma.tribeJoinRequest.create({
                data: {
                    userId,
                    tribeId,
                    answers: dto.answers as any,
                },
            });
        }

        throw new ForbiddenException('Cannot join a secret tribe without invitation');
    }

    async leave(userId: string, tribeId: string) {
        const membership = await this.prisma.tribeMember.findUnique({
            where: { userId_tribeId: { userId, tribeId } },
        });

        if (!membership) throw new NotFoundException('You are not a member of this tribe');
        
        // Prevent creator from leaving if they are the only admin (optional logic)
        // For now, just remove the member
        return await this.prisma.tribeMember.delete({
            where: { userId_tribeId: { userId, tribeId } },
        });
    }

    async getMembers(tribeId: string, query?: string) {
        return await this.prisma.tribeMember.findMany({
            where: {
                tribeId,
                user: query ? {
                    OR: [
                        { fullName: { contains: query, mode: 'insensitive' } },
                        { username: { contains: query, mode: 'insensitive' } },
                    ]
                } : undefined,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                        bio: true,
                    }
                }
            },
            orderBy: { joinedAt: 'desc' },
        });
    }

    // ─── Management ───────────────────────────────────────────────────────────

    async updateSettings(userId: string, tribeId: string, data: any) {
        console.log(`[TribeService] Update Settings Request:`, { userId, tribeId });
        
        if (!userId) {
            throw new BadRequestException('Identity verification failed. Please refresh and try again.');
        }

        const tribe = await this.prisma.tribe.findUnique({ where: { id: tribeId } });
        if (!tribe) throw new NotFoundException('Tribe not found');

        const membership = await this.prisma.tribeMember.findUnique({
            where: { userId_tribeId: { userId, tribeId } },
        });

        const isAdmin = (membership?.role === TribeRole.ADMIN) || (tribe.creatorId === userId);

        if (!isAdmin) {
            throw new ForbiddenException('Only admins can update tribe settings');
        }

        // We only allow updating specific fields
        const { name, bio, logo, cover, privacy, postVisibility, rules } = data;
        
        return await this.prisma.tribe.update({
            where: { id: tribeId },
            data: {
                name,
                bio,
                logo,
                cover,
                privacy,
                postVisibility,
                rules
            }
        });
    }

    async getJoinRequests(userId: string, tribeId: string) {
        const tribe = await this.prisma.tribe.findUnique({ where: { id: tribeId } });
        if (!tribe) throw new NotFoundException('Tribe not found');

        const membership = await this.prisma.tribeMember.findUnique({
            where: { userId_tribeId: { userId, tribeId } },
        });

        const canView = (membership?.role === TribeRole.ADMIN || membership?.role === TribeRole.MODERATOR) || (tribe.creatorId === userId);

        if (!canView) {
            throw new ForbiddenException('Only admins or moderators can view join requests');
        }

        return await this.prisma.tribeJoinRequest.findMany({
            where: { tribeId, status: 'PENDING' },
            include: { user: { select: { id: true, username: true, fullName: true, avatar: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async respondToJoinRequest(userId: string, requestId: string, approve: boolean) {
        const request = await this.prisma.tribeJoinRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) throw new NotFoundException('Join request not found');

        const tribe = await this.prisma.tribe.findUnique({ where: { id: request.tribeId } });
        if (!tribe) throw new NotFoundException('Tribe not found');

        const membership = await this.prisma.tribeMember.findUnique({
            where: { userId_tribeId: { userId, tribeId: request.tribeId } },
        });

        const canRespond = (membership?.role === TribeRole.ADMIN || membership?.role === TribeRole.MODERATOR) || (tribe.creatorId === userId);

        if (!canRespond) {
            throw new ForbiddenException('Only admins or moderators can respond to join requests');
        }

        if (approve) {
            return await this.prisma.$transaction([
                this.prisma.tribeJoinRequest.update({
                    where: { id: requestId },
                    data: { status: 'APPROVED' }
                }),
                this.prisma.tribeMember.create({
                    data: { userId: request.userId, tribeId: request.tribeId, role: TribeRole.MEMBER }
                })
            ]);
        } else {
            return await this.prisma.tribeJoinRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' }
            });
        }
    }

    async generateInvite(userId: string, tribeId: string) {
        const tribe = await this.prisma.tribe.findUnique({ where: { id: tribeId } });
        if (!tribe) throw new NotFoundException('Tribe not found');

        const membership = await this.prisma.tribeMember.findUnique({
            where: { userId_tribeId: { userId, tribeId } },
        });

        const canInvite = (membership?.role === TribeRole.ADMIN || membership?.role === TribeRole.MODERATOR) || (tribe.creatorId === userId);

        if (!canInvite) {
            throw new ForbiddenException('Only admins or moderators can generate invite links');
        }

        // Generate a random 8-char code
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();

        return await this.prisma.tribeInvite.create({
            data: {
                code,
                tribeId,
                inviterId: userId,
            },
            include: {
                tribe: { select: { name: true, slug: true } },
                inviter: { select: { fullName: true } }
            }
        });
    }

    async getInviteByCode(code: string) {
        const invite = await this.prisma.tribeInvite.findUnique({
            where: { code },
            include: {
                tribe: { select: { id: true, name: true, slug: true, logo: true, bio: true, privacy: true } },
                inviter: { select: { id: true, fullName: true, avatar: true } }
            }
        });

        if (!invite) throw new NotFoundException('Invite link is invalid or expired');
        return invite;
    }

    // ─── Manage Membership ────────────────────────────────────────────────────

    async manageMember(actorId: string, tribeId: string, dto: ManageMemberDto) {
        const actor = await this.prisma.tribeMember.findUnique({
            where: { userId_tribeId: { userId: actorId, tribeId } },
        });

        if (!actor || (actor.role !== TribeRole.ADMIN && actor.role !== TribeRole.MODERATOR)) {
            throw new ForbiddenException('Only Admins or Moderators can manage members');
        }

        const target = await this.prisma.tribeMember.findUnique({
            where: { userId_tribeId: { userId: dto.userId, tribeId } },
        });

        if (!target) throw new NotFoundException('Target user is not a member of this tribe');

        // Role restriction: Mods cannot manage Admins or other Mods
        if (actor.role === TribeRole.MODERATOR && target.role !== TribeRole.MEMBER) {
            throw new ForbiddenException('Moderators can only manage standard members');
        }

        switch (dto.action) {
            case 'BAN':
                return await this.prisma.tribeMember.update({
                    where: { userId_tribeId: { userId: dto.userId, tribeId } },
                    data: { isBanned: true },
                });
            case 'UNBAN':
                return await this.prisma.tribeMember.update({
                    where: { userId_tribeId: { userId: dto.userId, tribeId } },
                    data: { isBanned: false },
                });
            case 'RESTRICT':
                return await this.prisma.tribeMember.update({
                    where: { userId_tribeId: { userId: dto.userId, tribeId } },
                    data: { isRestricted: true },
                });
            case 'UNRESTRICT':
                return await this.prisma.tribeMember.update({
                    where: { userId_tribeId: { userId: dto.userId, tribeId } },
                    data: { isRestricted: false },
                });
            case 'SET_POST_APPROVAL':
                return await this.prisma.tribeMember.update({
                    where: { userId_tribeId: { userId: dto.userId, tribeId } },
                    data: { requiresApproval: dto.requiresApproval ?? true },
                });
            case 'PROMOTE':
                if (actor.role !== TribeRole.ADMIN) throw new ForbiddenException('Only Admins can promote members');
                return await this.prisma.tribeMember.update({
                    where: { userId_tribeId: { userId: dto.userId, tribeId } },
                    data: { role: TribeRole.MODERATOR },
                });
            case 'DEMOTE':
                if (actor.role !== TribeRole.ADMIN) throw new ForbiddenException('Only Admins can demote members');
                return await this.prisma.tribeMember.update({
                    where: { userId_tribeId: { userId: dto.userId, tribeId } },
                    data: { role: TribeRole.MEMBER },
                });
        }
    }

    // ─── Reporting ────────────────────────────────────────────────────────────

    async report(userId: string, tribeId: string, dto: TribeReportDto) {
        return await this.prisma.tribeReport.create({
            data: {
                reason: dto.reason,
                details: dto.details,
                reporterId: userId,
                tribeId,
                postId: dto.postId,
                commentId: dto.commentId,
            },
        });
    }

    // ─── Discovery ────────────────────────────────────────────────────────────

    async findAll(category?: string) {
        return await this.prisma.tribe.findMany({
            where: {
                privacy: { in: [TribePrivacy.PUBLIC, TribePrivacy.PRIVATE] },
                category: category as any,
            },
            include: {
                _count: { select: { members: true } },
            },
            orderBy: { members: { _count: 'desc' } },
        });
    }

    async findOne(slugOrId: string, userId?: string) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

        const tribe = await this.prisma.tribe.findFirst({
            where: isUuid ? { id: slugOrId } : { slug: slugOrId },
            include: {
                questions: true,
                _count: { select: { members: true } },
                creator: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                    }
                }
            },
        });

        if (!tribe) throw new NotFoundException('Tribe not found');

        // If secret, only members can see
        if (tribe.privacy === TribePrivacy.SECRET) {
            if (!userId) throw new ForbiddenException('This tribe is secret');
            const membership = await this.prisma.tribeMember.findUnique({
                where: { userId_tribeId: { userId, tribeId: tribe.id } },
            });
            if (!membership || membership.isBanned) throw new ForbiddenException('This tribe is secret');
        }

        // Attach membership status if userId provided
        let userRole: TribeRole | null = null;
        let isBanned = false;
        if (userId) {
            const membership = await this.prisma.tribeMember.findUnique({
                where: { userId_tribeId: { userId, tribeId: tribe.id } },
            });
            userRole = membership?.role || (tribe.creatorId === userId ? TribeRole.ADMIN : null);
            isBanned = membership?.isBanned || false;
        }

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const [weeklyVisits, weeklyPosts] = await Promise.all([
            this.prisma.tribeVisit.count({
                where: { tribeId: tribe.id, createdAt: { gte: weekAgo } }
            }),
            this.prisma.post.count({
                where: { tribeId: tribe.id, createdAt: { gte: weekAgo }, isDeleted: false }
            })
        ]);

        return { 
            ...tribe, 
            userRole, 
            isBanned,
            memberCount: tribe._count.members,
            weeklyVisits,
            weeklyPosts,
        };
    }

    async recordVisit(tribeId: string) {
        return await this.prisma.$transaction([
            this.prisma.tribe.update({
                where: { id: tribeId },
                data: { visitCount: { increment: 1 } }
            }),
            this.prisma.tribeVisit.create({
                data: { tribeId }
            })
        ]);
    }

    async getSuggested(userId: string) {
        // 1. Get IDs of users I follow (ACCEPTED)
        const following = await this.prisma.follow.findMany({
            where: { followerId: userId, status: 'ACCEPTED' },
            select: { followedId: true }
        });
        const followingIds = following.map(f => f.followedId);

        // 2. Get my current tribe memberships to exclude them
        const myMemberships = await this.prisma.tribeMember.findMany({
            where: { userId },
            select: { tribeId: true }
        });
        const myTribeIds = myMemberships.map(m => m.tribeId);

        // 3. Find tribes with friends
        const suggestions = await this.prisma.tribe.findMany({
            where: {
                id: { notIn: myTribeIds },
                privacy: { in: [TribePrivacy.PUBLIC, TribePrivacy.PRIVATE] },
                members: {
                    some: {
                        userId: { in: followingIds }
                    }
                }
            },
            include: {
                _count: { select: { members: true } },
                members: {
                    where: { userId: { in: followingIds } },
                    include: { user: { select: { avatar: true, id: true } } },
                    take: 3
                }
            },
            take: 10
        });

        return suggestions.map(s => ({
            ...s,
            friendCount: s.members.length, // This is count of friends, not total members
            friendAvatars: s.members.map(m => m.user.avatar).filter(Boolean),
            totalMembers: s._count.members
        }));
    }
}
