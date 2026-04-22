import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard, Public } from '../auth/better-auth';
import { CreateRoomDto, SendMessageDto } from './chat.dto';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {
    console.log('🛡️ ChatController Instantiated - Routes: rooms/:id, rooms, etc.');
  }

  @Get('token')
  getAblyToken(@Req() req: any) {
    return this.chatService.getAblyToken(req.user.id);
  }

  @Get('rooms')
  getMyRooms(@Req() req: any) {
    return this.chatService.getMyRooms(req.user.id);
  }

  @Post('rooms')
  createRoom(@Req() req: any, @Body() dto: CreateRoomDto) {
    return this.chatService.createRoom(req.user.id, dto);
  }

  @Get('rooms/:id/participants')
  getParticipants(@Req() req: any, @Param('id') roomId: string) {
    return this.chatService.getParticipants(req.user.id, roomId);
  }

  @Get('rooms/:id')
  getRoom(@Req() req: any, @Param('id') roomId: string) {
    return this.chatService.getRoom(req.user.id, roomId);
  }

  @Patch('rooms/:id')
  updateRoom(
    @Req() req: any,
    @Param('id') roomId: string,
    @Body() dto: any
  ) {
    return this.chatService.updateRoom(req.user.id, roomId, dto);
  }

  @Post('rooms/:id/rotate-link')
  rotateLink(@Req() req: any, @Param('id') roomId: string) {
    return this.chatService.rotateRoomSlug(req.user.id, roomId);
  }

  @Get('rooms/preview/:slug')
  getRoomPreview(@Param('slug') slug: string) {
    return this.chatService.getRoomPreview(slug);
  }

  @Post('rooms/:id/join')
  joinRoom(@Req() req: any, @Param('id') roomId: string) {
    return this.chatService.joinRoom(req.user.id, roomId);
  }

  @Post('rooms/:id/leave')
  leaveRoom(@Req() req: any, @Param('id') roomId: string) {
    return this.chatService.leaveRoom(req.user.id, roomId);
  }

  @Get('rooms/:id/requests')
  getJoinRequests(@Req() req: any, @Param('id') roomId: string) {
    return this.chatService.getJoinRequests(req.user.id, roomId);
  }

  @Post('rooms/:id/requests/:requestId/resolve')
  resolveRequest(
    @Req() req: any,
    @Param('requestId') requestId: string,
    @Body('status') status: 'ACCEPTED' | 'REJECTED'
  ) {
    return this.chatService.resolveJoinRequest(req.user.id, requestId, status);
  }

  @Get('rooms/:id/messages')
  getRoomMessages(@Req() req: any, @Param('id') roomId: string) {
    return this.chatService.getRoomMessages(roomId, req.user.id);
  }

  @Post('rooms/:id/messages')
  sendMessage(
    @Req() req: any,
    @Param('id') roomId: string,
    @Body() dto: SendMessageDto
  ) {
    return this.chatService.sendMessage(req.user.id, roomId, dto);
  }

  @Post('rooms/:id/accept')
  acceptRoom(@Req() req: any, @Param('id') roomId: string) {
    return this.chatService.acceptRoom(req.user.id, roomId);
  }

  @Delete('rooms/:id/messages/:msgId')
  deleteMessage(
    @Req() req: any,
    @Param('id') roomId: string,
    @Param('msgId') messageId: string,
    @Query('mode') mode: 'ME' | 'EVERYONE' = 'ME'
  ) {
    return this.chatService.deleteMessage(req.user.id, roomId, messageId, mode);
  }

  @Delete('rooms/:id')
  deleteRoom(@Req() req: any, @Param('id') roomId: string) {
    return this.chatService.deleteRoom(req.user.id, roomId);
  }

  @Post('anon/start')
  startAnonRoom(@Req() req: any) {
    return this.chatService.startAnonRoom(req.user.id);
  }

  @Post('anon/join')
  joinAnonRoom(@Req() req: any, @Body('code') code: string) {
    return this.chatService.joinAnonRoom(req.user.id, code);
  }

  @Post('rooms/:id/archive')
  archiveRoom(
    @Req() req: any,
    @Param('id') roomId: string,
    @Body('archive') archive: boolean
  ) {
    return this.chatService.archiveRoom(req.user.id, roomId, archive);
  }
}
