import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateCommentDto, GetCommentsQueryDto, CommentTargetType, CommentSortBy } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService
  ) {}

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

  async create(userId: string, dto: CreateCommentDto) {
    const data: any = {
      content: dto.content,
      media: dto.media ? (dto.media as any) : null,
      authorId: userId,
      targetType: dto.targetType,
      parentId: dto.parentId || null,
    };

    // Strict validation
    if (dto.targetType === CommentTargetType.POST) {
      const post = await this.prisma.post.findUnique({ where: { id: dto.targetId } });
      if (!post) throw new NotFoundException('Post not found');
      data.postId = dto.targetId;
    } else if (dto.targetType === CommentTargetType.MARKET_LISTING) {
      const listing = await this.prisma.marketListing.findUnique({ where: { id: dto.targetId } });
      if (!listing) throw new NotFoundException('Market listing not found');
      data.marketListingId = dto.targetId;
    } else if (dto.targetType === CommentTargetType.KAO_LISTING) {
      const listing = await this.prisma.kaoListing.findUnique({ where: { id: dto.targetId } });
      if (!listing) throw new NotFoundException('Kao listing not found');
      data.kaoListingId = dto.targetId;
    }

    const comment = await this.prisma.comment.create({
      data,
      include: {
        author: {
          select: { id: true, username: true, fullName: true, avatar: true, isVerified: true },
        },
      },
    });

    // 💡 NOTIFICATIONS (Real-time Handshake)
    // 1. If it's a reply, notify the parent comment's author
    if (dto.parentId) {
      this.prisma.comment.findUnique({ where: { id: dto.parentId }, select: { authorId: true } })
        .then(parent => {
          if (parent && parent.authorId !== userId) {
            this.notificationService.createNotification({
              type: 'COMMENT',
              recipientId: parent.authorId,
              senderId: userId,
              commentId: comment.id,
            }).catch(() => {});
          }
        }).catch(() => {});
    } 
    // 2. If it's a direct comment on a post, notify the post author
    else if (dto.targetType === CommentTargetType.POST) {
      this.prisma.post.findUnique({ where: { id: dto.targetId }, select: { authorId: true } })
        .then(post => {
          if (post && post.authorId !== userId) {
            this.notificationService.createNotification({
              type: 'COMMENT',
              recipientId: post.authorId,
              senderId: userId,
              postId: dto.targetId,
              commentId: comment.id,
            }).catch(() => {});
          }
        }).catch(() => {});
    }

    return comment;
  }

  async getComments(query: GetCommentsQueryDto, requesterId?: string) {
    const limit = 10;
    const where: any = {
      isDeleted: false,
      parentId: null,
    };

    if (query.targetType === CommentTargetType.POST) {
      where.postId = query.targetId;
    } else if (query.targetType === CommentTargetType.MARKET_LISTING) {
      where.marketListingId = query.targetId;
    } else if (query.targetType === CommentTargetType.KAO_LISTING) {
      where.kaoListingId = query.targetId;
    }

    const { friendIds, blockedIds, mutedIds } = requesterId 
      ? await this.getSocialFilters(requesterId) 
      : { friendIds: [], blockedIds: [], mutedIds: [] };

    where.authorId = { notIn: [...blockedIds, ...mutedIds] };
    where.AND = [
      {
        OR: [
          { author: { privateAccount: false } },
          { authorId: requesterId },
          { authorId: { in: friendIds } }
        ]
      }
    ];

    let orderBy: any = { createdAt: 'desc' };
    if (query.sortBy === CommentSortBy.LOVED) {
      orderBy = { interactions: { _count: 'desc' } };
    }

    // For RANDOM sorting, we use a different approach
    if (query.sortBy === CommentSortBy.RANDOM) {
      // In a real production apps, we might use a random seed or a smarter shuffle.
      // For now, we'll randomize by ID (simple deterministic pseudo-random) or just default to recent if it's too heavy.
      orderBy = { id: 'asc' }; // placeholder for random logic
    }

    const comments = await this.prisma.comment.findMany({
      where,
      take: limit + 1,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      orderBy: query.sortBy === CommentSortBy.RANDOM ? undefined : orderBy,
      include: {
        author: {
          select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, privateAccount: true },
        },
        _count: {
          select: { 
            replies: true, 
            interactions: { where: { type: 'UPVOTE' } } 
          },
        },
        // Fetch first 2 replies inline
        replies: {
          where: { isDeleted: false },
          take: 2,
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, privateAccount: true },
            },
            _count: {
              select: { interactions: { where: { type: 'UPVOTE' } } }
            }
          },
        },
      },
    });

    const hasMore = comments.length > limit;
    const data = hasMore ? comments.slice(0, limit) : comments;

    // Attach interaction status
    let enriched = data;
    if (requesterId) {
      const ids = data.map(c => c.id);
      const myHearts = await this.prisma.userInteraction.findMany({
        where: { userId: requesterId, commentId: { in: ids }, type: 'UPVOTE' }
      });

      enriched = data.map(c => ({
        ...c,
        userInteraction: {
          hasHearted: myHearts.some(h => h.commentId === c.id)
        }
      }));
    }

    return {
      comments: enriched,
      nextCursor: hasMore ? data[data.length - 1].id : null,
      hasMore
    };
  }

  async getReplies(parentId: string, requesterId?: string) {
    const { friendIds, blockedIds, mutedIds } = requesterId 
      ? await this.getSocialFilters(requesterId) 
      : { friendIds: [], blockedIds: [], mutedIds: [] };

    const replies = await this.prisma.comment.findMany({
      where: { 
        parentId, 
        isDeleted: false,
        authorId: { notIn: [...blockedIds, ...mutedIds] },
        AND: [
          {
            OR: [
              { author: { privateAccount: false } },
              { authorId: requesterId },
              { authorId: { in: friendIds } }
            ]
          }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, username: true, fullName: true, avatar: true, isVerified: true, privateAccount: true },
        },
        _count: {
          select: { 
            replies: true,
            interactions: { where: { type: 'UPVOTE' } }
          },
        },
      },
    });

    let enriched = replies;
    if (requesterId) {
      const myHearts = await this.prisma.userInteraction.findMany({
        where: { userId: requesterId, commentId: { in: replies.map(r => r.id) }, type: 'UPVOTE' }
      });

      enriched = replies.map(r => ({
        ...r,
        userInteraction: {
          hasHearted: myHearts.some(h => h.commentId === r.id)
        }
      }));
    }

    return enriched;
  }

  async toggleHeart(commentId: string, userId: string) {
    const existing = await this.prisma.userInteraction.findFirst({
      where: { userId, commentId, type: 'UPVOTE' }
    });

    if (existing) {
      await this.prisma.userInteraction.delete({ where: { id: existing.id } });
      return { hearted: false };
    }

    const heart = await this.prisma.userInteraction.create({
      data: { userId, commentId, type: 'UPVOTE' }
    });

    // Notify Comment Author (Real-time Handshake)
    this.prisma.comment.findUnique({ where: { id: commentId }, select: { authorId: true } })
      .then(comment => {
        if (comment && comment.authorId !== userId) {
          this.notificationService.createNotification({
            type: 'LIKE',
            recipientId: comment.authorId,
            senderId: userId,
            commentId: commentId,
          }).catch(() => {});
        }
      }).catch(() => {});

    return { hearted: true };
  }

  async delete(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId) throw new BadRequestException('Not your comment');

    await this.prisma.comment.update({
      where: { id: commentId },
      data: { isDeleted: true },
    });

    return { success: true };
  }
}
