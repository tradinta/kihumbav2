import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AblyService } from '../utils/ably.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule
  ],
  controllers: [ChatController],
  providers: [ChatService, AblyService],
  exports: [ChatService],
})
export class ChatModule {}
