import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { KaoModule } from './kao/kao.module';
import { VideoModule } from './video/video.module';
import { TribeModule } from './tribe/tribe.module';
import { ChatModule } from './chat/chat.module';
import { StorageModule } from './storage/storage.module';
import { NotificationModule } from './notification/notification.module';
import { AblyModule } from './utils/ably.module';
import { PartnerModule } from './partner/partner.module';
import { SearchModule } from './search/search.module';
import { FireModule } from './fire/fire.module';
@Module({
    imports: [
        // Rate limiting: 100 requests per minute per IP
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 100,
        }]),

        ScheduleModule.forRoot(),
        PrismaModule,
        AblyModule,
        NotificationModule,
        AuthModule,
        UserModule,
        PostModule,
        CommentModule,
        MarketplaceModule,
        KaoModule,
        VideoModule,
        TribeModule,
        ChatModule,
        StorageModule,
        PartnerModule,
        SearchModule,
        FireModule,
    ],
})
export class AppModule { }
