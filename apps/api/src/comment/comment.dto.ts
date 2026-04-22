import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';

export enum CommentTargetType {
  POST = 'POST',
  MARKET_LISTING = 'MARKET_LISTING',
  KAO_LISTING = 'KAO_LISTING',
}

export enum CommentSortBy {
  RECENT = 'RECENT',
  LOVED = 'LOVED',
  RANDOM = 'RANDOM',
}

export class CreateCommentDto {
  @IsString()
  @MaxLength(1000)
  content: string;

  @IsOptional()
  media?: any[]; // Array of { type: string, url: string }

  @IsEnum(CommentTargetType)
  targetType: CommentTargetType;

  @IsString()
  targetId: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

export class GetCommentsQueryDto {
  @IsEnum(CommentTargetType)
  targetType: CommentTargetType;

  @IsString()
  targetId: string;

  @IsOptional()
  @IsEnum(CommentSortBy)
  sortBy?: CommentSortBy;

  @IsOptional()
  @IsString()
  cursor?: string;
}
