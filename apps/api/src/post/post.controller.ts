import {
    Controller, Get, Post, Delete, Body, Param,
    UseGuards, Req, Query, HttpCode, HttpStatus, Put
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PostService } from './post.service';
import { CreatePostDto, CreateCommentDto } from './post.dto';
import { AuthGuard, SoftAuthGuard } from '../auth/better-auth';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    @UseGuards(AuthGuard)
    @Throttle({ default: { limit: 10, ttl: 300000 } }) // 10 posts / 5 min
    create(@Req() req: any, @Body() dto: CreatePostDto) {
        return this.postService.create(dto, req.user.id);
    }

    /** POST /api/posts/finalize-video — finalize video upload to post */
    @Post('finalize-video')
    @UseGuards(AuthGuard)
    finalizeVideo(
        @Req() req: any, 
        @Body('videoId') videoId: string,
        @Body('content') content?: string
    ) {
        return this.postService.createFromVideo(req.user.id, videoId, content);
    }

    /** GET /api/posts — get feed (public, but auth enriches it) */
    @Get()
    @UseGuards(SoftAuthGuard)
    getFeed(
        @Req() req: any,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: number,
        @Query('tab') tab: 'HOME' | 'SPARK' | 'VIDEO' | 'EVENT' = 'HOME',
        @Query('sort') sort: 'LATEST' | 'RECOMMENDED' = 'LATEST',
        @Query('q') query?: string,
    ) {
        return this.postService.getFeed(req.user?.id, cursor, limit || 20, tab, sort, query);
    }

    /** GET /api/posts/user/:userId — get a user's posts */
    @Get('user/:userId')
    @UseGuards(SoftAuthGuard)
    getUserPosts(
        @Req() req: any,
        @Param('userId') userId: string,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        return this.postService.getUserPosts(userId, cursor, limit ? parseInt(limit) : 20, req.user?.id);
    }

    /** GET /api/posts/tribe/:tribeId — get posts for a tribe */
    @Get('tribe/:tribeId')
    @UseGuards(SoftAuthGuard)
    getTribePosts(
        @Req() req: any,
        @Param('tribeId') tribeId: string,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        return this.postService.getTribePosts(tribeId, cursor, limit ? parseInt(limit) : 20, req.user?.id);
    }

    /** GET /api/posts/:id — get single post + nested comments */
    @Get(':id')
    @UseGuards(SoftAuthGuard)
    getById(@Param('id') id: string, @Req() req: any) {
        return this.postService.getById(id, req.user?.id);
    }

    /** DELETE /api/posts/:id — soft delete (auth required, own post only) */
    @Delete(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    delete(@Req() req: any, @Param('id') id: string) {
        return this.postService.delete(id, req.user.id);
    }

    /** PUT /api/posts/:id/pin — toggle pin */
    @Put(':id/pin')
    @UseGuards(AuthGuard)
    pinPost(@Param('id') id: string, @Req() req: any) {
        return this.postService.togglePin(id, req.user.id, true);
    }

    /** PUT /api/posts/:id/unpin — toggle unpin */
    @Put(':id/unpin')
    @UseGuards(AuthGuard)
    unpinPost(@Param('id') id: string, @Req() req: any) {
        return this.postService.togglePin(id, req.user.id, false);
    }

    /** POST /api/posts/:id/upvote — toggle upvote */
    @Post(':id/upvote')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    upvote(@Req() req: any, @Param('id') id: string) {
        return this.postService.toggleUpvote(id, req.user.id);
    }

    /** POST /api/posts/:id/downvote — toggle downvote */
    @Post(':id/downvote')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    downvote(@Req() req: any, @Param('id') id: string) {
        return this.postService.toggleDownvote(id, req.user.id);
    }

    /** POST /api/posts/:id/bookmark — toggle bookmark */
    @Post(':id/bookmark')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    bookmark(@Req() req: any, @Param('id') id: string) {
        return this.postService.toggleBookmark(id, req.user.id);
    }

    /** POST /api/posts/:id/reshare — toggle pure reshare */
    @Post(':id/reshare')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    reshare(@Req() req: any, @Param('id') id: string) {
        return this.postService.toggleReshare(id, req.user.id);
    }

    /** POST /api/posts/poll/:pollId/vote — vote in a poll */
    @Post('poll/:pollId/vote')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    votePoll(
        @Req() req: any, 
        @Param('pollId') pollId: string,
        @Body('optionId') optionId: string
    ) {
        return this.postService.votePoll(req.user.id, pollId, optionId);
    }
}
