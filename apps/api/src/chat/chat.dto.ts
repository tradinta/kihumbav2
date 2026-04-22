import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ChatRoomType } from '@prisma/client';

export class CreateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ChatRoomType)
  type: ChatRoomType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsOptional()
  metadata?: any;

  @IsArray()
  @IsString({ each: true })
  participants: string[]; // List of user IDs
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  type?: string; // TEXT, IMAGE, POLL, etc.

  @IsOptional()
  metadata?: any;

  @IsString()
  @IsOptional()
  replyToId?: string;
}

export class UpdateParticipantDto {
  @IsEnum(['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER'])
  role: string;
}
