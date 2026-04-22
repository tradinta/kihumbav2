import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Body, 
  Param, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { AuthGuard } from '../auth/better-auth';

@Controller('partner')
@UseGuards(AuthGuard)
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  /**
   * Application: Creator initializes Partner status
   */
  @Post('apply')
  async apply(@Req() req: any, @Body() data: { fullName: string; mpesaNumber?: string }) {
    const userId = req.user.id;
    return this.partnerService.applyForPartnerProgram(userId, data);
  }

  /**
   * Profile: Fetch authenticated partner profile
   */
  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user.id;
    return this.partnerService.getPartnerProfile(userId);
  }

  /**
   * Briefs: Fetch all campaigns for the creator
   */
  @Get('briefs')
  async getBriefs(@Req() req: any) {
    const userId = req.user.id;
    return this.partnerService.getCreatorBriefs(userId);
  }

  /**
   * Brief: Creator accepts a brand brief
   */
  @Patch('brief/:id/accept')
  async accept(@Req() req: any, @Param('id') briefId: string) {
    const userId = req.user.id;
    return this.partnerService.acceptBrief(userId, briefId);
  }

  /**
   * Brief: Creator submits a draft for review
   */
  @Patch('brief/:id/submit-draft')
  async submitDraft(
    @Req() req: any, 
    @Param('id') briefId: string, 
    @Body() data: { draftUrl?: string; videoId?: string }
  ) {
    const userId = req.user.id;
    return this.partnerService.submitDraft(userId, briefId, data);
  }

  /**
   * Marketplace: Fetch available campaigns
   */
  @Get('marketplace')
  async getMarketplace(@Req() req: any) {
    const userId = req.user.id;
    return this.partnerService.getMarketplaceCampaigns(userId);
  }

  /**
   * Join: Creator applies for a campaign
   */
  @Post('campaign/:id/apply')
  async applyToCampaign(@Req() req: any, @Param('id') campaignId: string) {
    const userId = req.user.id;
    return this.partnerService.applyToCampaign(userId, campaignId);
  }

  /**
   * Brief: Brand approves a creator's work
   */
  @Patch('brief/:id/approve')
  async approve(@Req() req: any, @Param('id') briefId: string) {
    const userId = req.user.id;
    return this.partnerService.approveBrief(userId, briefId);
  }

  /**
   * ADMIN/INTERNAL: Triggers the 72h escrow clearance manual pulse
   */
  @Post('admin/clear-escrow')
  async clearEscrow() {
    const count = await this.partnerService.processEscrowClearance();
    return { success: true, processed: count };
  }
}
