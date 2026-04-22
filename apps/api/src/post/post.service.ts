import {
    Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreatePostDto } from './post.dto';
import { VideoService } from '../video/video.service';
import { AlgoliaService } from '../search/algolia/algolia.service';

const POST_SELECT = (userId?: string) => ({
    id: true,
    content: true,
    media: true,
    contentType: true,
    originalPostId: true,
    isPinned: true,
    viewCount: true,
    createdAt: true,
    author: {
        select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            isVerified: true,
            countyId: true,
            subCounty: true,
            institution: true,
            accountType: true,
            isReserved: true,
        },
    },
    _count: {
        select: {
            comments: true,
            interactions: { where: { type: 'UPVOTE' } },
        },
    },
});

@Injectable()
export class PostService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
        private videoService: VideoService,
        private algoliaService: AlgoliaService
    ) { }

    // ─── Create Post ──────────────────────────────────────────────────────────

    async create(dto: CreatePostDto, userId: string) {
        // 1. Determine content type
        let derivedContentType = dto.contentType || 'TEXT';
        if (dto.originalPostId) {
            derivedContentType = dto.content ? 'QUOTE' : 'RESHARE';
            
            // Verify original post exists
            const original = await this.prisma.post.findUnique({
                where: { id: dto.originalPostId }
            });
            if (!original || original.isDeleted) {
                throw new NotFoundException('Original post not found or has been deleted');
            }
        } else if (dto.marketListingId) {
            derivedContentType = dto.content ? 'QUOTE' : 'RESHARE';
            
            // Verify listing exists
            const listing = await this.prisma.marketListing.findUnique({
                where: { id: dto.marketListingId }
            });
            if (!listing || !listing.isActive) {
                throw new NotFoundException('Marketplace listing not found or inactive');
            }
        } else if (dto.kaoListingId) {
            derivedContentType = dto.content ? 'QUOTE' : 'RESHARE';
            
            // Verify listing exists
            const listing = await this.prisma.kaoListing.findUnique({
                where: { id: dto.kaoListingId }
            });
            if (!listing) {
                throw new NotFoundException('Property listing not found');
            }
        } else if (dto.media && dto.media.length > 0) {
            const hasDocument = dto.media.some(m => m.type === 'document');
            if (hasDocument) {
                derivedContentType = 'DOCUMENT';
            } else {
                derivedContentType = dto.media[0].type === 'video' ? 'VIDEO' : 'PHOTO';
            }
        }

        // 2. Transactional Creation for EVENT and POLL
        const postId = await this.prisma.$transaction(async (tx) => {
            const post = await tx.post.create({
                data: {
                    content: dto.content || '',
                    media: dto.media ? (dto.media as any) : null,
                    contentType: derivedContentType as any,
                    originalPostId: dto.originalPostId || null,
                    marketListingId: dto.marketListingId || null,
                    kaoListingId: dto.kaoListingId || null,
                    authorId: userId,
                    tribeId: dto.tribeId || null,
                }
            });

            // ─── Privacy Check for Tribe Posts ───
            if (dto.tribeId) {
                const author = await tx.user.findUnique({ where: { id: userId }, select: { privateAccount: true } });
                const tribe = await tx.tribe.findUnique({ where: { id: dto.tribeId }, select: { privacy: true } });
                if (author?.privateAccount && tribe?.privacy === 'PUBLIC') {
                    throw new ForbiddenException('Private accounts cannot participate in public Tribes.');
                }
            }

            // Handle Event Data
            if (derivedContentType === 'EVENT' && dto.eventData) {
                await tx.event.create({
                    data: {
                        postId: post.id,
                        title: dto.eventData.title,
                        organizer: dto.eventData.organizer,
                        date: new Date(dto.eventData.date),
                        endDate: dto.eventData.endDate ? new Date(dto.eventData.endDate) : null,
                        venue: dto.eventData.venue,
                        price: dto.eventData.price,
                        externalLink: dto.eventData.externalLink,
                        description: dto.eventData.description,
                        posterUrl: dto.eventData.posterUrl,
                        isVerified: false, // Default to false, verified by sellers.kihumba logic later
                    }
                });
            }

            // Handle Poll Data
            if (derivedContentType === 'POLL' && dto.pollData) {
                const pollData = dto.pollData;
                const poll = await tx.poll.create({
                    data: {
                        postId: post.id,
                        question: pollData.question,
                        allowMultiple: pollData.allowMultiple || false,
                        isQuiz: pollData.isQuiz || false,
                        endsAt: pollData.endsAt ? new Date(pollData.endsAt) : null,
                    }
                });

                await tx.pollOption.createMany({
                    data: pollData.options.map((text, index) => ({
                        pollId: poll.id,
                        text,
                        sortOrder: index,
                        isCorrect: pollData.isQuiz && pollData.correctIndices?.includes(index) || false,
                    }))
                });
            }
            return post.id;
        });

        // 3. Heavy Fetch with Includes (Outside Transaction for stability)
        const finalPost = await this.prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                },
                tribe: true,
                event: true,
                poll: {
                    include: {
                        options: { orderBy: { sortOrder: 'asc' } },
                        _count: { select: { votes: true } }
                    }
                },
                video: true,
                originalPost: {
                    include: {
                        author: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                        },
                        event: true,
                        poll: {
                            include: {
                                options: { orderBy: { sortOrder: 'asc' } },
                                _count: { select: { votes: true } }
                            }
                        },
                    }
                },
                marketListing: true,
                kaoListing: true,
                _count: { select: { comments: true, interactions: true } },
            }
        });

        // 🚀 Index in Algolia (Outside Transaction for stability)
        if (finalPost) {
            this.algoliaService.indexPost(finalPost).catch(() => {});
        }

        return finalPost;
    }

    // ─── Get Feed (cursor pagination) ─────────────────────────────────────────

    async getFeed(requesterId?: string, cursor?: string, limit = 20, tab: 'HOME' | 'SPARK' | 'VIDEO' | 'EVENT' = 'HOME', sort: 'LATEST' | 'RECOMMENDED' = 'LATEST', query?: string) {
        const { blockedIds, mutedIds, followingIds, friendIds } = requesterId
            ? await this.getSocialFilters(requesterId)
            : { blockedIds: [], mutedIds: [], followingIds: [], friendIds: [] };

        // Determine which tribes the user is a member of
        let joinedTribeIds: string[] = [];
        if (requesterId) {
            const memberships = await this.prisma.tribeMember.findMany({
                where: { userId: requesterId, isBanned: false },
                select: { tribeId: true },
            });
            joinedTribeIds = memberships.map(m => m.tribeId);
        }

        // Build the where clause for the specific tab
        const where: any = {
            isDeleted: false,
            authorId: { notIn: [...blockedIds, ...mutedIds] },
        };

        if (query) {
            where.OR = [
                { content: { contains: query, mode: 'insensitive' } },
                { video: { title: { contains: query, mode: 'insensitive' } } }
            ];
        }

        if (tab === 'SPARK') {
            where.contentType = 'VIDEO';
            where.video = { isSpark: true, visibility: 'PUBLIC' };
        } else if (tab === 'VIDEO') {
            where.contentType = 'VIDEO';
            where.video = { isSpark: false, visibility: 'PUBLIC' };
        } else if (tab === 'EVENT') {
            where.contentType = 'EVENT';
        } else {
            // HOME - Weighted visibility + Industrial Visibility Guardrail
            const homeFilters = [
                {
                    OR: [
                        { videoId: null }, // Non-video posts
                        { video: { visibility: 'PUBLIC' } } // Only public videos
                    ]
                }
            ];

            // If not searching, apply social siloing
            if (!query) {
                homeFilters.push({
                    OR: [
                        { tribeId: null }, // Generic posts
                        { tribeId: { in: joinedTribeIds } }, // Joined tribes
                        { authorId: { in: followingIds } } // Specifically show following
                    ]
                } as any);
            }

            where.AND = homeFilters;
        }

        // ─── Global Privacy Filter (Applied to all tabs) ───
        const privacyFilter = {
            OR: [
                { author: { privateAccount: false } },
                { authorId: requesterId },
                { authorId: { in: friendIds } }
            ]
        };

        // Extra guard for guests: Never show private accounts
        if (!requesterId) {
            where.author = { privateAccount: false };
        }

        if (where.AND) {
            where.AND.push(privacyFilter);
        } else {
            where.AND = [privacyFilter];
        }

        const orderBy: any = sort === 'RECOMMENDED' 
            ? [
                { interactions: { _count: 'desc' } },
                { createdAt: 'desc' }
              ]
            : { createdAt: 'desc' };

        const posts = await this.prisma.post.findMany({
            where,
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy,
            include: {
                author: {
                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                },
                tribe: {
                    select: { id: true, name: true, slug: true },
                },
                video: {
                    select: { id: true, title: true, isSpark: true, duration: true, playbackId: true, thumbnailUrl: true, videoUrl: true }
                },
                marketListing: {
                    include: {
                        seller: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                        },
                    }
                },
                kaoListing: {
                    include: {
                        author: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                        },
                    }
                },
                originalPost: {
                    include: {
                        author: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                        },
                        event: true,
                        poll: {
                            include: {
                                options: { 
                                    orderBy: { sortOrder: 'asc' },
                                    include: { _count: { select: { votes: true } } }
                                },
                                _count: { select: { votes: true } }
                            }
                        },
                    }
                },
                event: true,
                poll: {
                    include: {
                        options: { 
                            orderBy: { sortOrder: 'asc' },
                            include: { _count: { select: { votes: true } } }
                        },
                        _count: { select: { votes: true } }
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        reshares: true,
                        interactions: { where: { type: 'UPVOTE' } },
                    },
                },
            },
        });

        // 💡 ALGORITHM: Boost followed accounts and Inject Social State
        let processedPosts = posts.map(post => {
            const author = post.author as any;
            return {
                ...post,
                author: {
                    ...author,
                    isFollowing: requesterId ? followingIds.includes(author.id) : false,
                    isMuted: requesterId ? mutedIds.includes(author.id) : false,
                    isBlocked: requesterId ? blockedIds.includes(author.id) : false,
                }
            };
        });

        if (tab === 'HOME' && followingIds.length > 0) {
            processedPosts = [...processedPosts].sort((a, b) => {
                const aFollowed = followingIds.includes(a.author.id);
                const bFollowed = followingIds.includes(b.author.id);
                if (aFollowed && !bFollowed) return -1;
                if (!aFollowed && bFollowed) return 1;
                return 0;
            });
        }

        const hasMore = processedPosts.length > limit;
        const data = hasMore ? processedPosts.slice(0, limit) : processedPosts;

        // Attach user's own interaction state if logged in
        let withInteractions = data;
        if (requesterId) {
            const ids = data.map((p) => p.id);
            const myInteractions = await this.prisma.userInteraction.findMany({
                where: { userId: requesterId, postId: { in: ids } },
            });

            withInteractions = data.map((post) => ({
                ...post,
                userInteraction: {
                    hasUpvoted: myInteractions.some((i) => i.postId === post.id && i.type === 'UPVOTE'),
                    hasDownvoted: myInteractions.some((i) => i.postId === post.id && i.type === 'DOWNVOTE'),
                    hasBookmarked: myInteractions.some((i) => i.postId === post.id && i.type === 'BOOKMARK'),
                    hasReshared: myInteractions.some((i) => i.postId === post.id && i.type === 'RESHARE'),
                },
            }));
        }

        return {
            posts: withInteractions,
            nextCursor: hasMore ? data[data.length - 1].id : null,
            hasMore,
        };
    }

    // ─── Get Single Post ──────────────────────────────────────────────────────

    async getById(id: string, requesterId?: string) {
        const post = await this.prisma.post.findFirst({
            where: { id, isDeleted: false },
            include: {
                author: {
                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true, privateAccount: true },
                },
                tribe: {
                    select: { id: true, name: true, slug: true },
                },
                originalPost: {
                    include: {
                        author: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                        },
                        tribe: {
                            select: { id: true, name: true, slug: true },
                        },
                        marketListing: {
                            include: {
                                seller: {
                                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                                },
                            }
                        },
                        kaoListing: {
                            include: {
                                author: {
                                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                                },
                            }
                        },
                    }
                },
                video: {
                    select: { id: true, title: true, isSpark: true, duration: true, playbackId: true, thumbnailUrl: true }
                },
                marketListing: {
                    include: {
                        seller: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                        },
                    }
                },
                kaoListing: {
                    include: {
                        author: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                        },
                    }
                },
                event: true,
                poll: {
                    include: {
                        options: { 
                            orderBy: { sortOrder: 'asc' },
                            include: { _count: { select: { votes: true } } }
                        },
                        _count: { select: { votes: true } }
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        reshares: true,
                        interactions: { where: { type: 'UPVOTE' } },
                    },
                },
            },
        });

        if (!post) throw new NotFoundException('Post not found');

        const isOwner = requesterId === post.authorId;
        const isFriend = requesterId ? (await this.getSocialFilters(requesterId)).friendIds.includes(post.authorId) : false;

        // ─── Privacy Guard ───
        if ((post.author as any).privateAccount && !isOwner && !isFriend) {
            // Return restricted post object
            return {
                id: post.id,
                authorId: post.authorId,
                author: post.author,
                isPrivate: true,
                content: "This account is private. Content is restricted to friends.",
                isLocked: true
            } as any;
        }

        // Attach user interaction state if logged in
        let enrichedPost = {
            ...post,
            userInteraction: {
                hasUpvoted: false,
                hasDownvoted: false,
                hasBookmarked: false,
                hasReshared: false,
            }
        };

        if (requesterId) {
            const [myInteractions, pollVote] = await Promise.all([
                this.prisma.userInteraction.findMany({
                    where: { userId: requesterId, postId: id },
                }),
                (post as any).poll ? this.prisma.pollVote.findFirst({ where: { userId: requesterId, pollId: (post as any).poll.id } }) : Promise.resolve(null)
            ]);

            enrichedPost.userInteraction = {
                hasUpvoted: myInteractions.some((i) => i.type === 'UPVOTE'),
                hasDownvoted: myInteractions.some((i) => i.type === 'DOWNVOTE'),
                hasBookmarked: myInteractions.some((i) => i.type === 'BOOKMARK'),
                hasReshared: myInteractions.some((i) => i.type === 'RESHARE'),
            };

            if ((post as any).poll && pollVote) {
                (enrichedPost as any).poll.userHasVoted = true;
            }
        }

        // Increment view count (fire and forget)
        this.prisma.post.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => { });

        return enrichedPost;
    }

    // ─── Delete Post ──────────────────────────────────────────────────────────

    async delete(id: string, userId: string) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.authorId !== userId) throw new ForbiddenException('Not your post');

        await this.prisma.post.update({ where: { id }, data: { isDeleted: true } });
        
        // 🚀 Remove from Algolia
        this.algoliaService.deletePost(id).catch(() => {});

        return { message: 'Post deleted' };
    }

    // ─── Upvote Toggle ────────────────────────────────────────────────────────

    async toggleUpvote(postId: string, userId: string) {
        // Raw SQL check to bypass stale Prisma Client
        const existingArr: any[] = await this.prisma.$queryRawUnsafe(
            `SELECT id FROM "UserInteraction" WHERE "userId" = $1 AND "postId" = $2 AND "type" = 'UPVOTE' LIMIT 1`,
            userId, postId
        );

        const existing = existingArr[0];

        if (existing) {
            await this.prisma.$executeRawUnsafe(
                `DELETE FROM "UserInteraction" WHERE "userId" = $1 AND "postId" = $2 AND "type" = 'UPVOTE'`,
                userId, postId
            );
            return { upvoted: false };
        }

        // Remove any downvote first
        await this.prisma.$executeRawUnsafe(
            `DELETE FROM "UserInteraction" WHERE "userId" = $1 AND "postId" = $2 AND "type" = 'DOWNVOTE'`,
            userId, postId
        );

        // Insert new upvote - Generate ID in Node for safety
        const id = require('crypto').randomUUID();
        await this.prisma.$executeRawUnsafe(
            `INSERT INTO "UserInteraction" (id, type, "userId", "postId", "createdAt") 
             VALUES ($1, 'UPVOTE', $2, $3, NOW())`,
            id, userId, postId
        );

        // Notify Author (Real-time Handshake)
        this.prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } })
            .then(post => {
                if (post && post.authorId !== userId) {
                    this.notificationService.createNotification({
                        type: 'LIKE',
                        recipientId: post.authorId,
                        senderId: userId,
                        postId: postId,
                    }).catch(() => {});
                }
            })
            .catch(() => {});

        return { upvoted: true };
    }

    // ─── Downvote Toggle ──────────────────────────────────────────────────────

    async toggleDownvote(postId: string, userId: string) {
        // Raw SQL check
        const existingArr: any[] = await this.prisma.$queryRawUnsafe(
            `SELECT id FROM "UserInteraction" WHERE "userId" = $1 AND "postId" = $2 AND "type" = 'DOWNVOTE' LIMIT 1`,
            userId, postId
        );

        const existing = existingArr[0];

        if (existing) {
            await this.prisma.$executeRawUnsafe(
                `DELETE FROM "UserInteraction" WHERE "userId" = $1 AND "postId" = $2 AND "type" = 'DOWNVOTE'`,
                userId, postId
            );
            return { downvoted: false };
        }

        // Remove any upvote first
        await this.prisma.$executeRawUnsafe(
            `DELETE FROM "UserInteraction" WHERE "userId" = $1 AND "postId" = $2 AND "type" = 'UPVOTE'`,
            userId, postId
        );

        // Insert new downvote
        const id = require('crypto').randomUUID();
        await this.prisma.$executeRawUnsafe(
            `INSERT INTO "UserInteraction" (id, type, "userId", "postId", "createdAt") 
             VALUES ($1, 'DOWNVOTE', $2, $3, NOW())`,
            id, userId, postId
        );

        return { downvoted: true };
    }

    // ─── Poll Voting ──────────────────────────────────────────────────────────
    
    async votePoll(userId: string, pollId: string, optionId: string) {
        const poll = await this.prisma.poll.findUnique({
            where: { id: pollId },
            include: { options: true }
        });

        if (!poll) throw new NotFoundException('Poll not found');
        if (poll.endsAt && new Date() > poll.endsAt) {
            throw new ForbiddenException('This poll has ended');
        }

        // Check if already voted
        const existingVote = await this.prisma.pollVote.findFirst({
            where: { userId, pollId }
        });

        if (existingVote) {
            if (!poll.allowMultiple) {
                throw new ForbiddenException('You have already voted in this poll');
            }
            // If allowMultiple, check if they already voted for THIS option
            const specificVote = await this.prisma.pollVote.findFirst({
                where: { userId, pollId, optionId }
            });
            if (specificVote) {
                throw new ForbiddenException('You have already voted for this option');
            }
        }

        // Record the vote
        const vote = await this.prisma.pollVote.create({
            data: {
                userId,
                pollId,
                optionId
            }
        });

        return {
            success: true,
            vote,
            // If it's a quiz, return if they were correct
            isCorrect: poll.isQuiz ? poll.options.find(o => o.id === optionId)?.isCorrect : undefined
        };
    }

    // ─── Reshare Toggle ───────────────────────────────────────────────────────

    async toggleReshare(postId: string, userId: string) {
        // Find if user already has a pure reshare for this post
        const existingReshare = await this.prisma.post.findFirst({
            where: {
                authorId: userId,
                originalPostId: postId,
                contentType: 'RESHARE', // Pure reshare (no quote)
                isDeleted: false,
            },
        });

        if (existingReshare) {
            // Undo reshare
            await this.prisma.post.update({
                where: { id: existingReshare.id },
                data: { isDeleted: true },
            });
            // Remove interaction
            await this.prisma.userInteraction.deleteMany({
                where: { userId, postId, type: 'RESHARE' },
            });
            return { reshared: false };
        }

        // Verify original post exists
        const original = await this.prisma.post.findUnique({
            where: { id: postId, isDeleted: false },
        });
        if (!original) throw new NotFoundException('Post not found');

        // Create the reshare post
        const reshare = await this.prisma.post.create({
            data: {
                authorId: userId,
                originalPostId: postId,
                content: '',
                contentType: 'RESHARE',
            },
        });

        // Add interaction metric
        await this.prisma.userInteraction.create({
            data: { userId, postId, type: 'RESHARE' },
        });

        // Notify Author (Real-time Handshake)
        if (original.authorId !== userId) {
            this.notificationService.createNotification({
                type: 'MENTION', // Reusing MENTION for Reshares for now, or we can use a custom type if needed
                recipientId: original.authorId,
                senderId: userId,
                postId: reshare.id,
            }).catch(() => {});
        }

        return { reshared: true, post: reshare };
    }

    // ─── Bookmark Toggle ──────────────────────────────────────────────────────


    async toggleBookmark(postId: string, userId: string) {
        const existing = await this.prisma.userInteraction.findFirst({
            where: { userId, postId, type: 'BOOKMARK' },
        });

        if (existing) {
            await this.prisma.userInteraction.deleteMany({ where: { userId, postId, type: 'BOOKMARK' } });
            return { bookmarked: false };
        }

        await this.prisma.userInteraction.create({
            data: { userId, postId, type: 'BOOKMARK' },
        });

        return { bookmarked: true };
    }



    // ─── Get User Posts ───────────────────────────────────────────────────────

    async getUserPosts(userId: string, cursor?: string, limit = 20, requesterId?: string) {
        const isOwner = requesterId === userId;
        const isFriend = requesterId ? (await this.getSocialFilters(requesterId)).friendIds.includes(userId) : false;

        // Check if target user is private
        const targetUser = await this.prisma.user.findUnique({ where: { id: userId }, select: { privateAccount: true } });
        if (targetUser?.privateAccount && !isOwner && !isFriend) {
            return { posts: [], nextCursor: null, hasMore: false };
        }

        const posts = await this.prisma.post.findMany({
            where: { authorId: userId, isDeleted: false },
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true, privateAccount: true },
                },
                tribe: {
                    select: { id: true, name: true, slug: true },
                },
                originalPost: {
                    include: {
                        author: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                        },
                        tribe: {
                            select: { id: true, name: true, slug: true },
                        },
                        marketListing: {
                            include: {
                                seller: {
                                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                                },
                            }
                        },
                        kaoListing: {
                            include: {
                                author: {
                                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                                },
                            }
                        },
                    }
                },
                video: {
                    select: { id: true, title: true, isSpark: true, duration: true, playbackId: true, thumbnailUrl: true }
                },
                marketListing: {
                    include: {
                        seller: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                        },
                    }
                },
                kaoListing: {
                    include: {
                        author: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                        },
                    }
                },
                _count: { select: { comments: true, reshares: true, interactions: { where: { type: 'UPVOTE' } } } },
                event: true,
                poll: {
                    include: {
                        options: { 
                            orderBy: { sortOrder: 'asc' },
                            include: { _count: { select: { votes: true } } }
                        },
                        _count: { select: { votes: true } }
                    }
                },
            },
        });

        const hasMore = posts.length > limit;
        const data = hasMore ? posts.slice(0, limit) : posts;

        // Attach user's own interaction state if logged in
        let withInteractions = data;
        if (requesterId) {
            const ids = data.map((p) => p.id);
            const myInteractions = await this.prisma.userInteraction.findMany({
                where: { userId: requesterId, postId: { in: ids } },
            });

            withInteractions = data.map((post) => ({
                ...post,
                userInteraction: {
                    hasUpvoted: myInteractions.some((i) => i.postId === post.id && i.type === 'UPVOTE'),
                    hasDownvoted: myInteractions.some((i) => i.postId === post.id && i.type === 'DOWNVOTE'),
                    hasBookmarked: myInteractions.some((i) => i.postId === post.id && i.type === 'BOOKMARK'),
                    hasReshared: myInteractions.some((i) => i.postId === post.id && i.type === 'RESHARE'),
                },
            }));
        }

        return { 
            posts: withInteractions, 
            nextCursor: hasMore ? data[data.length - 1].id : null, 
            hasMore 
        };
    }

    // ─── Pinning Logic ───────────────────────────────────────────────────────

    async togglePin(postId: string, userId: string, shouldPin = true) {
        if (shouldPin) {
            const currentPinned = await this.prisma.post.count({
                where: { authorId: userId, isPinned: true, isDeleted: false }
            });
            if (currentPinned >= 3) {
                // For a premium feel, we might want to unpin the oldest one, 
                // but for now let's just enforce the limit.
                throw new Error('You can only pin up to 3 posts');
            }
        }

        return this.prisma.post.update({
            where: { id: postId, authorId: userId },
            data: { isPinned: shouldPin }
        });
    }

    // ─── Video Finalization ──────────────────────────────────────────────────

    async createFromVideo(userId: string, videoId: string, customContent?: string) {
        const video = await this.prisma.video.findUnique({
            where: { id: videoId, authorId: userId }
        });

        if (!video) throw new Error('Video not found');

        // Check if a post already exists for this video to prevent duplicates
        const existingPost = await this.prisma.post.findFirst({
            where: { videoId: video.id }
        });
        if (existingPost) return existingPost;

        // Create the Post entity
        const post = await this.prisma.post.create({
            data: {
                authorId: userId,
                content: customContent || video.description || '',
                contentType: 'VIDEO',
                videoId: video.id, // Linking directly for Silo performance
                media: {
                    type: 'video',
                    videoId: video.id,
                    playbackId: video.playbackId,
                    title: video.title
                } as any,
            },
            include: {
                author: { select: { id: true, username: true, fullName: true, avatar: true, isVerified: true } },
                _count: { select: { comments: true, interactions: true } }
            }
        });

        // 🚀 Index in Algolia
        this.algoliaService.indexPost(post).catch(() => {});

        // Update video status to ready if it wasn't yet (optimistic)
        await this.prisma.video.update({
            where: { id: video.id },
            data: { status: 'ready' }
        });

        // 🚀 Mux Ingestion DECOMMISSIONED: We now play directly from R2
        // this.videoService.createMuxAsset(video.id).catch(() => {});

        return post;
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private async getSocialFilters(userId: string) {
        const [blocks, mutes, following, followers] = await Promise.all([
            this.prisma.block.findMany({
                where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
                select: { blockerId: true, blockedId: true }
            }),
            this.prisma.mute.findMany({
                where: { muterId: userId },
                select: { mutedId: true }
            }),
            this.prisma.follow.findMany({
                where: { followerId: userId },
                select: { followedId: true }
            }),
            this.prisma.follow.findMany({
                where: { followedId: userId },
                select: { followerId: true }
            })
        ]);

        const blockedIds = blocks.map(b => b.blockerId === userId ? b.blockedId : b.blockerId);
        const mutedIds = mutes.map(m => m.mutedId);
        const followingIds = following.map(f => f.followedId);
        const followerIds = followers.map(f => f.followerId);
        const friendIds = followingIds.filter(id => followerIds.includes(id));

        return { blockedIds, mutedIds, followingIds, friendIds };
    }
    async getTribePosts(tribeId: string, cursor?: string, limit: number = 20, requesterId?: string) {
        const posts = await this.prisma.post.findMany({
            where: {
                tribeId,
                isDeleted: false,
            },
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, countyId: true, subCounty: true, institution: true, accountType: true, isReserved: true },
                },
                tribe: {
                    select: { id: true, name: true, slug: true },
                },
                video: {
                    select: { id: true, title: true, isSpark: true, duration: true, playbackId: true, thumbnailUrl: true, videoUrl: true }
                },
                _count: {
                    select: { 
                        comments: true, 
                        interactions: { where: { type: 'UPVOTE' } }, 
                        reshares: true 
                    },
                },
                event: true,
                poll: {
                    include: {
                        options: { 
                            orderBy: { sortOrder: 'asc' },
                            include: { _count: { select: { votes: true } } }
                        },
                        _count: { select: { votes: true } }
                    }
                },
            },
        });

        const hasMore = posts.length > limit;
        const data = hasMore ? posts.slice(0, limit) : posts;

        // Attach user's own interaction state if logged in
        let withInteractions = data.map((p: any) => ({
            ...p,
            userInteraction: {
                hasUpvoted: false,
                hasDownvoted: false,
                hasBookmarked: false,
                hasReshared: false,
            },
            interactionCount: p._count.interactions,
            commentCount: p._count.comments,
            reshareCount: p._count.reshares
        }));

        if (requesterId) {
            const ids = data.map((p) => p.id);
            const pollIds = data.filter(p => p.poll).map(p => p.poll!.id);

            const [myInteractions, myPollVotes] = await Promise.all([
                this.prisma.userInteraction.findMany({
                    where: { userId: requesterId, postId: { in: ids } },
                }),
                pollIds.length > 0 ? this.prisma.pollVote.findMany({
                    where: { userId: requesterId, pollId: { in: pollIds } }
                }) : Promise.resolve([] as any[])
            ]);

            withInteractions = withInteractions.map((post) => {
                const enriched = {
                    ...post,
                    userInteraction: {
                        hasUpvoted: myInteractions.some((i) => i.postId === post.id && i.type === 'UPVOTE'),
                        hasDownvoted: myInteractions.some((i) => i.postId === post.id && i.type === 'DOWNVOTE'),
                        hasBookmarked: myInteractions.some((i) => i.postId === post.id && i.type === 'BOOKMARK'),
                        hasReshared: myInteractions.some((i) => i.postId === post.id && i.type === 'RESHARE'),
                    },
                };
                if (post.poll && myPollVotes.some((v: any) => v.pollId === post.poll!.id)) {
                    (enriched.poll as any).userHasVoted = true;
                }
                return enriched;
            });
        }

        return {
            posts: withInteractions,
            nextCursor: hasMore ? data[data.length - 1].id : null,
            hasMore
        };
    }
}
