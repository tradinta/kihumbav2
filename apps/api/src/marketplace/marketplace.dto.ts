import {
    IsString, IsNumber, IsEnum, IsOptional, IsArray, 
    IsUrl, MinLength, MaxLength, Min, Max, ArrayMaxSize,
} from 'class-validator';

export enum MarketCategory {
    ELECTRONICS = 'ELECTRONICS',
    FASHION = 'FASHION',
    VEHICLES = 'VEHICLES',
    FURNITURE = 'FURNITURE',
    SERVICES = 'SERVICES',
    BEAUTY = 'BEAUTY',
    BOOKS = 'BOOKS',
    SPORTS = 'SPORTS',
    HOME_GARDEN = 'HOME_GARDEN',
    OTHER = 'OTHER',
}

export enum TradeType {
    BUY = 'BUY',
    BARTER = 'BARTER',
    TRADE_CASH = 'TRADE_CASH',
}

export enum ItemCondition {
    NEW = 'NEW',
    LIKE_NEW = 'LIKE_NEW',
    GOOD = 'GOOD',
    FAIR = 'FAIR',
    FOR_PARTS = 'FOR_PARTS',
}

export class CreateListingDto {
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    title: string;

    @IsString()
    @MinLength(10)
    @MaxLength(2000)
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsEnum(MarketCategory)
    category: MarketCategory;

    @IsEnum(TradeType)
    tradeType: TradeType;

    @IsOptional()
    @IsString()
    barterFor?: string;

    @IsEnum(ItemCondition)
    condition: ItemCondition;

    @IsString()
    county: string;

    @IsString()
    area: string;

    @IsArray()
    @IsUrl({}, { each: true })
    @ArrayMaxSize(5, { message: 'Max 5 photos allowed' })
    images: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    whatsIncluded?: string[];

    @IsOptional()
    @IsString()
    sellerPhone?: string;
}

export class CreateOrderDto {
    @IsString()
    listingId: string;

    @IsNumber()
    @Min(0)
    amount: number;
}

export class AssignSaccoDto {
    @IsString()
    saccoName: string;

    @IsString()
    @IsOptional()
    driverName?: string;

    @IsString()
    @IsOptional()
    driverPhone?: string;
}

export class UpdateOrderStatusDto {
    @IsString()
    status: string; // OrderStatus enum string
}

export class VerifyDeliveryDto {
    @IsString()
    deliveryCode: string;
}
