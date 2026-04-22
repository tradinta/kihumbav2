import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  PartnerStatus, 
  BriefStatus, 
  CampaignStatus, 
  EscrowStatus 
} from '@prisma/client';

@Injectable()
export class PartnerService {
  private readonly logger = new Logger(PartnerService.name);

  constructor(private prisma: PrismaService) {}

  // ─── PARTNER MANAGEMENT ─────────────────────────────────────────────────────

  /**
   * Fetches all OPEN campaigns the creator hasn't joined yet
   */
  async getMarketplaceCampaigns(userId: string) {
    return this.prisma.campaign.findMany({
      where: {
        status: CampaignStatus.OPEN,
        briefs: {
          none: { partnerId: userId }
        }
      },
      include: {
        brand: {
          select: {
            name: true,
            avatar: true,
            fullName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Creator applies for a campaign -> Auto-Grants an ACCEPTED brief
   */
  async applyToCampaign(userId: string, campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) throw new Error('Campaign not found');

    // Auto-Grant Logic: Create brief in ACCEPTED state immediately
    return this.prisma.campaignBrief.create({
      data: {
        campaignId,
        partnerId: userId,
        status: BriefStatus.ACCEPTED,
        payoutAmount: campaign.budgetTotal / 10, // Placeholder calculation
      }
    });
  }

  /**
   * Initializes a Partner Application
   */
  async applyForPartnerProgram(userId: string, data: { fullName: string; mpesaNumber?: string }) {
    return this.prisma.partnerProfile.upsert({
      where: { userId },
      update: { status: PartnerStatus.IN_REVIEW },
      create: {
        userId,
        status: PartnerStatus.IN_REVIEW,
        kts: 80, // Default baseline Trust Score
        mpesaNumber: data.mpesaNumber,
      },
    });
  }

  /**
   * Fetches a Creator's complete Partner Profile
   */
  async getPartnerProfile(userId: string) {
    return this.prisma.partnerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            isVerified: true,
            username: true,
          }
        }
      }
    });
  }

  /**
   * Fetches all briefs assigned to a specific Creator
   */
  async getCreatorBriefs(partnerId: string) {
    return this.prisma.campaignBrief.findMany({
      where: { partnerId },
      include: {
        campaign: {
          include: {
            brand: {
              select: {
                name: true,
                avatar: true,
                fullName: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── CAMPAIGN & BRIEF LOGIC ─────────────────────────────────────────────────

  /**
   * Transitions a Brief to ACCEPTED
   */
  async acceptBrief(partnerId: string, briefId: string) {
    const brief = await this.prisma.campaignBrief.findUnique({
      where: { id: briefId },
      include: { campaign: true }
    });

    if (!brief || brief.partnerId !== partnerId) {
      throw new Error('Brief not found or access denied');
    }

    if (brief.status !== BriefStatus.PENDING) {
      throw new Error('Brief is already accepted or invalid state');
    }

    return this.prisma.campaignBrief.update({
      where: { id: briefId },
      data: { status: BriefStatus.ACCEPTED },
    });
  }

  /**
   * Submit Content Draft for Brand Review
   */
  async submitDraft(partnerId: string, briefId: string, data: { draftUrl?: string; videoId?: string }) {
    return this.prisma.campaignBrief.update({
      where: { id: briefId, partnerId },
      data: {
        status: BriefStatus.DRAFT_SUBMITTED,
        draftUrl: data.draftUrl,
        // If we link a VideoId, we could also update the Video record here
      },
    });
  }

  /**
   * Brand Approval Handshake -> Triggers Escrow Review Period
   */
  async approveBrief(brandId: string, briefId: string) {
    return this.prisma.$transaction(async (tx) => {
      const brief = await tx.campaignBrief.findUnique({
        where: { id: briefId },
        include: { campaign: true }
      });

      if (!brief || brief.campaign.brandId !== brandId) {
        throw new Error('Campaign not found or access denied');
      }

      // 1. Update Brief Status
      const updatedBrief = await tx.campaignBrief.update({
        where: { id: briefId },
        data: { status: BriefStatus.APPROVED },
      });

      // 2. Create Escrow Record (Locked for 72 hours)
      const releaseDate = new Date();
      releaseDate.setHours(releaseDate.getHours() + 72);

      await tx.escrowRecord.create({
        data: {
          campaignId: brief.campaignId,
          briefId: brief.id,
          amount: brief.payoutAmount,
          status: EscrowStatus.HELD,
          releaseDate,
        },
      });

      // 3. Move funds to Partner's PENDING balance
      await tx.partnerProfile.update({
        where: { userId: brief.partnerId },
        data: {
          pendingBalance: { increment: brief.payoutAmount },
        },
      });

      return updatedBrief;
    });
  }

  // ─── FINANCIAL ENGINE ───────────────────────────────────────────────────────

  /**
   * Background Task: Processes Clear Escrow Records
   * To be called by a CronJob
   */
  async processEscrowClearance() {
    const now = new Date();
    const readyEscrows = await this.prisma.escrowRecord.findMany({
      where: {
        status: EscrowStatus.HELD,
        releaseDate: { lte: now },
      },
    });

    for (const escrow of readyEscrows) {
      await this.prisma.$transaction(async (tx) => {
        // 1. Mark Escrow as Released
        await tx.escrowRecord.update({
          where: { id: escrow.id },
          data: { status: EscrowStatus.RELEASED },
        });

        // 2. Resolve Brief as Paid
        const brief = await tx.campaignBrief.update({
          where: { id: escrow.briefId },
          data: { status: BriefStatus.PAID },
        });

        // 3. Move PENDING -> CURRENT balance
        await tx.partnerProfile.update({
          where: { userId: brief.partnerId },
          data: {
            pendingBalance: { decrement: escrow.amount },
            currentBalance: { increment: escrow.amount },
            totalEarned: { increment: escrow.amount },
          },
        });
      });
    }

    return readyEscrows.length;
  }
}
