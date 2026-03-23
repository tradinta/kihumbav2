import { IsString, IsOptional, IsUrl, IsEnum, MinLength, MaxLength } from 'class-validator';

enum ContentTypeEnum {
    TEXT = 'TEXT',
    PHOTO = 'PHOTO',
}

export class CreatePostDto {
    @IsString()
    @MinLength(1)
    @MaxLength(2000)
    content: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsEnum(ContentTypeEnum)
    contentType?: ContentTypeEnum;
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
