import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideoAnalyticsService {
  private readonly logger = new Logger(VideoAnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Records a viewer milestone pulse (3min, 50%, 100%)
   */
  async recordMilestone(videoId: string, milestone: '3min' | '50pct' | '100pct') {
    return this.prisma.videoRetention.upsert({
      where: { videoId },
      update: {
        watched3Min: milestone === '3min' ? { increment: 1 } : undefined,
        watched50Pct: milestone === '50pct' ? { increment: 1 } : undefined,
        watched100Pct: milestone === '100pct' ? { increment: 1 } : undefined,
      },
      create: {
        videoId,
        watched3Min: milestone === '3min' ? 1 : 0,
        watched50Pct: milestone === '50pct' ? 1 : 0,
        watched100Pct: milestone === '100pct' ? 1 : 0,
      },
    });
  }

  /**
   * Fetches the retention slope for a specific video
   */
  async getRetentionData(videoId: string) {
    return this.prisma.videoRetention.findUnique({
      where: { videoId },
    });
  }
}
