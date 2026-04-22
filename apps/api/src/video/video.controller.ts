import { Controller, Post, Get, Patch, Body, Query, UseGuards, Req, Param, Request } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoUploadUrlDto } from './dto/video.dto';
import { AuthGuard } from '../auth/better-auth';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    return this.videoService.handleMuxWebhook(payload);
  }
  
  @Get('feed')
  async getFeed(@Query('cursor') cursor?: string) {
    return this.videoService.getFeed(cursor);
  }

  @Get('sparks')
  async getSparks(@Query('cursor') cursor?: string) {
    return this.videoService.getSparks(cursor);
  }

  @Post('upload-url')
  @UseGuards(AuthGuard)
  async getUploadUrl(@Req() req: any, @Body() dto: VideoUploadUrlDto) {
    return this.videoService.getUploadUrl(req.user.id, dto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getUserVideos(@Req() req: any) {
    console.log(`[VideoController] Fetching videos for User: ${JSON.stringify(req.user)}`);
    if (!req.user) {
        console.error('[VideoController] req.user is MISSING even with AuthGuard!');
        throw new Error('Internal Authentication Sync Failure');
    }
    const userId = req.user.id;
    return this.videoService.getUserVideos(userId);
  }

  @Patch(':id/metadata')
  @UseGuards(AuthGuard)
  async updateMetadata(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: any
  ) {
    console.log(`[VideoController] Updating metadata for User: ${req.user?.id}`);
    if (!req.user) throw new Error('Auth Sync Breach');
    const userId = req.user.id;
    return this.videoService.updateMetadata(id, userId, data);
  }

  @Post(':id/monetize')
  @UseGuards(AuthGuard)
  async updateMonetization(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: { isMonetized: boolean }
  ) {
    console.log(`[VideoController] Toggling monetization for User: ${req.user?.id}`);
    if (!req.user) throw new Error('Auth Sync Breach');
    const userId = req.user.id;
    return this.videoService.toggleMonetization(id, userId, data.isMonetized);
  }

  @Post(':id/soft-delete')
  @UseGuards(AuthGuard)
  async softDelete(@Req() req: any, @Param('id') id: string) {
    console.log(`[VideoController] Soft deleting for User: ${req.user?.id}`);
    if (!req.user) throw new Error('Auth Sync Breach');
    const userId = req.user.id;
    return this.videoService.softDelete(id, userId);
  }

  @Get(':id')
  async getVideo(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }
}
