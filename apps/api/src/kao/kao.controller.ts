import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { KaoService } from './kao.service';
import { CreateKaoListingDto, CreateKaoReviewDto } from './kao.dto';
import { PropertyType, ListingType } from '@prisma/client';
import { AuthGuard } from '../auth/better-auth';

@Controller('kao')
export class KaoController {
    constructor(private readonly kaoService: KaoService) {}

    @Get('me')
    @UseGuards(AuthGuard)
    getMyActivity(@Req() req: any) {
        return this.kaoService.getMyActivity(req.user.id);
    }

    @Post('listings')
    @UseGuards(AuthGuard)
    createListing(@Req() req: any, @Body() dto: CreateKaoListingDto) {
        return this.kaoService.createListing(req.user.id, dto);
    }

    @Get('listings')
    getListings(
        @Query('type') type?: PropertyType,
        @Query('listingType') listingType?: ListingType,
        @Query('county') county?: string,
        @Query('area') area?: string,
        @Query('search') search?: string,
        @Query('authorId') authorId?: string,
    ) {
        return this.kaoService.getListings({ type, listingType, county, area, search, authorId });
    }

    @Get('listings/nearby')
    findNearby(
        @Query('lat') lat: string,
        @Query('lng') lng: string,
        @Query('radius') radius?: string,
    ) {
        return this.kaoService.findNearby(
            parseFloat(lat),
            parseFloat(lng),
            radius ? parseFloat(radius) : 5,
        );
    }

    @Get('listings/:id')
    getListingById(@Param('id') id: string) {
        return this.kaoService.getListingById(id);
    }

    @Post('listings/:id/reviews')
    @UseGuards(AuthGuard)
    addReview(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: CreateKaoReviewDto,
    ) {
        return this.kaoService.addReview(req.user.id, id, dto);
    }

    @Post('listings/:id/requests')
    @UseGuards(AuthGuard)
    createRequest(
        @Req() req: any,
        @Param('id') id: string,
        @Body('message') message?: string,
    ) {
        return this.kaoService.createRequest(req.user.id, id, message);
    }

    @Get('requests')
    @UseGuards(AuthGuard)
    getRequests(
        @Req() req: any,
        @Query('type') type: 'SENT' | 'RECEIVED',
    ) {
        return this.kaoService.getRequests(req.user.id, type);
    }

    @Post('requests/:id/status')
    @UseGuards(AuthGuard)
    updateStatus(
        @Req() req: any,
        @Param('id') id: string,
        @Body('status') status: 'ACCEPTED' | 'DECLINED',
    ) {
        return this.kaoService.updateRequestStatus(req.user.id, id, status);
    }


}
