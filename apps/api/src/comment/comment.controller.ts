import {
  Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req, HttpStatus, HttpCode
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, GetCommentsQueryDto } from './comment.dto';
import { AuthGuard, SoftAuthGuard } from '../auth/better-auth';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req: any, @Body() dto: CreateCommentDto) {
    return this.commentService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(SoftAuthGuard)
  getComments(@Req() req: any, @Query() query: GetCommentsQueryDto) {
    return this.commentService.getComments(query, req.user?.id);
  }

  @Get(':id/replies')
  @UseGuards(SoftAuthGuard)
  getReplies(@Req() req: any, @Param('id') id: string) {
    return this.commentService.getReplies(id, req.user?.id);
  }

  @Post(':id/heart')
  @UseGuards(AuthGuard)
  toggleHeart(@Req() req: any, @Param('id') id: string) {
    return this.commentService.toggleHeart(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Req() req: any, @Param('id') id: string) {
    return this.commentService.delete(id, req.user.id);
  }
}
