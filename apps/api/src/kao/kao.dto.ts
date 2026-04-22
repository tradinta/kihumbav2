import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray, Min, Max } from 'class-validator';
import { ListingType, PropertyType, UtilityType } from '@prisma/client';

export class CreateKaoListingDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(PropertyType)
    type: PropertyType;

    @IsEnum(ListingType)
    @IsOptional()
    listingType?: ListingType;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsBoolean()
    @IsOptional()
    hasDeposit?: boolean;

    @IsNumber()
    @IsOptional()
    depositAmount?: number;

    @IsNumber()
    @IsOptional()
    serviceCharge?: number;

    @IsEnum(UtilityType)
    @IsOptional()
    electricityType?: UtilityType;

    @IsEnum(UtilityType)
    @IsOptional()
    waterType?: UtilityType;

    @IsString()
    @IsOptional()
    rentDeadline?: string;

    @IsString()
    @IsNotEmpty()
    county: string;

    @IsString()
    @IsNotEmpty()
    area: string;

    @IsNumber()
    @IsOptional()
    lat?: number;

    @IsNumber()
    @IsOptional()
    lng?: number;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    amenities?: string[];

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(5)
    safetyScore?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(5)
    friendlinessScore?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(5)
    proximityScore?: number;

    @IsString()
    @IsOptional()
    proximityDetails?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsBoolean()
    @IsOptional()
    isIndividual?: boolean;

    @IsNumber()
    @IsOptional()
    vacantCount?: number;
}

export class CreateKaoReviewDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    safety: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    proximity: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    water: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    electricity: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    environmentFriendliness: number;

    @IsString()
    @IsOptional()
    comment?: string;
}
