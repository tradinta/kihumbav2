import {
    Controller, Get, Post, Delete, Param,
    UseGuards, Req, Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    /** GET /api/users/profile/:username — public */
    @Get('profile/:username')
    getProfile(@Param('username') username: string, @Req() req: any) {
        const requesterId = req.headers?.authorization ? req.user?.id : undefined;
        return this.userService.getProfile(username, requesterId);
    }

    /** GET /api/users/:id/followers */
    @Get(':id/followers')
    getFollowers(
        @Param('id') id: string,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        return this.userService.getFollowers(id, cursor, limit ? parseInt(limit) : 20);
    }

    /** GET /api/users/:id/following */
    @Get(':id/following')
    getFollowing(
        @Param('id') id: string,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        return this.userService.getFollowing(id, cursor, limit ? parseInt(limit) : 20);
    }

    /** POST /api/users/:id/follow — auth required */
    @Post(':id/follow')
    @UseGuards(JwtAuthGuard)
    follow(@Req() req: any, @Param('id') id: string) {
        return this.userService.follow(req.user.id, id);
    }

    /** POST /api/users/:id/unfollow — auth required */
    @Post(':id/unfollow')
    @UseGuards(JwtAuthGuard)
    unfollow(@Req() req: any, @Param('id') id: string) {
        return this.userService.unfollow(req.user.id, id);
    }

    /** POST /api/users/:id/block — auth required */
    @Post(':id/block')
    @UseGuards(JwtAuthGuard)
    block(@Req() req: any, @Param('id') id: string) {
        return this.userService.block(req.user.id, id);
    }

    /** DELETE /api/users/:id/block — auth required */
    @Delete(':id/block')
    @UseGuards(JwtAuthGuard)
    unblock(@Req() req: any, @Param('id') id: string) {
        return this.userService.unblock(req.user.id, id);
    }
}
