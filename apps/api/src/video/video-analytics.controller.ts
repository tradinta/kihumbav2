import { Controller, Post, Get, Param, Body, Request, UseGuards } from '@nestjs/common';
import { VideoAnalyticsService } from './video-analytics.service';

@Controller('video-analytics')
export class VideoAnalyticsController {
  constructor(private readonly analyticsService: VideoAnalyticsService) {}

  /**
   * Public-ish endpoint to record viewer milestones
   */
  @Post(':id/pulse')
  async recordPulse(
    @Param('id') videoId: string,
    @Body('milestone') milestone: '3min' | '50pct' | '100pct'
  ) {
    return this.analyticsService.recordMilestone(videoId, milestone);
  }

  /**
   * Creator-only endpoint to fetch retention data
   */
  @Get(':id/retention')
  async getRetention(@Param('id') videoId: string) {
    return this.analyticsService.getRetentionData(videoId);
  }
}
