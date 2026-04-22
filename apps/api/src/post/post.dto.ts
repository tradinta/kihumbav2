import { IsString, IsOptional, IsEnum, MinLength, MaxLength, IsArray, ValidateNested, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

export enum ContentTypeEnum {
    TEXT = 'TEXT',
    PHOTO = 'PHOTO',
    VIDEO = 'VIDEO',
    RESHARE = 'RESHARE',
    QUOTE = 'QUOTE',
    EVENT = 'EVENT',
    POLL = 'POLL',
    DOCUMENT = 'DOCUMENT',
}

export class MediaItemDto {
    @IsEnum(['image', 'video', 'document'])
    type: 'image' | 'video' | 'document';

    @IsString()
    src: string; // URL

    @IsOptional()
    @IsString()
    name?: string; // For documents

    @IsOptional()
    size?: number; // For documents

    @IsOptional()
    mimeType?: string; // For documents

    @IsOptional()
    @IsString()
    alt?: string;
}

export class EventDataDto {
    @IsString()
    title: string;

    @IsString()
    organizer: string;

    @IsString()
    date: string; // ISO String

    @IsOptional()
    @IsString()
    endDate?: string;

    @IsString()
    venue: string;

    @IsOptional()
    @IsString()
    price?: string;

    @IsOptional()
    @IsString()
    externalLink?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    posterUrl?: string;
}

export class PollDataDto {
    @IsString()
    question: string;

    @IsArray()
    @ArrayMaxSize(5)
    options: string[];

    @IsOptional()
    correctIndices?: number[]; // For quiz mode

    @IsOptional()
    allowMultiple?: boolean;

    @IsOptional()
    isQuiz?: boolean;

    @IsOptional()
    @IsString()
    endsAt?: string;
}

export class CreatePostDto {
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    content?: string;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(10) // Increased for documents/multi-media
    @ValidateNested({ each: true })
    @Type(() => MediaItemDto)
    media?: MediaItemDto[];

    @IsOptional()
    @IsEnum(ContentTypeEnum)
    contentType?: ContentTypeEnum;

    @IsOptional()
    @ValidateNested()
    @Type(() => EventDataDto)
    eventData?: EventDataDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => PollDataDto)
    pollData?: PollDataDto;

    @IsOptional()
    @IsString()
    originalPostId?: string;

    @IsOptional()
    @IsString()
    tribeId?: string;
 
    @IsOptional()
    @IsString()
    marketListingId?: string;

    @IsOptional()
    @IsString()
    kaoListingId?: string;
}

export class CreateCommentDto {
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    content: string;

    @IsOptional()
    @IsString()
    parentId?: string;
}
