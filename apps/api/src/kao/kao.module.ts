import { Module } from '@nestjs/common';
import { KaoController } from './kao.controller';
import { KaoService } from './kao.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [KaoController],
    providers: [KaoService],
    exports: [KaoService],
})
export class KaoModule {}
