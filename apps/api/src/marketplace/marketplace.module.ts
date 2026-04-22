import { Module } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { R2Service } from '../utils/r2.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [MarketplaceController],
    providers: [MarketplaceService, R2Service],
    exports: [MarketplaceService],
})
export class MarketplaceModule { }
