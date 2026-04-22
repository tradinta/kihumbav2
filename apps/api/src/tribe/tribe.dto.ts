import { IsString, IsOptional, IsEnum, IsArray, IsNotEmpty, MaxLength, MinLength, IsBoolean } from 'class-validator';
import { TribePrivacy, TribeCategory, TribeRole } from '@prisma/client';

export class CreateTribeDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @IsString()
    @MinLength(10)
    @MaxLength(50)
    slug: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;

    @IsEnum(TribeCategory)
    category: TribeCategory;

    @IsEnum(TribePrivacy)
    privacy: TribePrivacy;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsString()
    cover?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    questions?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    rules?: string[];
}

export class UpdateTribeDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;

    @IsOptional()
    @IsEnum(TribeCategory)
    category?: TribeCategory;

    @IsOptional()
    @IsEnum(TribePrivacy)
    privacy?: TribePrivacy;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsString()
    cover?: string;
}

export class JoinTribeDto {
    @IsOptional()
    @IsArray()
    answers?: { questionId: string; answer: string }[];
}

export class ManageMemberDto {
    @IsString()
    userId: string;

    @IsEnum(['BAN', 'RESTRICT', 'UNRESTRICT', 'UNBAN', 'PROMOTE', 'DEMOTE', 'SET_POST_APPROVAL'])
    action: 'BAN' | 'RESTRICT' | 'UNRESTRICT' | 'UNBAN' | 'PROMOTE' | 'DEMOTE' | 'SET_POST_APPROVAL';

    @IsOptional()
    @IsBoolean()
    requiresApproval?: boolean;
}

export class TribeReportDto {
    @IsString()
    @IsNotEmpty()
    reason: string;

    @IsOptional()
    @IsString()
    details?: string;

    @IsOptional()
    @IsString()
    postId?: string;

    @IsOptional()
    @IsString()
    commentId?: string;
}
