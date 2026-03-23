import {
    Controller, Get, Post, Delete, Body, Param,
    UseGuards, Req, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, CreateCommentDto } from './post.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    /** POST /api/posts — create post (auth required) */
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Req() req: any, @Body() dto: CreatePostDto) {
        return this.postService.create(req.user.id, dto);
    }

    /** GET /api/posts — get feed (public, but auth enriches it) */
    @Get()
    getFeed(
        @Req() req: any,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        const requesterId = req.user?.id;
        return this.postService.getFeed(requesterId, cursor, limit ? parseInt(limit) : 20);
    }

    /** GET /api/posts/user/:userId — get a user's posts */
    @Get('user/:userId')
    getUserPosts(
        @Param('userId') userId: string,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        return this.postService.getUserPosts(userId, cursor, limit ? parseInt(limit) : 20);
    }

    /** GET /api/posts/:id — get single post + nested comments */
    @Get(':id')
    getById(@Param('id') id: string, @Req() req: any) {
        return this.postService.getById(id, req.user?.id);
    }

    /** DELETE /api/posts/:id — soft delete (auth required, own post only) */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    delete(@Req() req: any, @Param('id') id: string) {
        return this.postService.delete(id, req.user.id);
    }

    /** POST /api/posts/:id/upvote — toggle upvote */
    @Post(':id/upvote')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    upvote(@Req() req: any, @Param('id') id: string) {
        return this.postService.toggleUpvote(id, req.user.id);
    }

    /** POST /api/posts/:id/downvote — toggle downvote */
    @Post(':id/downvote')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    downvote(@Req() req: any, @Param('id') id: string) {
        return this.postService.toggleDownvote(id, req.user.id);
    }

    /** POST /api/posts/:id/bookmark — toggle bookmark */
    @Post(':id/bookmark')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    bookmark(@Req() req: any, @Param('id') id: string) {
        return this.postService.toggleBookmark(id, req.user.id);
    }

    /** GET /api/posts/:id/comments */
    @Get(':id/comments')
    getComments(@Param('id') id: string) {
        return this.postService.getById(id).then((p: any) => p.comments);
    }

    /** POST /api/posts/:id/comments — add comment or reply */
    @Post(':id/comments')
    @UseGuards(JwtAuthGuard)
    addComment(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: CreateCommentDto,
    ) {
        return this.postService.addComment(id, req.user.id, dto);
    }

    /** DELETE /api/comments/:id — delete comment */
    @Delete('/comment/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    deleteComment(@Req() req: any, @Param('id') id: string) {
        return this.postService.deleteComment(id, req.user.id);
    }
}
