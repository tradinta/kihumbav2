import {
    Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, CreateCommentDto } from './post.dto';

const POST_SELECT = (userId?: string) => ({
    id: true,
    content: true,
    imageUrl: true,
    contentType: true,
    isPinned: true,
    viewCount: true,
    createdAt: true,
    author: {
        select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            tier: true,
            isVerified: true,
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
    constructor(private prisma: PrismaService) { }

    // ─── Create Post ──────────────────────────────────────────────────────────

    async create(userId: string, dto: CreatePostDto) {
        const post = await this.prisma.post.create({
            data: {
                content: dto.content,
                imageUrl: dto.imageUrl || null,
                contentType: (dto.contentType as any) || 'TEXT',
                authorId: userId,
            },
            include: {
                author: {
                    select: { id: true, username: true, fullName: true, avatar: true, tier: true, isVerified: true },
                },
                _count: { select: { comments: true, interactions: true } },
            },
        });
        return post;
    }

    // ─── Get Feed (cursor pagination) ─────────────────────────────────────────

    async getFeed(requesterId?: string, cursor?: string, limit = 20) {
        // Get IDs of users this person has blocked or been blocked by
        const blockedIds = requesterId
            ? await this.getBlockedIds(requesterId)
            : [];

        const posts = await this.prisma.post.findMany({
            where: {
                isDeleted: false,
                authorId: { notIn: blockedIds },
            },
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, username: true, fullName: true, avatar: true, tier: true, isVerified: true },
                },
                _count: {
                    select: {
                        comments: true,
                        interactions: { where: { type: 'UPVOTE' } },
                    },
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
                    select: { id: true, username: true, fullName: true, avatar: true, tier: true, isVerified: true },
                },
                _count: {
                    select: {
                        comments: true,
                        interactions: { where: { type: 'UPVOTE' } },
                    },
                },
                comments: {
                    where: { isDeleted: false, parentId: null },
                    orderBy: { createdAt: 'asc' },
                    include: {
                        author: {
                            select: { id: true, username: true, fullName: true, avatar: true, isVerified: true },
                        },
                        replies: {
                            where: { isDeleted: false },
                            orderBy: { createdAt: 'asc' },
                            include: {
                                author: {
                                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true },
                                },
                                _count: { select: { replies: true } },
                            },
                        },
                        _count: { select: { replies: true } },
                    },
                },
            },
        });

        if (!post) throw new NotFoundException('Post not found');

        // Increment view count (fire and forget)
        this.prisma.post.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => { });

        return post;
    }

    // ─── Delete Post ──────────────────────────────────────────────────────────

    async delete(id: string, userId: string) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.authorId !== userId) throw new ForbiddenException('Not your post');

        await this.prisma.post.update({ where: { id }, data: { isDeleted: true } });
        return { message: 'Post deleted' };
    }

    // ─── Upvote Toggle ────────────────────────────────────────────────────────

    async toggleUpvote(postId: string, userId: string) {
        const existing = await this.prisma.userInteraction.findFirst({
            where: { userId, postId, type: 'UPVOTE' },
        });

        if (existing) {
            await this.prisma.userInteraction.deleteMany({ where: { userId, postId, type: 'UPVOTE' } });
            return { upvoted: false };
        }

        // Remove any downvote first
        await this.prisma.userInteraction.deleteMany({ where: { userId, postId, type: 'DOWNVOTE' } });

        await this.prisma.userInteraction.create({
            data: { userId, postId, type: 'UPVOTE' },
        });

        return { upvoted: true };
    }

    // ─── Downvote Toggle ──────────────────────────────────────────────────────

    async toggleDownvote(postId: string, userId: string) {
        const existing = await this.prisma.userInteraction.findFirst({
            where: { userId, postId, type: 'DOWNVOTE' },
        });

        if (existing) {
            await this.prisma.userInteraction.deleteMany({ where: { userId, postId, type: 'DOWNVOTE' } });
            return { downvoted: false };
        }

        // Remove any upvote first
        await this.prisma.userInteraction.deleteMany({ where: { userId, postId, type: 'UPVOTE' } });

        await this.prisma.userInteraction.create({
            data: { userId, postId, type: 'DOWNVOTE' },
        });

        return { downvoted: true };
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

    // ─── Add Comment ──────────────────────────────────────────────────────────

    async addComment(postId: string, userId: string, dto: CreateCommentDto) {
        const post = await this.prisma.post.findFirst({ where: { id: postId, isDeleted: false } });
        if (!post) throw new NotFoundException('Post not found');

        const comment = await this.prisma.comment.create({
            data: {
                content: dto.content,
                authorId: userId,
                postId,
                parentId: dto.parentId || null,
            },
            include: {
                author: {
                    select: { id: true, username: true, fullName: true, avatar: true, isVerified: true },
                },
                _count: { select: { replies: true } },
            },
        });

        // Notify post author (non-fatal)
        if (post.authorId !== userId) {
            await this.prisma.notification.create({
                data: {
                    type: 'COMMENT',
                    recipientId: post.authorId,
                    senderId: userId,
                    postId,
                    commentId: comment.id,
                },
            }).catch(() => { });
        }

        return comment;
    }

    // ─── Delete Comment ───────────────────────────────────────────────────────

    async deleteComment(commentId: string, userId: string) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.authorId !== userId) throw new ForbiddenException('Not your comment');

        await this.prisma.comment.update({ where: { id: commentId }, data: { isDeleted: true } });
        return { message: 'Comment deleted' };
    }

    // ─── Get User Posts ───────────────────────────────────────────────────────

    async getUserPosts(userId: string, cursor?: string, limit = 20) {
        const posts = await this.prisma.post.findMany({
            where: { authorId: userId, isDeleted: false },
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, username: true, fullName: true, avatar: true, tier: true, isVerified: true },
                },
                _count: { select: { comments: true, interactions: { where: { type: 'UPVOTE' } } } },
            },
        });

        const hasMore = posts.length > limit;
        const data = hasMore ? posts.slice(0, limit) : posts;
        return { posts: data, nextCursor: hasMore ? data[data.length - 1].id : null, hasMore };
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private async getBlockedIds(userId: string): Promise<string[]> {
        const blocks = await this.prisma.block.findMany({
            where: {
                OR: [{ blockerId: userId }, { blockedId: userId }],
            },
        });
        return blocks.map((b) => (b.blockerId === userId ? b.blockedId : b.blockerId));
    }
}
