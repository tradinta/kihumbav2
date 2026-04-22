import { Module } from '@nestjs/common';
import { FireService } from './fire.service';
import { FireController } from './fire.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FireController],
  providers: [FireService],
  exports: [FireService],
})
export class FireModule {}
