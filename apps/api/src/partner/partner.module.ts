import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PartnerTask } from './partner.task';

@Module({
  imports: [PrismaModule],
  controllers: [PartnerController],
  providers: [PartnerService, PartnerTask],
  exports: [PartnerService],
})
export class PartnerModule {}
