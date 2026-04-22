import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { VideoModule } from '../video/video.module';
import { SearchModule } from '../search/search.module';

@Module({
    imports: [PrismaModule, AuthModule, VideoModule, SearchModule],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule { }
