import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PartnerService } from './partner.service';

@Injectable()
export class PartnerTask {
  private readonly logger = new Logger(PartnerTask.name);

  constructor(private readonly partnerService: PartnerService) {}

  /**
   * Automated Escrow Clearance Heartbeat
   * Runs every hour to check for released funds
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleEscrowClearance() {
    this.logger.log('Starting automated escrow clearance pulse...');
    
    try {
      const processedCount = await this.partnerService.processEscrowClearance();
      
      if (processedCount > 0) {
        this.logger.log(`Successfully cleared ${processedCount} escrow records.`);
      } else {
        this.logger.log('No escrow records ready for clearance.');
      }
    } catch (error) {
      this.logger.error('Failed to process escrow clearance pulse:', error);
    }
  }
}
