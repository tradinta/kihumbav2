import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AblyService } from '../utils/ably.service';
import { CreateRoomDto, SendMessageDto } from './chat.dto';
import { ChatRole, ChatRoomType } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private ably: AblyService
  ) {}

  async getAblyToken(userId: string) {
    return this.ably.createTokenRequest(userId);
  }

  async getMyRooms(userId: string) {
    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatar: true,
                isVerified: true,
                subscriptionTier: true,
                accountType: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return rooms.map(room => ({
      ...room,
      lastMessage: room.messages[0] || null
    }));
  }

  async createRoom(creatorId: string, dto: CreateRoomDto) {
    // If it's a DM, check if it already exists
    if (dto.type === ChatRoomType.DM) {
      const otherUserId = dto.participants[0];
      const existing = await this.prisma.chatRoom.findFirst({
        where: {
          type: ChatRoomType.DM,
          AND: [
            { participants: { some: { userId: creatorId } } },
            { participants: { some: { userId: otherUserId } } }
          ]
        }
      });
      if (existing) return existing;
    }

    const room = await this.prisma.chatRoom.create({
      data: {
        name: dto.name,
        type: dto.type,
        description: dto.description,
        slug: dto.slug,
        avatar: dto.avatar,
        metadata: dto.metadata || (dto.type === ChatRoomType.DM ? {
          isRequest: true,
          status: 'PENDING',
          initiatedBy: creatorId
        } : {
          privacy: 'PUBLIC',
          memberLimit: 100
        }),
        participants: {
          create: [
            { userId: creatorId, role: ChatRole.OWNER },
            ...dto.participants.map(id => ({ userId: id, role: ChatRole.MEMBER }))
          ]
        }
      },
      include: { participants: true }
    });

    // Check if we should auto-accept the request (if already following)
    if (dto.type === ChatRoomType.DM) {
        const otherUserId = dto.participants[0];
        const following = await this.prisma.follow.findUnique({
            where: { followerId_followedId: { followerId: otherUserId, followedId: creatorId } }
        });

        if (following) {
            await this.prisma.chatRoom.update({
                where: { id: room.id },
                data: { metadata: { isRequest: false, status: 'ACCEPTED' } }
            });
        }
    }

    // Artificial processing delay to ensure DB consistency across distributed layers
    await new Promise(resolve => setTimeout(resolve, 800));

    return room;
  }

  async getRoom(userId: string, roomIdOrSlug: string) {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        OR: [
          { id: roomIdOrSlug },
          { slug: roomIdOrSlug }
        ]
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatar: true,
                isVerified: true
              }
            }
          }
        }
      }
    });

    if (!room) throw new NotFoundException('Secure channel not found');

    // Check if user is a participant
    const isParticipant = room.participants.some(p => p.userId === userId);
    if (!isParticipant) throw new ForbiddenException('Access denied to this channel');

    return room;
  }

  async updateRoom(userId: string, roomId: string, dto: any) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { participants: true }
    });

    if (!room) throw new NotFoundException('Secure channel not found');

    // Check if user is an admin or owner
    const participant = room.participants.find(p => p.userId === userId);
    if (!participant || (participant.role !== 'OWNER' && participant.role !== 'ADMIN')) {
      throw new ForbiddenException('Only admins can update group identity');
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.avatar !== undefined) updateData.avatar = dto.avatar;
    if (dto.cover !== undefined) {
      updateData.metadata = {
        ...(room.metadata as any || {}),
        cover: dto.cover
      };
    }

    return this.prisma.chatRoom.update({
      where: { id: roomId },
      data: updateData
    });
  }

  async rotateRoomSlug(userId: string, roomId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { participants: true }
    });

    if (!room) throw new NotFoundException('Secure channel not found');

    const participant = room.participants.find(p => p.userId === userId);
    if (!participant || (participant.role !== 'OWNER' && participant.role !== 'ADMIN')) {
      throw new ForbiddenException('Only admins can rotate group links');
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newSlug = '';
    for (let i = 0; i < 8; i++) {
      newSlug += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { slug: newSlug }
    });
  }

  async getRoomPreview(slug: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    if (!room) throw new NotFoundException('Group invitation not found');

    const meta = room.metadata as any;
    return {
      id: room.id,
      name: room.name,
      avatar: room.avatar,
      description: room.description,
      participantCount: room._count.participants,
      privacy: meta?.privacy || 'PUBLIC',
      memberLimit: meta?.memberLimit || 500,
      isFull: room._count.participants >= (meta?.memberLimit || 500)
    };
  }

  async joinRoom(userId: string, roomId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        participants: true,
        joinRequests: {
          where: { userId }
        }
      }
    });

    if (!room) throw new NotFoundException('Group not found');

    // Check if already a member
    if (room.participants.some(p => p.userId === userId)) {
      return { status: 'ALREADY_MEMBER', roomId: room.id };
    }

    const meta = room.metadata as any;
    const isPrivate = meta?.privacy === 'PRIVATE';
    const memberLimit = meta?.memberLimit || 500;

    if (room.participants.length >= memberLimit) {
      throw new ForbiddenException('Group is at full capacity');
    }

    if (isPrivate) {
      // Check if already requested
      if (room.joinRequests.length > 0) {
        return { status: 'REQUEST_PENDING', roomId: room.id };
      }

      await this.prisma.joinRequest.create({
        data: { roomId, userId }
      });
      return { status: 'REQUEST_SENT', roomId: room.id };
    }

    // Public group - join immediately
    await this.prisma.participant.create({
      data: {
        roomId,
        userId,
        role: 'MEMBER'
      }
    });

    return { status: 'JOINED', roomId: room.id };
  }

  async leaveRoom(userId: string, roomId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { participants: true }
    });

    if (!room) throw new NotFoundException('Group not found');

    const participant = room.participants.find(p => p.userId === userId);
    if (!participant) throw new NotFoundException('Not a member of this group');

    if (participant.role === 'OWNER') {
      throw new ForbiddenException('Owners cannot leave. Please transfer ownership or delete the group.');
    }

    await this.prisma.participant.delete({
      where: {
        userId_roomId: { userId, roomId }
      }
    });

    return { success: true };
  }

  async getJoinRequests(userId: string, roomId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        participants: true,
        joinRequests: {
          where: { status: 'PENDING' },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatar: true,
                subscriptionTier: true,
                accountType: true,
                isVerified: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!room) throw new NotFoundException('Group not found');

    const participant = room.participants.find(p => p.userId === userId);
    if (!participant || (participant.role !== 'OWNER' && participant.role !== 'ADMIN')) {
      throw new ForbiddenException('Only admins can view join requests');
    }

    return room.joinRequests;
  }

  async resolveJoinRequest(userId: string, requestId: string, status: 'ACCEPTED' | 'REJECTED') {
    const request = await this.prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: {
        room: {
          include: { participants: true }
        }
      }
    });

    if (!request) throw new NotFoundException('Join request not found');

    const participant = request.room.participants.find(p => p.userId === userId);
    if (!participant || (participant.role !== 'OWNER' && participant.role !== 'ADMIN')) {
      throw new ForbiddenException('Only admins can resolve join requests');
    }

    if (status === 'ACCEPTED') {
      // Create participant
      await this.prisma.participant.create({
        data: {
          roomId: request.roomId,
          userId: request.userId,
          role: 'MEMBER'
        }
      });
    }

    return this.prisma.joinRequest.update({
      where: { id: requestId },
      data: { status }
    });
  }

  async getParticipants(userId: string, roomId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatar: true,
                isVerified: true,
                subscriptionTier: true,
                accountType: true
              }
            }
          }
        }
      }
    });

    if (!room) throw new NotFoundException('Secure channel not found');
    
    const isParticipant = room.participants.some(p => p.userId === userId);
    if (!isParticipant) throw new ForbiddenException('Access denied to this channel');

    return room.participants.map(p => ({
      id: p.userId,
      name: p.user?.fullName || 'User',
      username: p.user?.username || '',
      avatar: p.user?.avatar || '',
      isVerified: !!p.user?.isVerified,
      subscriptionTier: p.user?.subscriptionTier || 'FREE',
      accountType: p.user?.accountType || 'NORMAL',
      role: p.role
    }));
  }

  async getRoomMessages(roomIdOrSlug: string, userId: string) {
    // First resolve the room ID if a slug is provided
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        OR: [
          { id: roomIdOrSlug },
          { slug: roomIdOrSlug }
        ]
      },
      select: { id: true }
    });

    if (!room) throw new NotFoundException('Secure channel not found');
    const roomId = room.id;

    const messages = await this.prisma.chatMessage.findMany({
      where: { roomId },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
            isVerified: true,
            subscriptionTier: true,
            accountType: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Fetch banned users in this room to apply placeholder logic
    const bannedParticipants = await this.prisma.participant.findMany({
      where: { roomId, isBanned: true },
      select: { userId: true }
    });
    const bannedUserIds = new Set(bannedParticipants.map(p => p.userId));

    return messages
      .filter(m => {
        const meta = (m.metadata as any) || {};
        const hiddenFor = meta.hiddenFor || [];
        return !hiddenFor.includes(userId);
      })
      .map(m => {
      if (bannedUserIds.has(m.senderId)) {
        return {
          ...m,
          content: 'This message is from a banned user',
          metadata: {},
          isBannedContent: true
        };
      }
      return m;
    });
  }

  async sendMessage(userId: string, roomIdOrSlug: string, dto: SendMessageDto) {
    const room = await this.prisma.chatRoom.findFirst({
      where: { OR: [{ id: roomIdOrSlug }, { slug: roomIdOrSlug }] },
      select: { id: true }
    });
    if (!room) throw new NotFoundException('Secure channel not found');
    const roomId = room.id;

    const participant = await this.prisma.participant.findUnique({
      where: { userId_roomId: { userId, roomId } }
    });
    if (!participant) throw new ForbiddenException('Not a member of this room');

    const message = await this.prisma.chatMessage.create({
      data: {
        content: dto.content,
        type: dto.type || 'TEXT',
        metadata: (dto.metadata as any) || {},
        senderId: userId,
        roomId: roomId,
        replyToId: dto.replyToId
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            isVerified: true
          }
        }
      }
    });

    // Notify via Ably
    await this.ably.publishToRoom(roomId, 'message.created', message);

    // Global Notifications: Notify all participants on their private channels
    const participants = await this.prisma.participant.findMany({
      where: { roomId },
      select: { userId: true }
    });

    for (const p of participants) {
      if (p.userId !== userId) {
        // We use a general 'notifications' channel for each user
        await this.ably.publishToRoom(`user:${p.userId}`, 'notification.message', {
          roomId,
          message: {
            id: message.id,
            content: message.content,
            senderName: message.sender.fullName,
            senderAvatar: message.sender.avatar
          }
        });
      }
    }

    // Update room timestamp
    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() }
    });

    return message;
  }

  async deleteMessage(userId: string, roomIdOrSlug: string, messageId: string, mode: 'ME' | 'EVERYONE' = 'ME') {
    const room = await this.prisma.chatRoom.findFirst({
      where: { OR: [{ id: roomIdOrSlug }, { slug: roomIdOrSlug }] },
      select: { id: true }
    });
    if (!room) throw new NotFoundException('Secure channel not found');
    const roomId = room.id;

    const participant = await this.prisma.participant.findUnique({
      where: { userId_roomId: { userId, roomId } }
    });
    
    if (!participant) throw new ForbiddenException();

    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId }
    });
    if (!message) throw new NotFoundException();

    // Check permissions
    const isSender = message.senderId === userId;
    const isStaff = (participant.role as string) !== 'MEMBER';

    if (mode === 'EVERYONE') {
      if (!isSender && !isStaff) {
        throw new ForbiddenException('Only the sender or an admin can delete for everyone');
      }

      // Soft-delete: Keep the record but clear content/metadata
      await this.prisma.chatMessage.update({
        where: { id: messageId },
        data: {
          content: 'Message deleted',
          isDeleted: true,
          metadata: {}
        }
      });
      // Notify Ably with the new state
      await this.ably.publishToRoom(roomId, 'message.deleted', { messageId, soft: true });
    } else {
      // mode === 'ME'
      // Anyone in the room can hide a message from their own view
      const meta = (message.metadata as any) || {};
      const hiddenFor = meta.hiddenFor || [];
      
      if (!hiddenFor.includes(userId)) {
        await this.prisma.chatMessage.update({
          where: { id: messageId },
          data: {
            metadata: {
              ...meta,
              hiddenFor: [...hiddenFor, userId]
            }
          }
        });
      }
      
      // We don't notify Ably for "Delete for Me" as it's a private view change
      // But we return success so the frontend can remove it from local state
    }

    return { id: messageId, deleted: true, mode };
  }

  async acceptRoom(userId: string, roomIdOrSlug: string) {
    const room = await this.prisma.chatRoom.findFirst({
      where: { OR: [{ id: roomIdOrSlug }, { slug: roomIdOrSlug }] }
    });
    if (!room) throw new NotFoundException('Secure channel not found');
    const roomId = room.id;

    const participant = await this.prisma.participant.findUnique({
      where: { userId_roomId: { userId, roomId } }
    });
    if (!participant) throw new ForbiddenException();

    const metadata = (room.metadata as any) || {};
    if (metadata.initiatedBy === userId) {
      throw new ForbiddenException('You cannot accept your own request');
    }

    return this.prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        metadata: {
          ...metadata,
          isRequest: false,
          status: 'ACCEPTED',
          acceptedAt: new Date()
        }
      }
    });
  }

  async startAnonRoom(userId: string) {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    return this.prisma.chatRoom.create({
      data: {
        name: 'Anonymous Chat',
        type: ChatRoomType.ANON,
        metadata: { inviteCode: code, status: 'WAITING' },
        participants: {
          create: [{ userId, role: ChatRole.OWNER }]
        }
      }
    });
  }

  async joinAnonRoom(userId: string, code: string) {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        type: ChatRoomType.ANON,
        metadata: { path: ['inviteCode'], equals: code.toUpperCase() }
      }
    });
    if (!room) throw new NotFoundException('Invalid or expired code');
    
    // Check if already in
    const existing = await this.prisma.participant.findUnique({
      where: { userId_roomId: { userId, roomId: room.id } }
    });
    if (existing) return room;

    return this.prisma.chatRoom.update({
      where: { id: room.id },
      data: {
        metadata: { ...((room.metadata as any) || {}), status: 'ACTIVE' },
        participants: {
          create: [{ userId, role: ChatRole.MEMBER }]
        }
      }
    });
  }

  async archiveRoom(userId: string, roomId: string, archive: boolean) {
    return this.prisma.participant.update({
      where: {
        userId_roomId: { userId, roomId }
      },
      data: { isArchived: archive }
    });
  }

  async deleteRoom(userId: string, roomId: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { userId_roomId: { userId, roomId } }
    });
    if (!participant) throw new ForbiddenException();

    // In a production environment, we might want to check if they are the OWNER
    // but for now, any participant can "delete" (leave/wipe) the room for everyone 
    // if it's a DM, or just leave if it's a group.
    
    return this.prisma.chatRoom.delete({
      where: { id: roomId }
    });
  }

  async banMember(adminId: string, roomId: string, targetUserId: string) {
    const admin = await this.prisma.participant.findUnique({
      where: { userId_roomId: { userId: adminId, roomId } }
    });
    if (!admin || admin.role === 'MEMBER') throw new ForbiddenException('Admin powers required');

    await this.prisma.participant.update({
      where: { userId_roomId: { userId: targetUserId, roomId } },
      data: { isBanned: true }
    });

    await this.ably.publishToRoom(roomId, 'member.banned', { userId: targetUserId });
    return { success: true };
  }

  async muteMember(adminId: string, roomId: string, targetUserId: string, until: Date) {
    const admin = await this.prisma.participant.findUnique({
      where: { userId_roomId: { userId: adminId, roomId } }
    });
    if (!admin || admin.role === 'MEMBER') throw new ForbiddenException('Admin powers required');

    await this.prisma.participant.update({
      where: { userId_roomId: { userId: targetUserId, roomId } },
      data: { mutedUntil: until }
    });

    await this.ably.publishToRoom(roomId, 'member.muted', { userId: targetUserId, until });
    return { success: true };
  }
}
