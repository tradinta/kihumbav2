import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadgeService } from './badge.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SearchModule } from '../search/search.module';

@Module({
    imports: [PrismaModule, AuthModule, SearchModule],
    controllers: [UserController],
    providers: [UserService, BadgeService],
    exports: [UserService, BadgeService],
})
export class UserModule { }
