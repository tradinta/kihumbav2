import { IsString, IsOptional, IsEnum, MinLength, MaxLength, IsArray, ValidateNested, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

export enum ContentTypeEnum {
    TEXT = 'TEXT',
    PHOTO = 'PHOTO',
    VIDEO = 'VIDEO',
    RESHARE = 'RESHARE',
    QUOTE = 'QUOTE',
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
