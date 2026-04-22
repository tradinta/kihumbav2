import {
    Controller, Get, Post, Delete, Param,
    UseGuards, Req, Query, Patch, Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, SoftAuthGuard } from '../auth/better-auth';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    /** GET /api/users/friends — get mutual friends */
    @Get('friends')
    @UseGuards(AuthGuard)
    getFriends(@Req() req: any) {
        return this.userService.getFriends(req.user.id);
    }

    /** PATCH /api/users/profile — auth required */
    @Patch('profile')
    @UseGuards(AuthGuard)
    updateProfile(@Req() req: any, @Body() dto: any) {
        return this.userService.updateProfile(req.user.id, dto);
    }

    /** GET /api/users/profile/:username — public (Soft Auth) */
    @Get('profile/:username')
    @UseGuards(SoftAuthGuard)
    getProfile(@Param('username') username: string, @Req() req: any) {
        return this.userService.getProfile(username, req.user?.id);
    }

    /** GET /api/users/:id/followers */
    @Get(':id/followers')
    @UseGuards(SoftAuthGuard)
    getFollowers(
        @Param('id') id: string,
        @Req() req: any,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        return this.userService.getFollowers(id, req.user?.id, cursor, limit ? parseInt(limit) : 20);
    }

    /** GET /api/users/:id/following */
    @Get(':id/following')
    @UseGuards(SoftAuthGuard)
    getFollowing(
        @Param('id') id: string,
        @Req() req: any,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        return this.userService.getFollowing(id, req.user?.id, cursor, limit ? parseInt(limit) : 20);
    }

    /** GET /api/users/:id/tribes */
    @Get(':id/tribes')
    getUserTribes(@Param('id') id: string) {
        return this.userService.getUserTribes(id);
    }

    /** POST /api/users/:id/follow — auth required */
    @Post(':id/follow')
    @UseGuards(AuthGuard)
    follow(@Req() req: any, @Param('id') id: string) {
        return this.userService.follow(req.user.id, id);
    }

    /** POST /api/users/:id/unfollow — auth required */
    @Post(':id/unfollow')
    @UseGuards(AuthGuard)
    unfollow(@Req() req: any, @Param('id') id: string) {
        return this.userService.unfollow(req.user.id, id);
    }

    /** POST /api/users/:id/block — auth required */
    @Post(':id/block')
    @UseGuards(AuthGuard)
    block(@Req() req: any, @Param('id') id: string) {
        return this.userService.block(req.user.id, id);
    }

    /** DELETE /api/users/:id/block — auth required */
    @Delete(':id/block')
    @UseGuards(AuthGuard)
    unblock(@Req() req: any, @Param('id') id: string) {
        return this.userService.unblock(req.user.id, id);
    }

    /** POST /api/users/:id/mute — auth required */
    @Post(':id/mute')
    @UseGuards(AuthGuard)
    mute(@Req() req: any, @Param('id') id: string) {
        return this.userService.mute(req.user.id, id);
    }

    @Delete(':id/mute')
    @UseGuards(AuthGuard)
    unmute(@Req() req: any, @Param('id') id: string) {
        return this.userService.unmute(req.user.id, id);
    }

    /** POST /api/users/requests/:followerId/handle — accept/reject request */
    @Post('requests/:followerId/handle')
    @UseGuards(AuthGuard)
    handleRequest(
        @Req() req: any,
        @Param('followerId') followerId: string,
        @Body('accept') accept: boolean
    ) {
        return this.userService.handleFollowRequest(req.user.id, followerId, accept);
    }

    /** PATCH /api/users/tier — update subscription tier */
    @Patch('tier')
    @UseGuards(AuthGuard)
    updateTier(@Req() req: any, @Body('tier') tier: string) {
        return this.userService.updateTier(req.user.id, tier);
    }
}
