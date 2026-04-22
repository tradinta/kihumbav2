import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FireService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { mediaUrl: string; content?: string }) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return this.prisma.fire.create({
      data: {
        ...data,
        authorId: userId,
        expiresAt,
      },
    });
  }

  async findAllActive() {
    const now = new Date();
    return this.prisma.user.findMany({
      where: {
        fires: {
          some: {
            expiresAt: { gt: now },
          },
        },
      },
      include: {
        fires: {
          where: {
            expiresAt: { gt: now },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async recordView(fireId: string, viewerId: string) {
    // Record specific viewer if not already recorded
    await this.prisma.fireView.upsert({
      where: {
        fireId_viewerId: { fireId, viewerId },
      },
      create: { fireId, viewerId },
      update: {}, // No change on re-view
    }).catch(() => null); // Silently fail if something goes wrong

    // Increment total view count
    return this.prisma.fire.update({
      where: { id: fireId },
      data: { viewCount: { increment: 1 } },
    });
  }

  async getViewers(fireId: string) {
    return this.prisma.fireView.findMany({
      where: { fireId },
      include: {
        viewer: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(userId: string, fireId: string) {
    return this.prisma.fire.deleteMany({
      where: {
        id: fireId,
        authorId: userId,
      },
    });
  }
}
