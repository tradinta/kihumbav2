import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AblyService } from '../utils/ably.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private ably: AblyService,
  ) {}

  /**
   * Creates a notification and pulses it via Ably for real-time delivery.
   */
  async createNotification(data: {
    type: NotificationType;
    recipientId: string;
    senderId?: string;
    postId?: string;
    commentId?: string;
  }) {
    // 1. Persist to Database
    const notification = await this.prisma.notification.create({
      data: {
        type: data.type,
        recipientId: data.recipientId,
        senderId: data.senderId,
        postId: data.postId,
        commentId: data.commentId,
      },
      include: {
        sender: {
          select: { id: true, username: true, fullName: true, avatar: true, isVerified: true },
        },
      },
    });

    // 2. Pulse via Ably (Real-time Handshake)
    // We use a specific channel format for user-specific social pulses
    const channelName = `user:${data.recipientId}:notifications`;
    
    // We don't await this to keep the main interaction fast
    this.ably.publishToRoom(data.recipientId, 'notification', notification).catch(err => {
      console.error('Failed to pulse notification via Ably:', err);
    });

    // Note: I'm reusing publishToRoom but technically it sends to any channel. 
    // I might optimize AblyService for specific user channels later.

    return notification;
  }

  async getNotifications(userId: string, cursor?: string, limit = 20) {
    const notifications = await this.prisma.notification.findMany({
      where: { recipientId: userId },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, username: true, fullName: true, avatar: true, isVerified: true },
        },
      },
    });

    const hasMore = notifications.length > limit;
    const data = hasMore ? notifications.slice(0, limit) : notifications;

    return {
      notifications: data,
      nextCursor: hasMore ? data[data.length - 1].id : null,
      hasMore,
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, recipientId: userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    });
  }
}
