import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Mux from '@mux/mux-node';
import { VideoUploadUrlDto } from './dto/video.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  private readonly mux: Mux;
  private readonly r2Client: S3Client;

  constructor(private prisma: PrismaService) {
    this.mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    });

    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID || ''}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async getUploadUrl(userId: string, dto: VideoUploadUrlDto) {
    const key = `videos/${userId}/${Date.now()}-${dto.title.replace(/\s+/g, '_')}.mp4`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: 'video/mp4', // Assuming mp4 for simplicity, or handle dynamically
    });

    const uploadUrl = await getSignedUrl(this.r2Client, command, { expiresIn: 3600 });

    // Create a placeholder record in the DB
    const video = await this.prisma.video.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: 'uploading',
        authorId: userId,
        r2Key: key,
        videoUrl: `${process.env.R2_PUBLIC_URL || ''}/${key}`,
        visibility: 'PRIVATE'
      },
    });

    return {
      uploadUrl,
      videoId: video.id,
      key
    };
  }

  async handleMuxWebhook(payload: any) {
    this.logger.log(`Received Mux Webhook: ${payload.type}`);

    if (payload.type === 'video.asset.ready') {
      const assetId = payload.data.id;
      const playbackId = payload.data.playback_ids?.[0]?.id;
      const duration = payload.data.duration;
      const uploadId = payload.data.upload_id;

      // Update the video record
      await this.prisma.video.updateMany({
        where: { uploadId },
        data: {
          assetId,
          playbackId,
          duration,
          status: 'ready',
          isSpark: duration < 151,
        },
      });
      
      this.logger.log(`Video asset ${assetId} is ready. Categorized as Spark: ${duration < 151}`);
    }

    if (payload.type === 'video.asset.errored') {
      const uploadId = payload.data.upload_id;
      await this.prisma.video.updateMany({
        where: { uploadId },
        data: { status: 'errored' },
      });
    }
  }

  async getSparks(cursor?: string) {
    return this.prisma.video.findMany({
      where: { isSpark: true, status: 'ready', deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { author: true },
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
  }

  async getVideos(cursor?: string) {
    return this.prisma.video.findMany({
      where: { isSpark: false, status: 'ready', deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { author: true },
      take: 12,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
  }

  async getFeed(cursor?: string) {
    this.logger.log(`[VideoService] Fetching Feed - Filters: { status: 'ready', isSpark: false, visibility: 'PUBLIC' }`);
    const videos = await this.prisma.video.findMany({
      where: { 
        status: 'ready', 
        deletedAt: null,
        visibility: 'PUBLIC',
        isSpark: false
      },
      orderBy: { createdAt: 'desc' },
      include: { 
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            isVerified: true
          }
        },
        _count: {
          select: { interactions: true }
        }
      },
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
    this.logger.log(`[VideoService] Returned ${videos.length} videos for feed.`);
    return videos;
  }

  async findOne(id: string) {
    const video = await this.prisma.video.findFirst({
      where: { 
        OR: [
          { id, deletedAt: null },
          { post: { id, isDeleted: false } }
        ]
      },
      include: { 
        author: {
          include: {
            _count: {
              select: { followers: true }
            }
          }
        },
        post: {
          include: {
            _count: {
              select: { interactions: true, comments: true, reshares: true }
            },
            interactions: true
          }
        }
      },
    });

    if (video) {
        // Fire and forget view increment
        this.prisma.video.update({
            where: { id: video.id },
            data: { viewCount: { increment: 1 } }
        }).catch(() => {});
    }

    return video;
  }

  async interact(videoId: string, userId: string, type: 'UPVOTE' | 'DOWNVOTE') {
    return this.prisma.userInteraction.upsert({
      where: {
        userId_videoId_type: { userId, videoId, type }
      },
      update: {},
      create: { userId, videoId, type }
    });
  }

  // ─── CREATOR STUDIO METHODS ──────────────────────────────────────────────────

  /**
   * Fetches all videos for a specific creator (including private/unscheduled)
   */
  async getUserVideos(userId: string) {
    return this.prisma.video.findMany({
      where: { authorId: userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        retention: true,
        _count: { select: { interactions: true } }
      }
    });
  }

  /**
   * Industrial Metadata Update
   */
  async updateMetadata(videoId: string, userId: string, data: any) {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });
    if (!video || video.authorId !== userId) throw new Error('Access denied');

    // Industrial Spark Identification Pulse: < 151 seconds
    const isSpark = data.duration && data.duration < 151;

    const updatedVideo = await this.prisma.video.update({
      where: { id: videoId },
      data: {
        title: data.title,
        description: data.description,
        visibility: data.visibility,
        thumbnailUrl: data.thumbnail || data.thumbnailUrl,
        duration: data.duration,
        isSpark: isSpark,
        status: 'ready',
        scheduledAt: data.scheduledAt,
      }
    });

    // 🚀 Post-Video Industrial Sync: Ensure every public video has a Post
    if (updatedVideo.visibility === 'PUBLIC') {
        const existingPost = await this.prisma.post.findUnique({ where: { videoId } });
        if (!existingPost) {
            // Lazy-create the post wrapper if it doesn't exist yet
            await this.prisma.post.create({
                data: {
                    authorId: userId,
                    videoId: videoId,
                    content: updatedVideo.description || updatedVideo.title,
                    contentType: 'VIDEO',
                }
            });
        } else {
            // Update the existing post's content
            await this.prisma.post.update({
                where: { id: existingPost.id },
                data: { content: updatedVideo.description || updatedVideo.title }
            });
        }
    }

    return updatedVideo;
  }

  /**
   * Monetization Toggle with Duration Guardrail (> 150s)
   */
  async toggleMonetization(videoId: string, userId: string, isMonetized: boolean) {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });
    if (!video || video.authorId !== userId) throw new Error('Access denied');

    // Industrial Guardrail: Only videos > 150s can be monetized
    if (isMonetized && (!video.duration || video.duration < 151)) {
      throw new Error('Monetization is only available for long-form content (> 150 seconds)');
    }

    return this.prisma.video.update({
      where: { id: videoId },
      data: { isMonetized }
    });
  }

  /**
   * Soft Delete Pulse
   */
  async softDelete(videoId: string, userId: string) {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });
    if (!video || video.authorId !== userId) throw new Error('Access denied');

    return this.prisma.video.update({
      where: { id: videoId },
      data: { deletedAt: new Date() }
    });
  }

  /**
   * Industrial Mux Ingestion Pulse
   * Creates a Mux asset from an existing R2 video URL
   */
  async createMuxAsset(videoId: string) {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });
    if (!video || !video.videoUrl || video.assetId) return;

    try {
      this.logger.log(`[VideoService] Triggering Mux Ingestion for Video: ${videoId}`);
      const asset = await this.mux.video.assets.create({
        inputs: [{ url: video.videoUrl }],
        playback_policy: ['public'],
        test: false,
      });

      await this.prisma.video.update({
        where: { id: videoId },
        data: { 
          assetId: asset.id,
          uploadId: asset.upload_id || undefined // Some ingestion flows don't have an upload_id
        }
      });

      return asset;
    } catch (err) {
      this.logger.error(`[VideoService] Mux Ingestion Failed for Video: ${videoId}`, err);
    }
  }
}
